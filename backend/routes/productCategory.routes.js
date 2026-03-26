import express from 'express';
const router = express.Router();
import { getAll, getOne, create, update, remove , getOneById  } from '../controllers/productCategory.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

router.get("/", getAll);
router.get("/:slug", getOne);
router.get("/single/:id", getOneById);

router.post("/", protect, upload.single("image"), create);
router.put("/:id", protect, upload.single("image"), update);
router.delete("/:id", protect, remove);

export default router;
