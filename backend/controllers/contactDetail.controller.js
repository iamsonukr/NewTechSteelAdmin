import ContactDetail from "../models/ContactDetail.js";

// @desc  Get all contact details
// @route GET /api/contact-details
export const getAll = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const contacts = await ContactDetail.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single contact detail
// @route GET /api/contact-details/:id
export const getOne = async (req, res) => {
  try {
    const contact = await ContactDetail.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create contact detail
// @route POST /api/contact-details
export const create = async (req, res) => {
  try {
    const data = { ...req.body };

    // Parse array/object fields if sent as JSON strings (FormData)
    if (data.phones && typeof data.phones === "string")       data.phones = JSON.parse(data.phones);
    if (data.emails && typeof data.emails === "string")       data.emails = JSON.parse(data.emails);
    if (data.address && typeof data.address === "string")     data.address = JSON.parse(data.address);
    if (data.socialLinks && typeof data.socialLinks === "string") data.socialLinks = JSON.parse(data.socialLinks);
    if (data.businessHours && typeof data.businessHours === "string") data.businessHours = JSON.parse(data.businessHours);

    // If this is set as primary, unset all others
    if (data.isPrimary === "true" || data.isPrimary === true) {
      await ContactDetail.updateMany({}, { isPrimary: false });
    }

    const contact = await ContactDetail.create(data);
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update contact detail
// @route PUT /api/contact-details/:id
export const update = async (req, res) => {
  try {
    const contact = await ContactDetail.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    const data = { ...req.body };
    if (data.phones && typeof data.phones === "string")           data.phones = JSON.parse(data.phones);
    if (data.emails && typeof data.emails === "string")           data.emails = JSON.parse(data.emails);
    if (data.address && typeof data.address === "string")         data.address = JSON.parse(data.address);
    if (data.socialLinks && typeof data.socialLinks === "string") data.socialLinks = JSON.parse(data.socialLinks);
    if (data.businessHours && typeof data.businessHours === "string") data.businessHours = JSON.parse(data.businessHours);

    if (data.isPrimary === "true" || data.isPrimary === true) {
      await ContactDetail.updateMany({ _id: { $ne: req.params.id } }, { isPrimary: false });
    }

    const updated = await ContactDetail.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete contact detail
// @route DELETE /api/contact-details/:id
export const remove = async (req, res) => {
  try {
    const contact = await ContactDetail.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.json({ success: true, message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
