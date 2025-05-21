# 📡 Signify API Backend

Ini adalah backend API untuk aplikasi **Signify** – Aplikasi Penerjemah Bahasa Isyarat Berbasis AI. Backend dibangun dengan [Hapi.js](https://hapi.dev/) dan menggunakan [Firebase Firestore](https://firebase.google.com/docs/firestore) sebagai database.

---

## 🚀 URL Server

- Lokal: `http://localhost:9000`
- Production: `https://signify-api.onrender.com/`

---

## ⚙️ Setup & Menjalankan Server

1. **Clone repo & install dependencies**
    ```bash
    npm install
    ```
2. **Buat file .env**
   ```bash
    FIREBASE_API_KEY=your_api_key
    FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    FIREBASE_APP_ID=your_app_id
    JWT_SECRET=your_jwt_secret
    ```

3. **Jalankan server**
    ```bash
    npm run start
    ```

## 🧪 Testing via Postman

1. **Register User**
    - Endpoint: ```POST /register```
    - Payload:
    ```json
    {
        "name": "Yudha",
        "email": "yudha@example.com",
        "password": "password123"
    }
    ```
    - Response:
    ```json
    {
        "status": "success",
        "message": "Registrasi berhasil. Silakan login."
    }
    ```

2. **Login User**
    - Endpoint: ```POST /login```
    - Payload:
    ```json
    {
        "email": "yudha@example.com",
        "password": "password123"
    }
    ```
    - Response:
    ```json
    {
        "status": "success",
        "message": "Login berhasil.",
        "data": {
            "token": "your.jwt.token",
            "user": {
                "name": "Yudha",
                "email": "yudha@example.com"
            }
    }
    }
    ```

3. **Get Profile (Protected)**
    - Endpoint: ```GET /profile```
    - Headers:
    ```makefile
    Authorization: Bearer <your_token>
    ```
    - Response:
    ```json
    {
        "status": "success",
        "message": "Profil pengguna berhasil diambil",
        "data": {
            "name": "Yudha",
            "email": "yudha@example.com"
        }
    }
    ```

## 📁 Struktur Folder
```
signify-api/
│
├── config/
│   └── firebase.js        # Inisialisasi Firebase
│
├── controllers/
│   └── authController.js  # Logic register & login
│
├── middleware/
│   └── authMiddleware.js  # JWT verifikasi token
│
├── routes/
│   └── routes.js          # Semua endpoint dikumpulkan di sini
│
├── .env                   # Variabel lingkungan
├── server.js              # Entry point
└── README.md              # Dokumentasi
```
