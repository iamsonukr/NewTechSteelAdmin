import Product from '../models/Product.js';
import fs from 'fs';

// @desc    Get all products
// @route   GET /api/products
export const getAll = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === "true") filter.isFeatured = true;

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
export const getOne = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single product by Id
// @route   GET /api/products/single/:id
export const getOneById = async (req, res) => {
  try {
    console.log("Fetching product with ID:", req.params.id);
    const product = await Product.findOne({ _id: req.params.id }).populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create product
// @route   POST /api/products
export const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.tags && typeof req.body.tags === "string")
      data.tags = req.body.tags.split(",").map((t) => t.trim());
    if (req.body.seo && typeof req.body.seo === "string")
      data.seo = JSON.parse(req.body.seo);
    if (req.files) {
      const imageFiles = req.files.images || [];
      const brochureFile = req.files.brochure ? req.files.brochure[0] : null;
      data.images = imageFiles.map((f) => `/${f.path.replace(/\\/g, "/")}`);
      if (brochureFile) data.brochure = `/${brochureFile.path.replace(/\\/g, "/")}`;
    }
    const product = await Product.create(data);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const update = async (req, res) => {
  try {
    console.log("Updating product with data:", req.body);
    console.log("Product ID:", req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const data = { ...req.body };
    if (req.body.tags && typeof req.body.tags === "string")
      data.tags = req.body.tags.split(",").map((t) => t.trim());
    if (req.body.seo && typeof req.body.seo === "string")
      data.seo = JSON.parse(req.body.seo);
    if (req.files) {
      const imageFiles = req.files.images || [];
      const brochureFile = req.files.brochure ? req.files.brochure[0] : null;
      if (imageFiles.length > 0) {
        product.images.forEach((img) => { try { fs.unlinkSync(`.${img}`); } catch (e) { } });
        data.images = imageFiles.map((f) => `/${f.path.replace(/\\/g, "/")}`);
      }
      if (brochureFile) {
        if (product.brochure) { try { fs.unlinkSync(`.${product.brochure}`); } catch (e) { } }
        data.brochure = `/${brochureFile.path.replace(/\\/g, "/")}`;
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const remove = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    product.images.forEach((img) => { try { fs.unlinkSync(`.${img}`); } catch (e) { } });
    if (product.brochure) { try { fs.unlinkSync(`.${product.brochure}`); } catch (e) { } }
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
