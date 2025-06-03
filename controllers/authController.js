import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import forbiddenKeywords from "../utils/forbiddenKeywords.js";
import { generateAvatarUrl } from "../utils/avatar.js";

// REGISTER
const register = async (request, h) => {
  const { name, email, password } = request.payload;

  // Validasi nama/email
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

  // Validasi password
  if (!password || password.length < 6) {
    return h
      .response({
        status: "fail",
        message: "Password minimal harus terdiri dari 6 karakter.",
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
    const avatarUrl = generateAvatarUrl(name);

    // Tambahkan user ke Firestore
    const docRef = await addDoc(collection(db, "users"), {
      name,
      email,
      password: hashedPassword,
      photoUrl: avatarUrl,
      createdAt: new Date().toISOString(),
    });

    // Generate token JWT
    const token = jwt.sign(
      {
        id: docRef.id,
        email,
        name,
        photoUrl: avatarUrl,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return h.response({
      status: "success",
      message: "Registrasi berhasil",
      data: {  // Tambahkan data token dan user
        token,
        user: {
          id: docRef.id,
          name,
          email,
          photoUrl: avatarUrl,
        },
      },
    }).code(201);
  } catch (err) {
    console.error(err);
    return h.response({
      status: "error",
      message: "Terjadi kesalahan saat registrasi",
    }).code(500);
  }
};

// LOGIN
const login = async (request, h) => {
  const { email, password } = request.payload;

  if (!password || password.length < 6) {
    return h
      .response({
        status: "fail",
        message: "Password tidak valid.",
      })
      .code(400);
  }

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

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return h
        .response({
          status: "fail",
          message: "Password salah.",
        })
        .code(401);
    }

    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl || null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return h
      .response({
        status: "success",
        message: "Login berhasil.",
        data: {
          token,
          user: {
            name: user.name,
            email: user.email,
            photoUrl: user.photoUrl || null,
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
