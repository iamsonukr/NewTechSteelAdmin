import express from "express";
import { getAll, getOne, create, update, remove } from "../controllers/heroBanner.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Public
router.get("/",       getAll);
router.get("/:id",    getOne);

// Protected
router.post("/",      protect, upload.single("backgroundImage"), create);
router.put("/:id",    protect, upload.single("backgroundImage"), update);
router.delete("/:id", protect, remove);

export default router;
