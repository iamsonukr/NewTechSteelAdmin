import express from "express";
import { getAll, getOne, getById, create, update, remove } from "../controllers/page.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Public
router.get("/",          getAll);
router.get("/id/:id",    getById);
router.get("/:slug",     getOne);

// Protected
router.post("/",         protect, upload.single("ogImage"), create);
router.put("/:id",       protect, upload.single("ogImage"), update);
router.delete("/:id",    protect, remove);

export default router;
