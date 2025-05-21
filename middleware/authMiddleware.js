import jwt from "jsonwebtoken";

export const verifyToken = async (request, h) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return h
        .response({
          status: "fail",
          message: "Token tidak ditemukan.",
        })
        .code(401)
        .takeover();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan user info di request.auth.credentials
    request.auth = {
      credentials: decoded,
    };

    return h.continue;
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Token tidak valid atau sudah kadaluarsa.",
      })
      .code(401)
      .takeover();
  }
};
