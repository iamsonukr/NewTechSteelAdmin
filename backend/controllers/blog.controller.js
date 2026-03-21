import Blog from '../models/Blog.js';
import fs from 'fs';

export const getAll = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true, isPublished: true };
    if (req.query.category) filter.category = req.query.category;

    const blogs = await Blog.find(filter)
      .populate("category", "name slug")
      .sort({ publishedAt: -1, createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("category", "name slug");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getOneById = async (req, res) => {
  try {
    
    const blog = await Blog.findOne({ _id: req.params.id }).populate("category", "name slug");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.tags && typeof req.body.tags === "string")
      data.tags = req.body.tags.split(",").map((t) => t.trim());
    if (req.body.seo && typeof req.body.seo === "string")
      data.seo = JSON.parse(req.body.seo);
    if (req.file) data.coverImage = `/${req.file.path.replace(/\\/g, "/")}`;

    const blog = await Blog.create(data);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const data = { ...req.body };
    if (req.body.tags && typeof req.body.tags === "string")
      data.tags = req.body.tags.split(",").map((t) => t.trim());
    if (req.body.seo && typeof req.body.seo === "string")
      data.seo = JSON.parse(req.body.seo);
    if (req.file) {
      if (blog.coverImage) { try { fs.unlinkSync(`.${blog.coverImage}`); } catch (e) {} }
      data.coverImage = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    if (blog.coverImage) { try { fs.unlinkSync(`.${blog.coverImage}`); } catch (e) {} }
    await blog.deleteOne();
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
