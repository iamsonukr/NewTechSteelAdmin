import { useEffect, useState } from "react";
import { Package, FileText, Image, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { getProducts } from "../../api/services/product.service";
import { getBlogs } from "../../api/services/blog.service";
import { getGallery } from "../../api/services/gallery.service";
import { getEnquiryStats } from "../../api/services/enquiry.service";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color, to }) => (
  <Link to={to} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex items-center gap-4 hover:shadow-theme-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{value ?? "—"}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </div>
  </Link>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ products: null, blogs: null, gallery: null, enquiries: null, newEnquiries: null });

  useEffect(() => {
    Promise.all([getProducts(), getBlogs(), getGallery(), getEnquiryStats()])
      .then(([p, b, g, e]) => setStats({
        products: p.data.count,
        blogs: b.data.count,
        gallery: g.data.count,
        enquiries: e.data.data.total,
        newEnquiries: e.data.data.new,
      }))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Products"  value={stats.products}      icon={Package}       color="bg-blue-500"   to="/products" />
        <StatCard title="Total Blogs"     value={stats.blogs}         icon={FileText}      color="bg-purple-500" to="/blogs" />
        <StatCard title="Gallery Items"   value={stats.gallery}       icon={Image}         color="bg-green-500"  to="/gallery" />
        <StatCard title="Total Enquiries" value={stats.enquiries}     icon={MessageSquare} color="bg-orange-500" to="/enquiries" />
      </div>

      {stats.newEnquiries > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3">
          <Clock size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            You have <span className="font-semibold">{stats.newEnquiries} new enquiries</span> waiting for review.{" "}
            <Link to="/enquiries" className="underline hover:no-underline">View now</Link>
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Quick Links", links: [
            { label: "Add New Product",          to: "/products/create" },
            { label: "Add New Blog",             to: "/blogs/create" },
            { label: "Upload Gallery Images",    to: "/gallery/create" },
            { label: "View Enquiries",           to: "/enquiries" },
          ]},
        ].map((section) => (
          <div key={section.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-500" /> {section.title}
            </h2>
            <div className="space-y-2">
              {section.links.map((l) => (
                <Link key={l.to} to={l.to} className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  → {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
