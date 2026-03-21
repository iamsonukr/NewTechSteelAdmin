import express from "express";
import { getAll, getOne, create, update, remove } from "../controllers/contactDetail.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/",       getAll);
router.get("/:id",    getOne);

// Protected
router.post("/",      protect, create);
router.put("/:id",    protect, update);
router.delete("/:id", protect, remove);

export default router;
