import mongoose from "mongoose";

const businessHoursSchema = new mongoose.Schema({
  day:    { type: String },   // "Monday", "Monday - Friday"
  hours:  { type: String },   // "9:00 AM - 6:00 PM"
  closed: { type: Boolean, default: false },
}, { _id: false });

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String },  // "facebook", "instagram", "linkedin", "twitter", "youtube"
  url:      { type: String },
}, { _id: false });

const contactDetailSchema = new mongoose.Schema(
  {
    branchName:       { type: String, required: true, trim: true },  // e.g. "Head Office", "Delhi Branch"
    phones:           [{ type: String }],       // multiple phone numbers
    emails:           [{ type: String }],       // multiple emails
    address: {
      line1:    { type: String },
      line2:    { type: String },
      city:     { type: String },
      state:    { type: String },
      pincode:  { type: String },
      country:  { type: String, default: "India" },
    },
    whatsapp:         { type: String },
    googleMapsEmbed:  { type: String },         // full iframe embed URL
    googleMapsUrl:    { type: String },         // regular maps link
    socialLinks:      [socialLinkSchema],
    businessHours:    [businessHoursSchema],
    isPrimary:        { type: Boolean, default: false },  // is this the main branch?
    isActive:         { type: Boolean, default: true },
    order:            { type: Number, default: 0 },       // display order
  },
  { timestamps: true }
);

export default mongoose.model("ContactDetail", contactDetailSchema);
