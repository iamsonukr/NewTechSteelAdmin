import HeroBanner from "../models/HeroBanner.js";
import fs from "fs";

// @desc  Get all banners (optionally filtered by page)
// @route GET /api/hero-banners
export const getAll = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    if (req.query.page) filter.page = req.query.page;
    const banners = await HeroBanner.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: banners.length, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single banner
// @route GET /api/hero-banners/:id
export const getOne = async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create banner
// @route POST /api/hero-banners
export const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.backgroundImage = `/${req.file.path.replace(/\\/g, "/")}`;
    const banner = await HeroBanner.create(data);
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update banner
// @route PUT /api/hero-banners/:id
export const update = async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

    const data = { ...req.body };
    if (req.file) {
      if (banner.backgroundImage) { try { fs.unlinkSync(`.${banner.backgroundImage}`); } catch (e) {} }
      data.backgroundImage = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const updated = await HeroBanner.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete banner
// @route DELETE /api/hero-banners/:id
export const remove = async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
    if (banner.backgroundImage) { try { fs.unlinkSync(`.${banner.backgroundImage}`); } catch (e) {} }
    await banner.deleteOne();
    res.json({ success: true, message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
