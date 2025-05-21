import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const routes = [
  {
    method: "POST",
    path: "/register",
    handler: register,
  },
  {
    method: "POST",
    path: "/login",
    handler: login,
  },
  {
    method: "GET",
    path: "/profile",
    options: {
      pre: [{ method: verifyToken }],
      handler: (request, h) => {
        const user = request.auth.credentials;
        return h.response({
          status: "success",
          message: "Profil pengguna berhasil diambil",
          data: user,
        });
      },
    },
  },
];

export default routes;
