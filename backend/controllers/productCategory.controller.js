import ProductCategory from '../models/ProductCategory.js';
import fs from 'fs';

// @desc    Get all product categories
// @route   GET /api/product-categories
export const getAll = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const categories = await ProductCategory.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single product category
// @route   GET /api/product-categories/:slug
export const getOne = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getOneById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create product category
// @route   POST /api/product-categories
export const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/${req.file.path.replace(/\\/g, "/")}`;
    const category = await ProductCategory.create(data);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update product category
// @route   PUT /api/product-categories/:id
export const update = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    const data = { ...req.body };
    if (req.file) {
      // Delete old image
      if (category.image) { try { fs.unlinkSync(`.${category.image}`); } catch (e) {} }
      data.image = `/${req.file.path.replace(/\\/g, "/")}`;
    }
    const updated = await ProductCategory.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete product category
// @route   DELETE /api/product-categories/:id
export const remove = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    if (category.image) { try { fs.unlinkSync(`.${category.image}`); } catch (e) {} }
    await category.deleteOne();
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
