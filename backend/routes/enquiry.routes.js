import express from 'express';
const router = express.Router();
import { submit, getAll, getOne, updateStatus, remove, getStats } from '../controllers/enquiry.controller.js';
import { protect } from '../middleware/auth.middleware.js';

router.post("/", submit);                              // Public - submit enquiry
router.get("/stats", protect, getStats);               // Admin - get stats
router.get("/", protect, getAll);                      // Admin - get all
router.get("/:id", protect, getOne);                   // Admin - get one
router.patch("/:id/status", protect, updateStatus);    // Admin - update status
router.delete("/:id", protect, remove);                // Admin - delete

export default router;
