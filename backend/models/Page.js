import mongoose from "mongoose";
import slugify from "slugify";

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },           // e.g. "about-us"
    seo: {
      metaTitle:       { type: String },
      metaDescription: { type: String },
      metaKeywords:    [{ type: String }],
      canonicalUrl:    { type: String },
      ogTitle:         { type: String },
      ogDescription:   { type: String },
      ogImage:         { type: String },             // uploaded OG image URL
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

pageSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Page", pageSchema);
