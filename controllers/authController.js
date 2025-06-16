import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth, db } from "../config/firebase.js";
import forbiddenKeywords from "../utils/forbiddenKeywords.js";
import { generateAvatarUrl } from "../utils/avatar.js";

// REGISTER
const register = async (request, h) => {
  const { name, email, password } = request.payload;

  const isInvalidNameOrEmail = forbiddenKeywords.some(
    (keyword) =>
      name.toLowerCase().includes(keyword) || email.toLowerCase().includes(keyword)
  );
  if (isInvalidNameOrEmail) {
    return h.response({
      status: "fail",
      message: "Nama atau email tidak boleh mengandung kata terlarang.",
    }).code(400);
  }

  if (!password || password.length < 6) {
    return h.response({
      status: "fail",
      message: "Password minimal 6 karakter.",
    }).code(400);
  }

  try {
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where("email", "==", email).get();

    if (!userSnapshot.empty) {
      return h.response({
        status: "fail",
        message: "Email sudah digunakan.",
      }).code(400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarUrl = generateAvatarUrl(name);
    const docRef = await usersRef.add({
      name,
      email,
      password: hashedPassword,
      photoUrl: avatarUrl,
      createdAt: new Date().toISOString(),
    });

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
      data: {
        token,
        user: { id: docRef.id, name, email, photoUrl: avatarUrl },
      },
    }).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ status: "error", message: "Terjadi kesalahan." }).code(500);
  }
};

// LOGIN
const login = async (request, h) => {
  const { email, password } = request.payload;

  if (!password || password.length < 6) {
    return h.response({
      status: "fail",
      message: "Password tidak valid.",
    }).code(400);
  }

  try {
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where("email", "==", email).get();

    if (userSnapshot.empty) {
      return h.response({
        status: "fail",
        message: "Akun tidak ditemukan.",
      }).code(404);
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return h.response({ status: "fail", message: "Password salah." }).code(401);
    }

    const token = jwt.sign(
      {
        id: userDoc.id,
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return h.response({
      status: "success",
      message: "Login berhasil.",
      data: {
        token,
        user: {
          id: userDoc.id,
          name: user.name,
          email: user.email,
          photoUrl: user.photoUrl || null,
        },
      },
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ status: "error", message: "Gagal login." }).code(500);
  }
};

// LOGIN WITH GOOGLE
const loginWithGoogle = async (request, h) => {
  const { token } = request.payload;

  if (!token) {
    return h.response({ status: "fail", message: "Token tidak ditemukan." }).code(400);
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    const { uid, email, name, picture } = decoded;
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    const avatarUrl = generateAvatarUrl(name);

    if (!userDoc.exists) {
      await userRef.set({
        name: name || "Anonymous",
        email,
        photoUrl: picture || avatarUrl,
        createdAt: new Date().toISOString(),
      });
    }

    const jwtToken = jwt.sign(
      { id: uid, email, name, photoUrl: picture || avatarUrl },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return h.response({
      status: "success",
      message: "Login Google berhasil.",
      data: {
        token: jwtToken,
        user: {
          id: uid,
          name,
          email,
          photoUrl: picture || avatarUrl,
        },
      },
    }).code(200);
  } catch (err) {
    console.error("[LoginGoogleError]", err);
    return h.response({
      status: "error",
      message: "Token tidak valid.",
    }).code(401);
  }
};

export { register, login, loginWithGoogle };