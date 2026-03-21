import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload folders exist
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/misc";
    if (req.baseUrl.includes("product")) folder = "uploads/products";
    else if (req.baseUrl.includes("blog")) folder = "uploads/blogs";
    else if (req.baseUrl.includes("gallery")) folder = "uploads/gallery";
    else if (req.baseUrl.includes("category")) folder = "uploads/categories";
    ensureDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|pdf/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error("Only images (jpeg, jpg, png, gif, webp) and PDFs are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
