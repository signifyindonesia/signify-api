import admin from "firebase-admin";
import fs from "fs"; // Modul untuk membaca file

// Render akan meletakkan Secret File di path ini
const SECRET_FILE_PATH = "/etc/secrets/serviceAccount.json";

// Baca konten file JSON dan parse
const serviceAccount = JSON.parse(fs.readFileSync(SECRET_FILE_PATH, "utf8"));

// Inisialisasi Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Inisialisasi Firebase dari Secret File berhasil!");
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };
