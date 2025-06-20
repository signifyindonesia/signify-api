import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase.js";
import bcrypt from "bcrypt";

// GET PROFILE
const getProfile = async (request, h) => {
  const user = request.auth.credentials;

  return h
    .response({
      status: "success",
      message: "Profil berhasil diambil.",
      data: {
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl || null,
      },
    })
    .code(200);
};

// UPDATE PROFILE
const updateProfile = async (request, h) => {
  const { name, email } = request.payload;
  const currentUser = request.auth.credentials;

  try {
    const userSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", currentUser.email))
    );

    if (userSnapshot.empty) {
      return h
        .response({ status: "fail", message: "Pengguna tidak ditemukan." })
        .code(404);
    }

    if (email && email !== currentUser.email) {
      const emailCheck = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );
      if (!emailCheck.empty) {
        return h
          .response({
            status: "fail",
            message: "Email sudah digunakan.",
          })
          .code(400);
      }
    }

    const userDoc = userSnapshot.docs[0];
    const updatedName = name || currentUser.name;
    const updatedEmail = email || currentUser.email;

    await updateDoc(userDoc.ref, {
      name: updatedName,
      email: updatedEmail,
    });

    return h
      .response({
        status: "success",
        message: "Profil berhasil diperbarui.",
        data: {
          name: updatedName,
          email: updatedEmail,
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({ status: "error", message: "Gagal update profil." })
      .code(500);
  }
};

// UPDATE PASSWORD
const updatePassword = async (request, h) => {
  const { newPassword } = request.payload;
  const currentUser = request.auth.credentials;

  try {
    const userSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", currentUser.email))
    );

    if (userSnapshot.empty) {
      return h
        .response({ status: "fail", message: "Pengguna tidak ditemukan." })
        .code(404);
    }

    const userDoc = userSnapshot.docs[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updateDoc(userDoc.ref, { password: hashedPassword });

    return h
      .response({
        status: "success",
        message: "Password berhasil diperbarui.",
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({ status: "error", message: "Gagal update password." })
      .code(500);
  }
};

export { getProfile, updateProfile, updatePassword };
