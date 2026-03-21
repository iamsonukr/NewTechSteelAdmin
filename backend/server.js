import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import productCategoryRoutes from './routes/productCategory.routes.js';
import productRoutes from './routes/product.routes.js';
import blogCategoryRoutes from './routes/blogCategory.routes.js';
import blogRoutes from './routes/blog.routes.js';
import galleryCategoryRoutes from './routes/galleryCategory.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import enquiryRoutes from './routes/enquiry.routes.js';

import pageRoutes          from "./routes/page.routes.js";
import contactDetailRoutes from "./routes/contactDetail.routes.js";
import heroBannerRoutes    from "./routes/heroBanner.routes.js";
import { seed } from './seed.js';

dotenv.config();
connectDB();

const app = express();

// ✅ Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }, // ← add this

}));
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5176",
];

// ✅ CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Logger (only in dev)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Compression (faster responses)
app.use(compression());

// ✅ Static folder
// ✅ Static folder (with explicit CORS header)
app.use("/uploads", (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // ← add this
  res.setHeader("Vary", "Origin");
  next();
}, express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blog-categories', blogCategoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery-categories', galleryCategoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/enquiries', enquiryRoutes);

app.use("/api/pages",           pageRoutes);
app.use("/api/contact-details", contactDetailRoutes);
app.use("/api/hero-banners",    heroBannerRoutes);


// Health check
app.get("/seed",(req, res) => {
  // seed()
  res.json({ success: true, message: "API is running" });
});

// 404 handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
