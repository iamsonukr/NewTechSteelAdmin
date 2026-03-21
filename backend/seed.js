import dotenv from 'dotenv';
import connectDB from './config/db.js';
import AdminUser from './models/AdminUser.js';
import mongoose from "mongoose";

dotenv.config();


// Models
import ProductCategory from "./models/ProductCategory.js";
import Product from "./models/Product.js";
import BlogCategory from "./models/BlogCategory.js";
import Blog from "./models/Blog.js";
import ContactDetail from "./models/ContactDetail.js";
import Page from "./models/Page.js";
import HeroBanner from "./models/HeroBanner.js";

connectDB();

export const seed = async () => {
  try {
    console.log("🌱 Starting seed...\n");

    // ─────────────────────────────────────────────────────────────────────────
    // CLEAR EXISTING DATA
    // ─────────────────────────────────────────────────────────────────────────
    await Promise.all([
      ProductCategory.deleteMany({}),
      Product.deleteMany({}),
      BlogCategory.deleteMany({}),
      Blog.deleteMany({}),
      ContactDetail.deleteMany({}),
      Page.deleteMany({}),
      HeroBanner.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data\n");

    // ─────────────────────────────────────────────────────────────────────────
    // 1. PRODUCT CATEGORIES
    // ─────────────────────────────────────────────────────────────────────────
    const [zincAluminiumCat, silosCat, fusionEpoxyCat] = await ProductCategory.insertMany([
      {
        name: "Zinc Aluminium Tank",
        slug: "zinc-aluminium-tank",
        description: "Premium Zinc Aluminium water tanks meeting Australian AS 1397:2002, American ASTM A792M, and Indian Standards IS15961:2012 & ISO 9364.",
        isActive: true,
      },
      {
        name: "Silos",
        slug: "silos",
        description: "Advanced grain and material silos engineered for both short-term and long-term storage needs including Hopper Bottom and Flat Bottom configurations.",
        isActive: true,
      },
      {
        name: "Fusion Bond Epoxy Tank",
        slug: "fusion-bond-epoxy-tank",
        description: "Epoxy coated tanks providing superior corrosion protection for carbon steel storage tanks across diverse industrial applications.",
        isActive: true,
      },
    ]);
    console.log("✅ Product Categories seeded (3)");

    // ─────────────────────────────────────────────────────────────────────────
    // 2. PRODUCTS
    // ─────────────────────────────────────────────────────────────────────────
    await Product.insertMany([
      // ── Zinc Aluminium Tank products ──────────────────────────────────────
      {
        name: "Aluminium Water Tank",
        slug: "aluminium-water-tank",
        shortDescription: "Premium Aluminium Water Tanks with innovative designs for reliable and hygienic water storage solutions.",
        description: "<p>NewTech Steels comes to you with innovative designs for water storage: premium Aluminium Water Tanks crafted to meet international standards. Our aluminium tanks are lightweight, corrosion-resistant, and built for long-lasting performance across residential, commercial, and industrial applications.</p>",
        specifications: "<table><tbody><tr><td><strong>Material</strong></td><td>High-grade Aluminium</td></tr><tr><td><strong>Standards</strong></td><td>IS15961:2012, ISO 9364</td></tr><tr><td><strong>Applications</strong></td><td>Potable water, Raw water, RO water</td></tr><tr><td><strong>pH Range</strong></td><td>3 to 12</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: true,
        isActive: true,
        tags: ["aluminium", "water tank", "storage", "overhead"],
        seo: {
          metaTitle: "Aluminium Water Tank Manufacturer | NewTech Steels",
          metaDescription: "Buy premium quality Aluminium Water Tanks from NewTech Steels. Lightweight, corrosion-resistant tanks for residential, commercial & industrial use. Call +91 9205066671",
          metaKeywords: ["aluminium water tank", "aluminium tank manufacturer", "water storage tank", "newtech steels"],
          canonicalUrl: "https://newtechsteels.com/new/aluminium-water-tank/",
        },
      },
      {
        name: "DM Water Tank",
        slug: "dm-water-tank",
        shortDescription: "Robust and reliable Demineralized Water Storage Tanks engineered for high-purity water applications.",
        description: "<p>NewTech Steels manufactures DM Water Tanks — robust and reliable solutions for demineralized water storage applications across pharmaceutical, power plant, and industrial sectors. Our DM tanks ensure zero contamination and maximum purity of stored water.</p>",
        specifications: "<table><tbody><tr><td><strong>Material</strong></td><td>Zinc Aluminium Alloy</td></tr><tr><td><strong>Application</strong></td><td>Demineralized Water Storage</td></tr><tr><td><strong>Industries</strong></td><td>Pharmaceutical, Power Plants, Textile</td></tr><tr><td><strong>Standards</strong></td><td>ASTM A792M, IS15961:2012</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: false,
        isActive: true,
        tags: ["DM water", "demineralized", "water tank", "industrial"],
        seo: {
          metaTitle: "DM Water Tank Manufacturer India | NewTech Steels Ghaziabad",
          metaDescription: "NewTech Steels manufactures high-quality DM Water Tanks for demineralized water storage. Ideal for pharmaceutical, textile & industrial use. Contact us today.",
          metaKeywords: ["DM water tank", "demineralized water tank", "water storage", "industrial tank"],
          canonicalUrl: "https://newtechsteels.com/new/dm-water-tank/",
        },
      },
      {
        name: "Galvanised Steel Water Tank",
        slug: "galvanised-steel-water-tank",
        shortDescription: "Highly durable Galvanised Steel Water Tanks exceeding standards in durability, hygiene, and corrosion resistance.",
        description: "<p>NewTech Steels is proud to provide Galvanised Steel Water Tanks that are guaranteed to far exceed known standards in durability, hygiene, and long-term performance. Our galvanised tanks offer superior corrosion resistance and are ideal for large-scale water storage requirements.</p>",
        specifications: "<table><tbody><tr><td><strong>Material</strong></td><td>Galvanised Steel (Zinc coated)</td></tr><tr><td><strong>Coating</strong></td><td>Hot-dip galvanisation</td></tr><tr><td><strong>Standards</strong></td><td>IS 277, ASTM A792M</td></tr><tr><td><strong>Applications</strong></td><td>Industrial, Commercial, Municipal</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: true,
        isActive: true,
        tags: ["galvanised", "steel tank", "water storage", "corrosion resistant"],
        seo: {
          metaTitle: "Galvanised Steel Water Tank | NewTech Steels India",
          metaDescription: "Premium Galvanised Steel Water Tanks by NewTech Steels. Superior corrosion resistance, long-lasting durability. Ideal for industrial & municipal use.",
          metaKeywords: ["galvanised steel water tank", "galvanized tank", "steel water tank", "corrosion resistant tank"],
          canonicalUrl: "https://newtechsteels.com/new/galvanised-steel-water-tank/",
        },
      },
      {
        name: "Industrial Fire Water Tank",
        slug: "industrial-fire-water-tank",
        shortDescription: "Purpose-built Industrial Fire Water Tanks ensuring reliable fire safety compliance for industrial and commercial facilities.",
        description: "<p>Fire safety is a critical requirement in industrial environments. NewTech Steels manufactures Industrial Fire Water Tanks specifically designed to meet fire fighting requirements. Our tanks comply with fire safety standards and ensure immediate water availability during emergencies.</p>",
        specifications: "<table><tbody><tr><td><strong>Purpose</strong></td><td>Fire Fighting Water Storage</td></tr><tr><td><strong>Material</strong></td><td>Zinc Aluminium / Galvanised Steel</td></tr><tr><td><strong>Compliance</strong></td><td>Fire Safety Standards</td></tr><tr><td><strong>Capacity Range</strong></td><td>As per requirement</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: false,
        isActive: true,
        tags: ["fire water tank", "fire safety", "industrial", "firefighting"],
        seo: {
          metaTitle: "Industrial Fire Water Tank Manufacturer | NewTech Steels",
          metaDescription: "Reliable Industrial Fire Water Tanks by NewTech Steels for fire safety compliance. Purpose-built for industrial, commercial & institutional facilities.",
          metaKeywords: ["fire water tank", "industrial fire tank", "firefighting tank", "fire safety storage"],
          canonicalUrl: "https://newtechsteels.com/new/industrial-fire-water-tank/",
        },
      },
      {
        name: "Industrial Over Head Tank",
        slug: "industrial-over-head-tank",
        shortDescription: "Reliable Industrial Over Head Tank solutions for consistent gravity-fed water supply across large industrial facilities.",
        description: "<p>NewTech Steels proudly manufactures reliable Industrial Over Head Tanks in India. Engineered for consistent water supply through gravity feed, our overhead tanks are designed for large industrial complexes, factories, and commercial establishments requiring high-volume water distribution.</p>",
        specifications: "<table><tbody><tr><td><strong>Type</strong></td><td>Elevated / Overhead</td></tr><tr><td><strong>Material</strong></td><td>Zinc Aluminium Alloy</td></tr><tr><td><strong>Mounting</strong></td><td>MS Structure / RCC Platform</td></tr><tr><td><strong>Capacity</strong></td><td>Custom as per requirement</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: true,
        isActive: true,
        tags: ["overhead tank", "industrial", "elevated tank", "water supply"],
        seo: {
          metaTitle: "Industrial Over Head Tank Manufacturer India | NewTech Steels",
          metaDescription: "Leading Industrial Over Head Tank Manufacturer in India. NewTech Steels provides custom overhead tanks for factories, industries & large establishments.",
          metaKeywords: ["industrial overhead tank", "over head tank manufacturer", "elevated water tank", "industrial water supply"],
          canonicalUrl: "https://newtechsteels.com/new/industrial-over-head-tank-manufacturer/",
        },
      },
      {
        name: "Overhead Water Tank",
        slug: "overhead-water-tank",
        shortDescription: "Practical and efficient Overhead Water Tanks for consistent water supply in urban and industrial settings.",
        description: "<p>Providing safe and consistent water storage is one of the most critical needs in urban and industrial settings. NewTech Steels Overhead Water Tanks are a very practical solution, combining high-quality materials with precision engineering for reliable daily water supply.</p>",
        specifications: "<table><tbody><tr><td><strong>Material</strong></td><td>Zinc Aluminium</td></tr><tr><td><strong>Standards</strong></td><td>Australian AS 1397:2002, IS15961:2012</td></tr><tr><td><strong>Applications</strong></td><td>Residential, Commercial, Industrial</td></tr><tr><td><strong>Installation</strong></td><td>Roof / Elevated Platform</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: false,
        isActive: true,
        tags: ["overhead water tank", "water storage", "residential", "commercial"],
        seo: {
          metaTitle: "Overhead Water Tank Manufacturer | NewTech Steels Ghaziabad",
          metaDescription: "Quality Overhead Water Tanks by NewTech Steels for residential, commercial & industrial applications. Durable, hygienic & long-lasting. Get quote today.",
          metaKeywords: ["overhead water tank", "water tank manufacturer", "rooftop tank", "water storage"],
          canonicalUrl: "https://newtechsteels.com/new/overhead-water-tank/",
        },
      },
      {
        name: "Underground Water Storage Tank",
        slug: "underground-water-storage-tank",
        shortDescription: "High-capacity Underground Water Storage Tanks designed for residential, commercial, agricultural and industrial use.",
        description: "<p>Water is one of the most necessary resources across residential, commercial, industrial, and agricultural activities. NewTech Steels Underground Water Storage Tanks are engineered for below-ground installation, offering maximum capacity utilization while saving valuable surface area.</p>",
        specifications: "<table><tbody><tr><td><strong>Installation Type</strong></td><td>Underground / Subterranean</td></tr><tr><td><strong>Material</strong></td><td>Zinc Aluminium / Galvanised Steel</td></tr><tr><td><strong>Waterproofing</strong></td><td>Built-in protective coating</td></tr><tr><td><strong>Applications</strong></td><td>Rainwater harvesting, Potable water, Fire water</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: false,
        isActive: true,
        tags: ["underground tank", "water storage", "rainwater harvesting", "subterranean"],
        seo: {
          metaTitle: "Underground Water Storage Tank | NewTech Steels India",
          metaDescription: "Durable Underground Water Storage Tanks by NewTech Steels. Ideal for rainwater harvesting, potable & fire water storage. Custom sizes available.",
          metaKeywords: ["underground water tank", "underground storage tank", "rainwater harvesting tank", "buried tank"],
          canonicalUrl: "https://newtechsteels.com/new/underground-water-storage-tank/",
        },
      },
      {
        name: "Water Tank",
        slug: "water-tank",
        shortDescription: "Comprehensive range of water tanks for all storage needs across residential, commercial and industrial sectors.",
        description: "<p>Water storage has turned out to be a significant need in residential, commercial, industrial, and agricultural sectors. NewTech Steels offers a comprehensive range of water tanks manufactured to the highest quality standards, ensuring safe and hygienic storage of potable and non-potable water.</p>",
        specifications: "<table><tbody><tr><td><strong>Material Options</strong></td><td>Zinc Aluminium, Galvanised Steel, Epoxy Coated</td></tr><tr><td><strong>Standards</strong></td><td>IS15961:2012, ASTM A792M, AS 1397:2002</td></tr><tr><td><strong>Capacity</strong></td><td>100 litres to 10,000+ cubic metres</td></tr><tr><td><strong>Applications</strong></td><td>All water storage needs</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: false,
        isActive: true,
        tags: ["water tank", "storage tank", "manufacturer", "Ghaziabad"],
        seo: {
          metaTitle: "Water Tank Manufacturers in Ghaziabad | NewTech Steels",
          metaDescription: "Leading Water Tank Manufacturers in Ghaziabad. NewTech Steels offers complete water storage solutions for all residential, commercial & industrial needs.",
          metaKeywords: ["water tank manufacturer", "water tank Ghaziabad", "steel water tank", "storage tank India"],
          canonicalUrl: "https://newtechsteels.com/new/water-tank-manufacturers/",
        },
      },
      {
        name: "Zinc Aluminium Storage Tanks",
        slug: "zinc-aluminium-storage-tanks",
        shortDescription: "Premium Zinc Aluminium Storage Tanks — a reliable solution for industrial, agricultural and commercial storage needs.",
        description: "<p>Zinc Aluminium Storage Tanks have emerged as the most reliable solution for industrial, agricultural, and commercial storage needs. NewTech Steels Zinc Aluminium tanks combine the strength of steel with the corrosion resistance of zinc-aluminium alloy coating for maximum longevity and performance.</p>",
        specifications: "<table><tbody><tr><td><strong>Alloy Composition</strong></td><td>55% Aluminium, 43.5% Zinc, 1.5% Silicon</td></tr><tr><td><strong>Standard</strong></td><td>Australian AS 1397:2002, ASTM A792M</td></tr><tr><td><strong>Corrosion Resistance</strong></td><td>4x better than traditional galvanised</td></tr><tr><td><strong>Life Expectancy</strong></td><td>25+ years</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: true,
        isActive: true,
        tags: ["zinc aluminium", "storage tank", "ZA tank", "corrosion resistant"],
        seo: {
          metaTitle: "Zinc Aluminium Storage Tanks | NewTech Steels Delhi NCR",
          metaDescription: "Premium Zinc Aluminium Storage Tanks by NewTech Steels. 4x better corrosion resistance, 25+ year life. For industrial, agricultural & commercial storage.",
          metaKeywords: ["zinc aluminium tank", "ZA tank", "zinc aluminum storage", "corrosion resistant tank"],
          canonicalUrl: "https://newtechsteels.com/new/zinc-aluminium-storage-tanks/",
        },
      },
      {
        name: "Liquid Storage Tanks",
        slug: "liquid-storage-tanks",
        shortDescription: "Efficient and reliable Liquid Storage Tank solutions for diverse industrial and commercial liquid storage requirements.",
        description: "<p>In the realm of industrial solutions, the significance of efficient and reliable liquid storage cannot be overstated. NewTech Steels Liquid Storage Tanks are engineered to safely store a wide range of liquids including water, chemicals, food-grade liquids, and process fluids across various industries.</p>",
        specifications: "<table><tbody><tr><td><strong>Liquid Types</strong></td><td>Water, Chemicals (pH 3-12), Food Grade</td></tr><tr><td><strong>Material</strong></td><td>Zinc Aluminium / Epoxy Coated Steel</td></tr><tr><td><strong>Industries</strong></td><td>Food, Textile, Chemical, Water Treatment</td></tr><tr><td><strong>Certifications</strong></td><td>ISO 9364, IS15961:2012</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: false,
        isActive: true,
        tags: ["liquid storage", "chemical tank", "industrial tank", "process tank"],
        seo: {
          metaTitle: "Liquid Storage Tanks Manufacturer India | NewTech Steels",
          metaDescription: "Reliable Liquid Storage Tanks by NewTech Steels for water, chemicals & food-grade liquids. pH range 3-12. Custom capacities for all industrial needs.",
          metaKeywords: ["liquid storage tank", "industrial storage tank", "chemical tank", "process liquid tank"],
          canonicalUrl: "https://newtechsteels.com/product/liquid-storage-tanks/",
        },
      },
      {
        name: "ETP & STP Storage Tanks",
        slug: "etp-stp-storage-tanks",
        shortDescription: "Specialized ETP and STP Storage Tanks for Effluent and Sewage Treatment Plants ensuring environmental compliance.",
        description: "<p>Effluent Treatment Plants (ETPs) and Sewage Treatment Plants (STPs) stand as the guardians of environmental compliance. NewTech Steels manufactures specialized ETP & STP Storage Tanks designed to handle treated and untreated effluent and sewage, helping industries meet pollution control norms.</p>",
        specifications: "<table><tbody><tr><td><strong>Application</strong></td><td>ETP, STP, WTP</td></tr><tr><td><strong>Material</strong></td><td>Epoxy Coated / Zinc Aluminium</td></tr><tr><td><strong>Chemical Resistance</strong></td><td>pH 3 to 12</td></tr><tr><td><strong>Compliance</strong></td><td>CPCB / Pollution Control Norms</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: false,
        isActive: true,
        tags: ["ETP", "STP", "effluent tank", "sewage treatment", "wastewater"],
        seo: {
          metaTitle: "ETP & STP Storage Tanks in Delhi | NewTech Steels",
          metaDescription: "Specialized ETP & STP Storage Tanks by NewTech Steels. Corrosion-resistant tanks for effluent & sewage treatment plants. Environmental compliance assured.",
          metaKeywords: ["ETP tank", "STP tank", "effluent treatment tank", "sewage tank Delhi", "wastewater storage"],
          canonicalUrl: "https://newtechsteels.com/product/etp-stp-storage-tanks-in-delhi/",
        },
      },
      {
        name: "Zinc Aluminium Water Tank",
        slug: "zinc-aluminium-water-tank",
        shortDescription: "High-quality Zinc Aluminium Water Tanks — your premier destination for water storage in Delhi NCR.",
        description: "<p>At NewTech Steels, we showcase all-encompassing and fine quality water storage solutions. Our Zinc Aluminium Water Tanks are designed with strength, durability, and hygiene in mind, making them the premier choice for water storage in Delhi NCR and across India.</p>",
        specifications: "<table><tbody><tr><td><strong>Coating</strong></td><td>AZ150 (150 g/m² coating mass)</td></tr><tr><td><strong>Base Material</strong></td><td>Mild Steel with ZA coating</td></tr><tr><td><strong>Standards</strong></td><td>Australian AS 1397:2002</td></tr><tr><td><strong>Hygienic</strong></td><td>Safe for potable water storage</td></tr></tbody></table>",
        category: zincAluminiumCat._id,
        isFeatured: true,
        isActive: true,
        tags: ["zinc aluminium water tank", "ZA water tank", "Delhi NCR", "potable water"],
        seo: {
          metaTitle: "Zinc Aluminium Water Tank Manufacturer Delhi NCR | NewTech Steels",
          metaDescription: "Premier Zinc Aluminium Water Tank Manufacturer in Delhi NCR. NewTech Steels offers hygienic, durable ZA tanks for potable water storage. Get best price today.",
          metaKeywords: ["zinc aluminium water tank", "ZA water tank Delhi", "water tank Delhi NCR", "zinc aluminum tank manufacturer"],
          canonicalUrl: "https://newtechsteels.com/new/zinc-aluminium-water-tank-manufacturer/",
        },
      },

      // ── Silos products ────────────────────────────────────────────────────
      {
        name: "Hopper Bottom Silos",
        slug: "hopper-bottom-silos",
        shortDescription: "Versatile Hopper Bottom Silos suitable for seed storage and temporary storage for wet grain in drying plants.",
        description: "<p>Hopper silos serve as versatile storage units suitable for housing seeds or providing temporary storage for wet grain within grain drying plants. NewTech Steels Hopper Bottom Silos feature a conical bottom that enables complete discharge of stored material with minimal residue.</p>",
        specifications: "<table><tbody><tr><td><strong>Type</strong></td><td>Hopper Bottom (Conical base)</td></tr><tr><td><strong>Material</strong></td><td>Galvanised Steel Panels</td></tr><tr><td><strong>Applications</strong></td><td>Grain, Seeds, Fertilizers, Feed</td></tr><tr><td><strong>Discharge</strong></td><td>Complete gravity discharge</td></tr></tbody></table>",
        category: silosCat._id,
        isFeatured: true,
        isActive: true,
        tags: ["hopper silo", "grain storage", "seed silo", "agricultural silo"],
        seo: {
          metaTitle: "Hopper Bottom Silos Manufacturer India | NewTech Steels",
          metaDescription: "Quality Hopper Bottom Silos by NewTech Steels for grain, seed & fertilizer storage. Complete gravity discharge, custom capacities. Agricultural & industrial use.",
          metaKeywords: ["hopper bottom silos", "grain silo", "seed storage silo", "agricultural silo manufacturer"],
          canonicalUrl: "https://newtechsteels.com/product/silos-storage-tank/",
        },
      },
      {
        name: "Flat Bottom Silos",
        slug: "flat-bottom-silos",
        shortDescription: "Advanced Flat Bottom Silos with flat surface technology capable of enduring various material storage conditions.",
        description: "<p>Flat Bottom Silos, engineered using advanced technology, boast a flat bottom surface capable of enduring various material storage conditions. NewTech Steels Flat Bottom Silos are ideal for large-volume, long-term storage of grain, cement, fertilizers, and other bulk materials.</p>",
        specifications: "<table><tbody><tr><td><strong>Type</strong></td><td>Flat Bottom</td></tr><tr><td><strong>Material</strong></td><td>Galvanised Corrugated Steel</td></tr><tr><td><strong>Capacity Range</strong></td><td>50 MT to 5000+ MT</td></tr><tr><td><strong>Applications</strong></td><td>Grain, Cement, Fertilizer, Bulk Materials</td></tr></tbody></table>",
        category: silosCat._id,
        isFeatured: false,
        isActive: true,
        tags: ["flat bottom silos", "grain storage", "bulk storage", "cement silo"],
        seo: {
          metaTitle: "Flat Bottom Silos Manufacturer India | NewTech Steels",
          metaDescription: "High-capacity Flat Bottom Silos by NewTech Steels. Advanced technology for large-volume grain, cement & bulk material storage. Custom sizes 50 MT to 5000+ MT.",
          metaKeywords: ["flat bottom silo", "bulk storage silo", "grain storage silo", "cement silo manufacturer"],
          canonicalUrl: "https://newtechsteels.com/product/silos-storage-tank/",
        },
      },

      // ── Fusion Bond Epoxy Tank ────────────────────────────────────────────
      {
        name: "Fusion Bond Epoxy Tank",
        slug: "fusion-bond-epoxy-tank",
        shortDescription: "Fusion Bond Epoxy coated tanks providing superior corrosion protection for carbon steel storage applications.",
        description: "<p>Epoxy coating is a durable, protective resin substance used to prevent carbon steel tanks from degradation on its surface. NewTech Steels Fusion Bond Epoxy Tanks undergo a specialized coating process that bonds epoxy resin directly to the steel surface, providing superior corrosion resistance for demanding applications.</p>",
        specifications: "<table><tbody><tr><td><strong>Coating Type</strong></td><td>Fusion Bond Epoxy (FBE)</td></tr><tr><td><strong>Base Material</strong></td><td>Carbon Steel</td></tr><tr><td><strong>Temperature Range</strong></td><td>Up to 80°C continuous</td></tr><tr><td><strong>Applications</strong></td><td>Chemicals, ETP, Water Treatment, Oil & Gas</td></tr></tbody></table>",
        category: fusionEpoxyCat._id,
        isFeatured: true,
        isActive: true,
        tags: ["fusion bond epoxy", "epoxy tank", "FBE coating", "corrosion protection"],
        seo: {
          metaTitle: "Fusion Bond Epoxy Tank Manufacturer | NewTech Steels India",
          metaDescription: "Superior Fusion Bond Epoxy Tanks by NewTech Steels. Maximum corrosion protection for chemical, ETP & water treatment applications. Get quote now.",
          metaKeywords: ["fusion bond epoxy tank", "FBE tank", "epoxy coated tank", "corrosion protection tank"],
          canonicalUrl: "https://newtechsteels.com/fusion-bond-epoxy-tank/",
        },
      },
    ]);
    console.log("✅ Products seeded (15)");

    // ─────────────────────────────────────────────────────────────────────────
    // 3. BLOG CATEGORIES
    // ─────────────────────────────────────────────────────────────────────────
    const [industryNewsCat, tipsCat, caseStudiesCat] = await BlogCategory.insertMany([
      { name: "Industry News",       slug: "industry-news",       description: "Latest news and updates from the steel tank and storage industry.", isActive: true },
      { name: "Tips & Guides",       slug: "tips-and-guides",     description: "Practical tips and guides for water tank maintenance, installation and selection.", isActive: true },
      { name: "Case Studies",        slug: "case-studies",        description: "Real-world projects and success stories from NewTech Steels installations.", isActive: true },
    ]);
    console.log("✅ Blog Categories seeded (3)");

    // ─────────────────────────────────────────────────────────────────────────
    // 4. BLOGS
    // ─────────────────────────────────────────────────────────────────────────
    await Blog.insertMany([
      {
        title: "Why Zinc Aluminium Tanks Are Better Than Traditional Galvanised Steel Tanks",
        slug: "zinc-aluminium-vs-galvanised-steel-tanks",
        excerpt: "Discover why Zinc Aluminium (ZA) tanks offer 4x better corrosion resistance and 25+ year life compared to traditional galvanised steel tanks.",
        content: `<h2>The Evolution of Water Storage Technology</h2>
<p>For decades, galvanised steel tanks were the standard choice for industrial and commercial water storage. However, with the introduction of Zinc Aluminium (ZA) alloy coated tanks, the industry has witnessed a significant shift in preference.</p>
<h2>Key Advantages of Zinc Aluminium Tanks</h2>
<h3>1. Superior Corrosion Resistance</h3>
<p>Zinc Aluminium tanks offer 4x better corrosion resistance compared to traditional hot-dip galvanised tanks. The unique ZA alloy coating (55% Aluminium, 43.5% Zinc, 1.5% Silicon) forms a dense, adherent barrier that protects the base steel even at cut edges.</p>
<h3>2. Longer Service Life</h3>
<p>While traditional galvanised tanks typically last 10-15 years, NewTech Steels ZA tanks are engineered to provide 25+ years of reliable service, significantly reducing lifecycle costs.</p>
<h3>3. Hygienic for Potable Water</h3>
<p>ZA tanks meet international standards for potable water storage including Australian AS 1397:2002 and Indian Standards IS15961:2012, making them safe for drinking water applications.</p>
<h2>Applications Across Industries</h2>
<p>NewTech Steels Zinc Aluminium tanks serve diverse industries including breweries, distilleries, firefighting, rainwater harvesting, textile, food processing, water treatment, and construction.</p>
<h2>Conclusion</h2>
<p>When it comes to long-term water storage solutions, Zinc Aluminium tanks represent the superior choice for quality, durability, and cost-effectiveness. Contact NewTech Steels today to learn more about our ZA tank solutions.</p>`,
        category: tipsCat._id,
        author: "NewTech Steels Team",
        tags: ["zinc aluminium", "galvanised steel", "water tank comparison", "corrosion resistance"],
        isPublished: true,
        publishedAt: new Date("2024-03-15"),
        isActive: true,
        seo: {
          metaTitle: "Zinc Aluminium Tanks vs Galvanised Steel Tanks | NewTech Steels Blog",
          metaDescription: "Learn why Zinc Aluminium tanks outperform traditional galvanised steel tanks with 4x corrosion resistance and 25+ year life. Expert insights from NewTech Steels.",
          metaKeywords: ["zinc aluminium tank", "galvanised tank comparison", "water tank types", "corrosion resistance"],
          canonicalUrl: "https://newtechsteels.com/blog/zinc-aluminium-vs-galvanised-steel-tanks/",
        },
      },
      {
        title: "Complete Guide to Water Tank Maintenance for Longevity",
        slug: "water-tank-maintenance-guide",
        excerpt: "A comprehensive guide to maintaining your water storage tanks for maximum lifespan and water quality. Essential tips for tank owners.",
        content: `<h2>Introduction to Water Tank Maintenance</h2>
<p>Proper maintenance of water storage tanks is essential for ensuring water quality, preventing contamination, and maximizing the lifespan of your investment. This guide covers everything you need to know about maintaining your NewTech Steels water tanks.</p>
<h2>Regular Inspection Schedule</h2>
<h3>Monthly Checks</h3>
<ul>
<li>Inspect external surfaces for signs of rust or damage</li>
<li>Check all inlet and outlet connections for leaks</li>
<li>Verify float valve operation</li>
<li>Clean debris from tank surroundings</li>
</ul>
<h3>Annual Maintenance</h3>
<ul>
<li>Complete internal cleaning and disinfection</li>
<li>Inspect all bolted connections and tighten if necessary</li>
<li>Check and replace seals or gaskets as needed</li>
<li>Test water quality</li>
</ul>
<h2>Cleaning Procedure</h2>
<p>Regular cleaning is critical for maintaining water quality. Drain the tank completely, scrub internal surfaces with a food-grade cleaning agent, rinse thoroughly, and disinfect with approved chlorine solution before refilling.</p>
<h2>Warning Signs to Watch For</h2>
<p>Discoloured water, unusual odours, visible corrosion, or unexplained water loss are all signs that immediate maintenance attention is required.</p>
<h2>Professional Service</h2>
<p>NewTech Steels provides professional maintenance and inspection services for all tanks manufactured by us. Contact our service team at +91 9205066671 to schedule a maintenance visit.</p>`,
        category: tipsCat._id,
        author: "NewTech Steels Team",
        tags: ["water tank maintenance", "tank care", "water quality", "tank inspection"],
        isPublished: true,
        publishedAt: new Date("2024-06-10"),
        isActive: true,
        seo: {
          metaTitle: "Water Tank Maintenance Guide | NewTech Steels Blog",
          metaDescription: "Complete water tank maintenance guide by NewTech Steels. Monthly & annual maintenance tips, cleaning procedures, and warning signs to ensure tank longevity.",
          metaKeywords: ["water tank maintenance", "tank cleaning guide", "water storage maintenance", "tank inspection"],
          canonicalUrl: "https://newtechsteels.com/blog/water-tank-maintenance-guide/",
        },
      },
      {
        title: "NewTech Steels Installs 750 CUM Tank for Vikas Kamboj — A Success Story",
        slug: "750-cum-tank-installation-success-story",
        excerpt: "Learn how NewTech Steels successfully commissioned a 750 cubic metre tank without any leakage, earning high praise from client Vikas Kamboj.",
        content: `<h2>Project Overview</h2>
<p>NewTech Steels recently completed the successful installation of a 750 cubic metre (CUM) Zinc Aluminium water tank for client Vikas Kamboj. This project was the culmination of a two-year partnership during which approximately 8 tanks of varying capacities were installed.</p>
<h2>Project Scope</h2>
<p>Over the course of the partnership, NewTech Steels installed tanks with capacities of 100 CUM, 200 CUM, 500 CUM, and the final 750 CUM tank — all without a single leakage reported across any installation.</p>
<h2>Client Testimonial</h2>
<blockquote>
<p>"Nice experience with Newtech Steels. In the last 2 years we have installed approx 8 tanks with capacity of 100 cum, 200 cum, 500 cum and 750 cum. In recent times they have commissioned our 750 cum tank without any leakage. Well experienced team and staff of Newtech Steel."</p>
<p><strong>— Vikas Kamboj</strong></p>
</blockquote>
<h2>Key Success Factors</h2>
<ul>
<li>Experienced installation team with proven track record</li>
<li>High-quality Zinc Aluminium panels meeting international standards</li>
<li>Precise engineering and quality control at every stage</li>
<li>Responsive after-sales support from Mr. Atul and the team</li>
</ul>
<h2>Conclusion</h2>
<p>This project exemplifies NewTech Steels' commitment to quality, precision, and customer satisfaction. Whether it's a 100 CUM or a 750 CUM installation, our team delivers excellence every time.</p>`,
        category: caseStudiesCat._id,
        author: "NewTech Steels Team",
        tags: ["case study", "750 CUM tank", "installation", "success story", "zinc aluminium"],
        isPublished: true,
        publishedAt: new Date("2024-09-20"),
        isActive: true,
        seo: {
          metaTitle: "750 CUM Tank Installation Success Story | NewTech Steels",
          metaDescription: "Read how NewTech Steels successfully commissioned a 750 CUM Zinc Aluminium tank without leakage for client Vikas Kamboj. 8 tanks, zero leakage track record.",
          metaKeywords: ["tank installation case study", "750 cum tank", "zinc aluminium tank project", "NewTech Steels project"],
          canonicalUrl: "https://newtechsteels.com/blog/750-cum-tank-installation-success-story/",
        },
      },
      {
        title: "Understanding Grain Storage Silos: Hopper vs Flat Bottom",
        slug: "grain-storage-silos-hopper-vs-flat-bottom",
        excerpt: "A detailed comparison of Hopper Bottom and Flat Bottom silos to help you choose the right grain storage solution for your needs.",
        content: `<h2>Introduction to Grain Silos</h2>
<p>Choosing the right grain storage silo is crucial for preserving grain quality, minimizing losses, and ensuring operational efficiency. NewTech Steels manufactures both Hopper Bottom and Flat Bottom silos, each suited to different storage requirements.</p>
<h2>Hopper Bottom Silos</h2>
<h3>Design & Features</h3>
<p>Hopper Bottom Silos feature a conical base that enables complete, gravity-driven discharge of stored material. They are ideal for operations requiring frequent, complete emptying of the silo.</p>
<h3>Best For</h3>
<ul>
<li>Seed storage requiring complete discharge</li>
<li>Temporary storage in grain drying operations</li>
<li>Small to medium volume storage (up to 500 MT)</li>
<li>Operations with multiple grain varieties</li>
</ul>
<h2>Flat Bottom Silos</h2>
<h3>Design & Features</h3>
<p>Flat Bottom Silos use advanced corrugated steel panel technology with a flat base, providing maximum capacity utilization. They are designed for large-volume, long-term storage.</p>
<h3>Best For</h3>
<ul>
<li>Large-scale grain storage (50 MT to 5000+ MT)</li>
<li>Long-term seasonal storage</li>
<li>Cement, fertilizer, and bulk material storage</li>
<li>Commercial grain trading operations</li>
</ul>
<h2>Making the Right Choice</h2>
<p>Contact NewTech Steels' engineering team at info@newtechsteels.com to discuss your specific storage requirements. We'll help you choose and customize the perfect silo solution for your needs.</p>`,
        category: tipsCat._id,
        author: "NewTech Steels Team",
        tags: ["grain silos", "hopper bottom silo", "flat bottom silo", "grain storage", "agricultural"],
        isPublished: true,
        publishedAt: new Date("2024-11-05"),
        isActive: true,
        seo: {
          metaTitle: "Hopper vs Flat Bottom Silos Guide | NewTech Steels Blog",
          metaDescription: "Compare Hopper Bottom and Flat Bottom grain silos from NewTech Steels. Find the right silo for your storage capacity, grain type, and operational needs.",
          metaKeywords: ["hopper bottom silo", "flat bottom silo", "grain silo comparison", "agricultural storage"],
          canonicalUrl: "https://newtechsteels.com/blog/grain-storage-silos-hopper-vs-flat-bottom/",
        },
      },
      {
        title: "NewTech Steels Expands Client Base Across India — From Bhutan to Arunachal Pradesh",
        slug: "newtech-steels-expands-pan-india",
        excerpt: "From Bhutan to Arunachal Pradesh, NewTech Steels is building a pan-India and international presence with its high-quality steel tank solutions.",
        content: `<h2>Growing Presence Across Regions</h2>
<p>NewTech Steels Industries Private Limited has rapidly expanded its client base across India and internationally, serving diverse sectors from residential to heavy industry. Our tanks have been installed in some of the most challenging environments across the country.</p>
<h2>International Recognition</h2>
<p>Our quality has gained international recognition with successful installations in Bhutan. Customer Ugyen Dorji from Bhutan shared his experience: "Highly recommended from Bhutan. Good Quality." This reflects our ability to meet and exceed international quality expectations.</p>
<h2>Remote Location Installations</h2>
<p>One of our most challenging projects involved the installation of 15 Zinc Aluminium tanks across various sites, including the remote Keylong location. Our team's ability to operate in remote and high-altitude areas demonstrates our commitment to serving clients wherever they are located.</p>
<h2>Industry Verticals Served</h2>
<ul>
<li>Fire Safety (M & R Fire Safety, Bihar Region)</li>
<li>Automotive (G.K. Auto & Ancillaries)</li>
<li>Hardware & Construction (Arunachal Hardware)</li>
<li>Manufacturing (M/s Superlite Jointings Pvt. Ltd.)</li>
<li>Consumer Goods (Milton)</li>
</ul>
<h2>Looking Forward</h2>
<p>NewTech Steels continues to expand its manufacturing capacity and service network to better serve clients across India and internationally. Contact us at info@newtechsteels.com or call +91 9205066671 to discuss your storage requirements.</p>`,
        category: industryNewsCat._id,
        author: "NewTech Steels Team",
        tags: ["expansion", "pan India", "international", "client testimonials", "growth"],
        isPublished: true,
        publishedAt: new Date("2025-01-12"),
        isActive: true,
        seo: {
          metaTitle: "NewTech Steels Expands Pan-India Presence | Industry News",
          metaDescription: "NewTech Steels grows its presence from Bhutan to Arunachal Pradesh. Read about our pan-India expansion, diverse client base, and quality installations.",
          metaKeywords: ["NewTech Steels expansion", "steel tank India", "water tank manufacturer India", "pan India steel tanks"],
          canonicalUrl: "https://newtechsteels.com/blog/newtech-steels-expands-pan-india/",
        },
      },
    ]);
    console.log("✅ Blogs seeded (5)");

    // ─────────────────────────────────────────────────────────────────────────
    // 5. CONTACT DETAILS
    // ─────────────────────────────────────────────────────────────────────────
    await ContactDetail.create({
      branchName: "Head Office — Ghaziabad",
      phones: ["+91 9205066671", "+91 9205066656", "+91 9205066657"],
      emails: ["info@newtechsteels.com", "sales@newtechsteels.com"],
      address: {
        line1: "F47, Bulandshahr Road Industrial Area",
        line2: "Ghaziabad",
        city: "Ghaziabad",
        state: "Uttar Pradesh",
        pincode: "201009",
        country: "India",
      },
      whatsapp: "+91 9205066671",
      googleMapsUrl: "https://share.google/hi2LvPuJhrrtE8FpW",
      googleMapsEmbed: "",
      socialLinks: [
        { platform: "facebook",  url: "https://www.facebook.com/newtechsteelsgzb" },
        { platform: "twitter",   url: "https://twitter.com/infonewtec34282" },
        { platform: "youtube",   url: "https://www.youtube.com/@newtechsteels/featured" },
        { platform: "instagram", url: "https://www.instagram.com/newtech.steels/" },
        { platform: "linkedin",  url: "https://www.linkedin.com/in/newtech-steels-860bab285/" },
      ],
      businessHours: [
        { day: "Monday - Saturday", hours: "9:00 AM - 6:00 PM", closed: false },
        { day: "Sunday",            hours: "",                   closed: true  },
      ],
      isPrimary: true,
      isActive: true,
      order: 1,
    });
    console.log("✅ Contact Details seeded (1 branch)");

    // ─────────────────────────────────────────────────────────────────────────
    // 6. PAGES & SEO
    // ─────────────────────────────────────────────────────────────────────────
    await Page.insertMany([
      {
        title: "Home",
        slug: "home",
        isActive: true,
        seo: {
          metaTitle: "NewTech Steels | Overhead Water Tank & Underground Storage Manufacturer",
          metaDescription: "NewTech Steels Industries Pvt Ltd — Leading manufacturer of Zinc Aluminium Water Tanks, Grain Silos, Liquid Storage Tanks & ETP/STP tanks in India. Quality you can trust.",
          metaKeywords: ["water tank manufacturer", "zinc aluminium tank", "grain silos", "overhead water tank", "NewTech Steels", "Ghaziabad"],
          canonicalUrl: "https://newtechsteels.com/",
          ogTitle: "NewTech Steels | Premium Water Storage Solutions",
          ogDescription: "Leading manufacturer of Zinc Aluminium tanks, silos, and industrial storage solutions. Serving breweries, fire safety, water treatment & more across India.",
        },
      },
      {
        title: "About Us",
        slug: "about-us",
        isActive: true,
        seo: {
          metaTitle: "About NewTech Steels | Steel Tank Manufacturer Since 2000",
          metaDescription: "Learn about NewTech Steels Industries Pvt Ltd — founded by seasoned professionals with 6+ years of manufacturing experience. ISO certified, serving 50+ industries across India.",
          metaKeywords: ["about NewTech Steels", "steel tank manufacturer India", "ISO certified tank manufacturer", "Ghaziabad manufacturer"],
          canonicalUrl: "https://newtechsteels.com/about-us/",
          ogTitle: "About NewTech Steels Industries Private Limited",
          ogDescription: "Dedicated to innovation and quality since inception. NewTech Steels serves breweries, distilleries, fire safety, food processing & more with premium steel storage solutions.",
        },
      },
      {
        title: "Products",
        slug: "products",
        isActive: true,
        seo: {
          metaTitle: "Steel Storage Tank Products | NewTech Steels India",
          metaDescription: "Explore our complete range: Zinc Aluminium Tanks, Grain Silos, Liquid Storage Tanks, ETP/STP tanks, Fire Water Tanks & Fusion Bond Epoxy Tanks. Custom sizes available.",
          metaKeywords: ["water tank products", "zinc aluminium tank", "grain silo", "liquid storage tank", "ETP tank", "FBE tank"],
          canonicalUrl: "https://newtechsteels.com/product/",
          ogTitle: "NewTech Steels Product Range",
          ogDescription: "Complete range of industrial storage tanks: Zinc Aluminium, Silos, Liquid, ETP/STP, Fire Water & Epoxy Coated tanks. Meeting Australian, American & Indian standards.",
        },
      },
      {
        title: "Blog",
        slug: "blog",
        isActive: true,
        seo: {
          metaTitle: "Steel Tank Industry Blog | Tips, News & Insights | NewTech Steels",
          metaDescription: "Read expert insights, maintenance tips, industry news, and case studies about water storage tanks, silos, and steel solutions from the NewTech Steels team.",
          metaKeywords: ["water tank blog", "steel tank tips", "tank maintenance guide", "storage tank industry news"],
          canonicalUrl: "https://newtechsteels.com/blog/",
          ogTitle: "NewTech Steels Blog — Expert Insights on Steel Storage",
          ogDescription: "Expert articles on water tank selection, maintenance, silos, and industrial storage solutions from India's leading steel tank manufacturer.",
        },
      },
      {
        title: "Gallery",
        slug: "gallery",
        isActive: true,
        seo: {
          metaTitle: "Project Gallery | NewTech Steels Installations Across India",
          metaDescription: "View NewTech Steels project gallery — real installations of Zinc Aluminium tanks, grain silos, and industrial storage solutions across India and internationally.",
          metaKeywords: ["NewTech Steels gallery", "tank installation photos", "zinc aluminium tank gallery", "silo installation"],
          canonicalUrl: "https://newtechsteels.com/gallery/",
          ogTitle: "NewTech Steels Project Gallery",
          ogDescription: "See our work — Zinc Aluminium tanks, silos, and industrial storage installations across India and beyond.",
        },
      },
      {
        title: "Contact Us",
        slug: "contact-us",
        isActive: true,
        seo: {
          metaTitle: "Contact NewTech Steels | Get a Quote Today",
          metaDescription: "Contact NewTech Steels Industries Pvt Ltd at F47, Bulandshahr Road Industrial Area, Ghaziabad. Call +91 9205066671. Email: info@newtechsteels.com. Get your custom quote today.",
          metaKeywords: ["contact NewTech Steels", "water tank quote", "Ghaziabad steel manufacturer contact", "tank manufacturer enquiry"],
          canonicalUrl: "https://newtechsteels.com/contact-us/",
          ogTitle: "Contact NewTech Steels — Get a Free Quote",
          ogDescription: "Reach out to NewTech Steels for quotes, technical support, or partnership enquiries. F47, Bulandshahr Road, Ghaziabad. Call: +91 9205066671.",
        },
      },
    ]);
    console.log("✅ Pages seeded (6)");

    // ─────────────────────────────────────────────────────────────────────────
    // 7. HERO BANNERS
    // ─────────────────────────────────────────────────────────────────────────
    await HeroBanner.insertMany([
      {
        page: "home",
        title: "Newtech Steels Industries Private Limited",
        subtitle: "Where Consistency Meets Deadline For Every Product",
        description: "Precision and Punctuality — Our Promise. Join us for an immersive exploration into the world of innovation where NewTech Steels bridges the gap between ideas and engineering excellence.",
        buttonText: "Enquiry Now",
        buttonLink: "/contact",
        backgroundImage: "",
        overlayOpacity: 50,
        alignment: "center",
        isActive: true,
        order: 1,
      },
      {
        page: "about",
        title: "About NewTech Steels",
        subtitle: "6+ Years of Manufacturing Excellence",
        description: "Founded by seasoned professionals, we manufacture world-class storage solutions meeting Australian, American and Indian standards.",
        buttonText: "Learn More",
        buttonLink: "/about-us",
        backgroundImage: "",
        overlayOpacity: 45,
        alignment: "left",
        isActive: true,
        order: 1,
      },
      {
        page: "products",
        title: "Our Products",
        subtitle: "Steel Innovations for a Better World",
        description: "Sustainable, Economical & Inclusive — Explore our complete range of Zinc Aluminium tanks, Silos, and industrial storage solutions.",
        buttonText: "View All Products",
        buttonLink: "/products",
        backgroundImage: "",
        overlayOpacity: 50,
        alignment: "center",
        isActive: true,
        order: 1,
      },
      {
        page: "contact",
        title: "Get In Touch",
        subtitle: "We're Here to Help",
        description: "Have questions about our products? Our expert team is ready to assist you with custom storage solutions for your requirements.",
        buttonText: "Send Enquiry",
        buttonLink: "#enquiry-form",
        backgroundImage: "",
        overlayOpacity: 55,
        alignment: "center",
        isActive: true,
        order: 1,
      },
      {
        page: "gallery",
        title: "Our Work",
        subtitle: "Real Installations, Real Results",
        description: "Explore our project gallery showcasing successful tank installations across India and internationally.",
        buttonText: "",
        buttonLink: "",
        backgroundImage: "",
        overlayOpacity: 40,
        alignment: "center",
        isActive: true,
        order: 1,
      },
    ]);
    console.log("✅ Hero Banners seeded (5 — one per page)");

    // ─────────────────────────────────────────────────────────────────────────
    // DONE
    // ─────────────────────────────────────────────────────────────────────────
    console.log("\n🎉 Seed complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Product Categories : 3");
    console.log("  Products           : 15");
    console.log("  Blog Categories    : 3");
    console.log("  Blogs              : 5");
    console.log("  Contact Details    : 1 (Head Office)");
    console.log("  Pages              : 6");
    console.log("  Hero Banners       : 5");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  NOTE: Hero banner background images are empty.");
    console.log("   Upload images via the admin panel after seeding.");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

// seed();