import express from 'express';
const router = express.Router();
import { getAll, getOne,getOneById, create, update, remove } from '../controllers/blog.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

router.get("/", getAll);
router.get("/:id", getOneById);
router.get("/:slug", getOne);

router.post("/", protect, upload.single("coverImage"), create);
router.put("/:id", protect, upload.single("coverImage"), update);
router.delete("/:id", protect, remove);

export default router;
