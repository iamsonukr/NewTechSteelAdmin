import express from 'express';
const router = express.Router();
import { login, getMe, register, updatePassword } from '../controllers/auth.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/register", protect, adminOnly, register);
router.put("/update-password", protect, updatePassword);

export default router;
