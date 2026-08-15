import { getMe, login, register } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRoutes = async (app) => {
    app.post("/register", register);
    app.post("/login", login);
    app.get("/me",{preHandler: authMiddleware,}, getMe);
};

export default authRoutes;