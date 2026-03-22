import { Router } from "express";
import { login, getMe, updateCredentials } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();


router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.put("/update", authMiddleware, updateCredentials);

export default router;
