import Page from "../models/Page.js";
import fs from "fs";

// @desc  Get all pages
// @route GET /api/pages
export const getAll = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const pages = await Page.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: pages.length, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single page by slug
// @route GET /api/pages/:slug
export const getOne = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single page by ID
// @route GET /api/pages/id/:id
export const getById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create page
// @route POST /api/pages
export const create = async (req, res) => {
  try {
    const data = { ...req.body };

    // Parse seo if sent as JSON string (FormData)
    if (data.seo && typeof data.seo === "string") data.seo = JSON.parse(data.seo);
    if (data.seo?.metaKeywords && typeof data.seo.metaKeywords === "string") {
      data.seo.metaKeywords = data.seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean);
    }

    // OG image upload
    if (req.file) data.seo = { ...data.seo, ogImage: `/${req.file.path.replace(/\\/g, "/")}` };

    const page = await Page.create(data);
    res.status(201).json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update page
// @route PUT /api/pages/:id
export const update = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });

    const data = { ...req.body };
    if (data.seo && typeof data.seo === "string") data.seo = JSON.parse(data.seo);
    if (data.seo?.metaKeywords && typeof data.seo.metaKeywords === "string") {
      data.seo.metaKeywords = data.seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean);
    }

    if (req.file) {
      // Delete old OG image
      if (page.seo?.ogImage) { try { fs.unlinkSync(`.${page.seo.ogImage}`); } catch (e) {} }
      data.seo = { ...data.seo, ogImage: `/${req.file.path.replace(/\\/g, "/")}` };
    }

    const updated = await Page.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete page
// @route DELETE /api/pages/:id
export const remove = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    if (page.seo?.ogImage) { try { fs.unlinkSync(`.${page.seo.ogImage}`); } catch (e) {} }
    await page.deleteOne();
    res.json({ success: true, message: "Page deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
