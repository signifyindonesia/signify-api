import { register, login } from "../controllers/authController.js";
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

  // CATCH-ALL
  {
    method: "*",
    path: "/{any*}",
    handler: notFoundHandler,
  },
];

export default routes;
