import Gallery from '../models/Gallery.js';
import fs from 'fs';

export const getAll = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === "true") filter.isFeatured = true;

    const gallery = await Gallery.find(filter)
      .populate("category", "name slug")
      .sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: gallery.length, data: gallery });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id).populate("category", "name slug");
    if (!item) return res.status(404).json({ success: false, message: "Gallery item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/${req.file.path.replace(/\\/g, "/")}`;
    const item = await Gallery.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Gallery item not found" });

    const data = { ...req.body };
    if (req.file) {
      if (item.image) { try { fs.unlinkSync(`.${item.image}`); } catch (e) {} }
      data.image = `/${req.file.path.replace(/\\/g, "/")}`;
    }
    const updated = await Gallery.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Gallery item not found" });
    if (item.image) { try { fs.unlinkSync(`.${item.image}`); } catch (e) {} }
    await item.deleteOne();
    res.json({ success: true, message: "Gallery item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
