import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import notFoundHandler from "../controllers/notFoundController.js";
import profileHandler from "../controllers/profileController.js";

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
    handler: profileHandler,
    options: {
      pre: [{ method: verifyToken }],
    },
  },
  {
    method: "*",
    path: "/{any*}",
    handler: notFoundHandler,
  },
];

export default routes;
