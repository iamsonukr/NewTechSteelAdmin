import axios from "axios";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = "/uploads/gallery";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

const downloadGalleryImages = async () => {
  try {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const total = images.length;
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const [index, url] of images.entries()) {
      const filename = url.split("/").pop();
      const destPath = path.join(OUTPUT_DIR, filename);

      // ✅ Skip if already downloaded
      if (fs.existsSync(destPath)) {
        console.log(`⏭️  [${index + 1}/${total}] Already exists — skipping: ${filename}`);
        skipped++;
        continue;
      }

      try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(destPath, response.data);
        console.log(`✅ [${index + 1}/${total}] Downloaded: ${filename}`);
        downloaded++;
      } catch (err) {
        console.warn(`❌ [${index + 1}/${total}] Failed "${filename}": ${err.message}`);
        failed++;
      }

      await sleep(200);
    }

    console.log("─────────────────────────────────────");
    console.log(`✅ Downloaded : ${downloaded}`);
    console.log(`⏭️  Skipped   : ${skipped}`);
    console.log(`❌ Failed     : ${failed}`);
    console.log("─────────────────────────────────────");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

downloadGalleryImages();