import express from 'express';
const router = express.Router();
import { getAll, getOne, create, update, remove, getOneById } from '../controllers/galleryCategory.controller.js';
import { protect } from '../middleware/auth.middleware.js';

router.get("/", getAll);
router.get("/:slug", getOne);
router.get("/single/:id", getOneById);

router.post("/", protect, create);
router.put("/:id", protect, update);
router.delete("/:id", protect, remove);

export default router;
