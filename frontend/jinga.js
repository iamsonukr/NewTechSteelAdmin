import axios from "axios";
import fs from "fs";

const BASE_URL = "https://newtechsteels.com/wp-json/wp/v2/posts";
const SITE_BASE_URL = "https://newtechsteels.com";
const PER_PAGE = 100;

const CATEGORY_MAP = {
  1: "65f1a2b3c4d5e6f789001111",
  2: "65f1a2b3c4d5e6f789001112",
  3: "65f1a2b3c4d5e6f789001113",
  4: "65f1a2b3c4d5e6f789001114",
};

const stripHTML = (html = "") =>
  html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();

const generateTags = (text) =>
  stripHTML(text)
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 6);

// ✅ Strip domain + date path → /uploads/blogs/filename.jpg
const normalizeImageUrl = (url = "") => {
  if (!url) return "";
  const filename = url.split("/").pop();
  return `/uploads/blogs/${filename}`;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchBlogs = async () => {
  try {
    let page = 1;
    let allPosts = [];

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

    const blogs = allPosts.map((post) => {
      const wpCategory = post.categories?.[0];
      const excerpt = stripHTML(post.excerpt?.rendered || "");
      const slug = post.slug || "";

      // ✅ Prefer Yoast canonical → fallback to constructed URL
      const canonicalUrl =
        post.yoast_head_json?.canonical ||
        `${SITE_BASE_URL}/blog/${slug}`;

      // ✅ Normalize cover image path
      const coverImage = normalizeImageUrl(
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
      );

      return {
        title: post.title?.rendered || "",
        slug,
        excerpt,
        content: post.content?.rendered || "",

        category: CATEGORY_MAP[wpCategory] ?? CATEGORY_MAP[1],

        coverImage,
        canonicalUrl,

        author: "Admin",
        tags: generateTags(post.title?.rendered || ""),

        isPublished: post.status === "publish",
        publishedAt: post.date || null,
        isActive: true,

        seo: {
          metaTitle:
            post.yoast_head_json?.title || post.title?.rendered || "",
          metaDescription:
            post.yoast_head_json?.description || excerpt.slice(0, 160),
          metaKeywords: generateTags(post.title?.rendered || ""),
        },

        createdAt: post.date || null,
        updatedAt: post.modified || null,
      };
    });

    fs.writeFileSync("./blogs.json", JSON.stringify(blogs, null, 2), "utf-8");
    console.log(`✅ blogs.json created with ${blogs.length} entries`);
  } catch (error) {
    if (error.response?.status === 400) {
      console.warn("⚠️ Reached beyond last page, stopping.");
      return;
    }
    console.error("❌ Error:", error.response?.data || error.message);
    process.exit(1);
  }
};

fetchBlogs();