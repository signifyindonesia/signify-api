import { register, login, loginWithGoogle } from "../controllers/authController.js";
import {
  getProfile,
  updateProfile,
  updatePassword,
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import notFoundHandler from "../controllers/notFoundController.js";

const routes = [
  // AUTH
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
    method: "POST",
    path: "/google",
    handler: loginWithGoogle,
  },

  // PROFILE (protected)
  {
    method: "GET",
    path: "/profile",
    handler: getProfile,
    options: {
      pre: [{ method: verifyToken }],
    },
  },
  {
    method: "PUT",
    path: "/profile",
    handler: updateProfile,
    options: {
      pre: [{ method: verifyToken }],
    },
  },

  {
    method: "PUT",
    path: "/profile/password",
    handler: updatePassword,
    options: {
      pre: [{ method: verifyToken }],
    },
  },

  // Health
  {
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
      return h.response({ status: 'ok' }).code(200);
    }
  },  

  // CATCH-ALL
  {
    method: "*",
    path: "/{any*}",
    handler: notFoundHandler,
  },
];

export default routes;
