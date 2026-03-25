import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import connectDB from "../config/db.js";
import BlogCategory from "../models/BlogCategory.js";

dotenv.config();

const categories = [
  {
    _id: new mongoose.Types.ObjectId("65f1a2b3c4d5e6f789001111"),
    name: "General",
    description: "General steel industry news and updates",
  },
  {
    _id: new mongoose.Types.ObjectId("65f1a2b3c4d5e6f789001112"),
    name: "Industry",
    description: "Steel industry trends, insights and analysis",
  },
  {
    _id: new mongoose.Types.ObjectId("65f1a2b3c4d5e6f789001113"),
    name: "Agriculture",
    description: "Steel applications and solutions in agriculture",
  },
  {
    _id: new mongoose.Types.ObjectId("65f1a2b3c4d5e6f789001114"),
    name: "Maintenance",
    description: "Steel maintenance tips, guides and best practices",
  },
];

const seedCategories = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    let inserted = 0;
    let failed = 0;

    for (const category of categories) {
      try {
        const doc = new BlogCategory({
          _id: category._id,
          name: category.name,
          description: category.description,
          isActive: true,
          // ✅ manually slugify — pre("save") runs since we use .save()
          slug: slugify(category.name, { lower: true, strict: true }),
        });

        await doc.save();
        console.log(`✅ Inserted: ${category.name} → ${category._id}`);
        inserted++;
      } catch (err) {
        console.warn(`❌ Failed "${category.name}": ${err.message}`);
        failed++;
      }
    }

    console.log("─────────────────────────────────────");
    console.log(`✅ Inserted : ${inserted}`);
    console.log(`❌ Failed   : ${failed}`);
    console.log("─────────────────────────────────────");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

seedCategories();