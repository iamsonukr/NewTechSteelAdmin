import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "GalleryCategory" },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
