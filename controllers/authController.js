import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import forbiddenKeywords from "../utils/forbiddenKeywords.js";

// REGISTER
const register = async (request, h) => {
  const { name, email, password } = request.payload;

  const isInvalidNameOrEmail = forbiddenKeywords.some(
    (keyword) =>
      name.toLowerCase().includes(keyword) ||
      email.toLowerCase().includes(keyword)
  );

  if (isInvalidNameOrEmail) {
    return h
      .response({
        status: "fail",
        message:
          "Nama atau email tidak boleh mengandung kata terlarang seperti 'admin'.",
      })
      .code(400);
  }
  
  try {
    const userSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );

    if (!userSnapshot.empty) {
      return h
        .response({
          status: "fail",
          message: "Email sudah terdaftar. Silakan gunakan email lain.",
        })
        .code(400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await addDoc(collection(db, "users"), {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    return h
      .response({
        status: "success",
        message: "Registrasi berhasil. Silakan login.",
      })
      .code(201);
  } catch (err) {
    console.error(err);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan saat registrasi.",
      })
      .code(500);
  }
};

// LOGIN
const login = async (request, h) => {
  const { email, password } = request.payload;

  try {
    const userSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );

    if (userSnapshot.empty) {
      return h
        .response({
          status: "fail",
          message: "Akun tidak ditemukan.",
        })
        .code(404);
    }

    const user = userSnapshot.docs[0].data();
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return h
        .response({
          status: "fail",
          message: "Password salah.",
        })
        .code(401);
    }

    const token = jwt.sign({ email, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return h
      .response({
        status: "success",
        message: "Login berhasil.",
        data: {
          token,
          user: {
            name: user.name,
            email: user.email,
          },
        },
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan saat login.",
      })
      .code(500);
  }
};

export { register, login };
