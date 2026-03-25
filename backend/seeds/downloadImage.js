import axios from "axios";
import fs from "fs";
import path from "path";

const BASE_URL = "https://newtechsteels.com/wp-json/wp/v2/posts";
const PER_PAGE = 100;
const OUTPUT_DIR = "./uploads/blogs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const downloadImage = async (url, destPath) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(destPath, response.data);
};

const downloadAllImages = async () => {
  try {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    let page = 1;
    let allPosts = [];

    // ✅ Fetch all posts fresh from WP API
    while (true) {
      const response = await axios.get(BASE_URL, {
        params: { _embed: true, per_page: PER_PAGE, page },
      });

      const posts = response.data;
      const totalPages = parseInt(
        response.headers["x-wp-totalpages"] || "1",
        10
      );

      if (!posts.length) break;

      allPosts = [...allPosts, ...posts];
      console.log(`📄 Fetched page ${page} of ${totalPages}`);

      if (page >= totalPages) break;
      page++;
      await sleep(300);
    }

    console.log(`✅ Total posts fetched: ${allPosts.length}`);

    const total = allPosts.length;
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const [index, post] of allPosts.entries()) {
      // ✅ Get original image URL directly from WP API response
      const imageUrl =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

      if (!imageUrl) {
        console.warn(`⚠️  [${index + 1}/${total}] No image — skipping: ${post.title?.rendered}`);
        skipped++;
        continue;
      }

      const filename = imageUrl.split("/").pop();
      const destPath = path.join(OUTPUT_DIR, filename);

      // ✅ Skip if already downloaded
      if (fs.existsSync(destPath)) {
        console.log(`⏭️  [${index + 1}/${total}] Already exists — skipping: ${filename}`);
        skipped++;
        continue;
      }

      try {
        await downloadImage(imageUrl, destPath);
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
    if (error.response?.status === 400) {
      console.warn("⚠️ Reached beyond last page, stopping.");
      return;
    }
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

downloadAllImages();