import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import slugify from "slugify"; // ✅ same lib your schema uses
import Blog from "../models/Blog.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedBlogs = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const raw = fs.readFileSync("./blogs.json", "utf-8");
    const blogs = JSON.parse(raw);
    console.log(`📦 Total blogs to seed: ${blogs.length}`);

    let inserted = 0;
    let failed = 0;

    for (const blog of blogs) {
      try {
        const doc = new Blog({
          title: blog.title,
          // ✅ manually slugify — pre("save") won't run on insertMany
          slug: blog.slug || slugify(blog.title, { lower: true, strict: true }),
          excerpt: blog.excerpt,
          content: blog.content,
          // ✅ make sure category is a valid ObjectId
          category: new mongoose.Types.ObjectId(blog.category),
          coverImage: blog.coverImage,
          author: blog.author || "Admin",
          tags: blog.tags || [],
          canonicalUrl: blog.canonicalUrl || "",
          isPublished: blog.isPublished ?? false,
          publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : null,
          isActive: blog.isActive ?? true,
          scheduledDate: blog.createdAt ? new Date(blog.createdAt) : new Date(),
          seo: {
            metaTitle: blog.seo?.metaTitle || blog.title,
            metaDescription: blog.seo?.metaDescription || blog.excerpt?.slice(0, 160) || "",
            metaKeywords: blog.seo?.metaKeywords || [],
          },
          createdAt: blog.createdAt ? new Date(blog.createdAt) : new Date(),
          updatedAt: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
        });

        // ✅ .save() triggers pre("save") hook properly
        await doc.save();
        console.log(`✅ Inserted: ${blog.title}`);
        inserted++;
      } catch (err) {
        console.warn(`❌ Failed "${blog.title}": ${err.message}`);
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

// seedBlogs();