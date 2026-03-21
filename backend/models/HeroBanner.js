import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema(
  {
    page:            { type: String, required: true },   // "home", "about", "products", or page slug
    title:           { type: String },
    subtitle:        { type: String },
    description:     { type: String },
    buttonText:      { type: String },
    buttonLink:      { type: String },
    backgroundImage: { type: String },                   // uploaded image URL
    overlayOpacity:  { type: Number, default: 50 },     // 0-100
    alignment:       { type: String, enum: ["left", "center", "right"], default: "center" },
    isActive:        { type: Boolean, default: true },
    order:           { type: Number, default: 0 },       // if multiple banners per page (slider)
  },
  { timestamps: true }
);

export default mongoose.model("HeroBanner", heroBannerSchema);
