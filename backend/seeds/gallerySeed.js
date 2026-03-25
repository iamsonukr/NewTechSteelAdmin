import mongoose from "mongoose";
import dotenv from "dotenv";
import Gallery from "../models/Gallery.js";
import connectDB from "../config/db.js";

dotenv.config();

const CATEGORY_ID = new mongoose.Types.ObjectId("69c236d9779335ed349007ac");

const images = [
    "https://newtechsteels.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-24-at-8.21.04-PM-2.jpeg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/04/20240301_131206-Medium.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/05/2.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/04/20240301_160042-Medium.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/05/1.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/05/3.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2023/11/CEO.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/04/20240228_153249-Medium.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2023/04/IMG-20221128-WA0024.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/04/2.png.webp",
    "https://newtechsteels.com/wp-content/uploads/2023/04/WhatsApp-Image-2022-04-09-at-12.50.21-1.jpeg.webp",
    "https://newtechsteels.com/wp-content/uploads/2023/04/IMG-20220723-WA0034.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2023/04/100KL-tank-Banur-2.jpg",
    "https://newtechsteels.com/wp-content/uploads/2023/04/IMG-20220611-WA0014.jpg",
    "https://newtechsteels.com/wp-content/uploads/2023/04/IMG-20210402-WA0025.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2023/05/hopper_bottom_silos.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/01/3.jpeg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/02/IMG-20221119-WA0007.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/03/1-2-scaled-1.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/05/4.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/03/1-2048x1365-1.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/04/image_2024_03_13T12_23_21_373Z.png.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/04/our_silos-e1681209053854.webp",
    "https://newtechsteels.com/wp-content/uploads/2024/04/IMG-20220723-WA0034-768x1024-1.webp",
    "https://newtechsteels.com/wp-content/uploads/2023/11/Elevating-Water-Storage-with-Zinc-alume-Water-Tanks-NEW.jpg.webp",
    "https://newtechsteels.com/wp-content/uploads/2025/06/Bhutan-1.webp",
    "https://newtechsteels.com/wp-content/uploads/2025/06/IMG_1573-scaled.webp",
    "https://newtechsteels.com/wp-content/uploads/2025/06/IMG_2241-scaled.webp",
    "https://newtechsteels.com/wp-content/uploads/2025/06/IMG_2278-1-scaled.webp",
    "https://newtechsteels.com/wp-content/uploads/2025/06/WhatsApp-Image-2025-04-15-at-11.44.47.webp",
    "https://newtechsteels.com/wp-content/uploads/2025/06/WhatsApp-Image-2025-05-03-at-1.32.43-PM.webp",
    "https://newtechsteels.com/wp-content/uploads/2025/06/WhatsApp-Image-2025-05-16-at-17.52.30-scaled.webp",
    "https://newtechsteels.com/wp-content/uploads/2025/06/WhatsApp-Image-2025-05-16-at-17.58.46-2.webp",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-08-19-at-13.36.53.jpeg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-08-19-at-16.31.24.jpeg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-10-18-at-08.19.01.jpeg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/IMG_20251007_134444_710-scaled.jpg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/IMG_20251007_140036_389-scaled.jpg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-08-07-at-11.22.24-2.jpeg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-08-19-at-16.59.16.jpeg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-08-20-at-16.52.58.jpeg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-08-06-at-12.52.01.jpeg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-08-06-at-12.51.43.jpeg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-08-06-at-12.49.40.jpeg",
    "https://newtechsteels.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-04-18-at-10.00.49-2.jpeg",
];

const seedGallery = async () => {
    try {
        await connectDB()
        console.log("✅ Connected to MongoDB");

        let inserted = 0;
        let failed = 0;

        for (const [index, url] of images.entries()) {
            try {
                const filename = url.split("/").pop();

                const doc = new Gallery({
                    image: `/uploads/gallery/${filename}`, // ✅ normalized local path
                    category: CATEGORY_ID,
                    order: index + 1,
                    isActive: true,
                    isFeatured: false,
                });

                await doc.save();
                console.log(`✅ [${index + 1}/${images.length}] Inserted: ${filename}`);
                inserted++;
            } catch (err) {
                console.warn(`❌ [${index + 1}/${images.length}] Failed: ${err.message}`);
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

seedGallery();