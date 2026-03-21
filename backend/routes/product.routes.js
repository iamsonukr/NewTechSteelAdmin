import express from 'express';
const router = express.Router();
import { getAll, getOne, create, update, remove, getOneById } from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const productUpload = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "brochure", maxCount: 1 },
]);

router.get("/", getAll);
router.get("/:slug", getOne);
router.get("/single/:id", getOneById);

router.post("/", protect, productUpload, create);
router.put("/:id", protect, productUpload, update);
router.delete("/:id", protect, remove);

export default router;
