import Enquiry from '../models/Enquiry.js';

// @desc    Submit enquiry (public)
// @route   POST /api/enquiries
export const submit = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ success: true, message: "Enquiry submitted successfully", data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all enquiries (admin)
// @route   GET /api/enquiries
export const getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;

    const enquiries = await Enquiry.find(filter)
      .populate("productRef", "name slug")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single enquiry (admin)
// @route   GET /api/enquiries/:id
export const getOne = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate("productRef", "name slug");
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });

    // Auto mark as read
    if (enquiry.status === "new") {
      enquiry.status = "read";
      await enquiry.save();
    }
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update enquiry status (admin)
// @route   PATCH /api/enquiries/:id/status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete enquiry (admin)
// @route   DELETE /api/enquiries/:id
export const remove = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });
    res.json({ success: true, message: "Enquiry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get enquiry stats (admin)
// @route   GET /api/enquiries/stats
export const getStats = async (req, res) => {
  try {
    const total = await Enquiry.countDocuments();
    const newCount = await Enquiry.countDocuments({ status: "new" });
    const readCount = await Enquiry.countDocuments({ status: "read" });
    const repliedCount = await Enquiry.countDocuments({ status: "replied" });
    const closedCount = await Enquiry.countDocuments({ status: "closed" });
    res.json({
      success: true,
      data: { total, new: newCount, read: readCount, replied: repliedCount, closed: closedCount },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
