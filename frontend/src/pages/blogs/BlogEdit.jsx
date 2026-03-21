import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import ImageUpload from "../../components/shared/ImageUpload";
import CKEditorField from "../../components/shared/CKEditorField";
import useBlogCategories from "../../hooks/useBlogCategories";
import { getBlogById, updateBlog } from "../../api/services/blog.service";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL?.replace('/api','') || 'http://localhost:5000';

export default function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useBlogCategories();
  const [formData, setFormData] = useState({ title: "", excerpt: "", content: "", category: "", author: "Admin", tags: "", isPublished: false, isActive: true, seo: { metaTitle: "", metaDescription: "" } });
  const [coverImage, setCoverImage] = useState(null);
  const [existingCover, setExistingCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getBlogById(id)
      .then(res => {
        const b = res.data.data;
        setFormData({ title: b.title, excerpt: b.excerpt || "", content: b.content || "", category: b.category?._id || "", author: b.author || "Admin", tags: (b.tags || []).join(", "), isPublished: b.isPublished, isActive: b.isActive, seo: { metaTitle: b.seo?.metaTitle || "", metaDescription: b.seo?.metaDescription || "" } });
        if (b.coverImage) setExistingCover(`${BASE}${b.coverImage}`);
      })
      .catch(() => toast.error("Failed to load blog"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const setSeo = (k, v) => setFormData(p => ({ ...p, seo: { ...p.seo, [k]: v } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) { toast.error("Title and category are required"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === "seo") fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      if (coverImage) fd.append("coverImage", coverImage);
      await updateBlog(id, fd);
      toast.success("Blog updated!");
      navigate("/blogs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update blog");
    } finally { setLoading(false); }
  };

  const inputCls = "h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";

  if (fetching) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Edit Blog" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Blogs", to: "/blogs" }, { label: "Edit" }]} />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Content</h3>
            <div><label className={labelCls}>Title <span className="text-error-500">*</span></label><input type="text" value={formData.title} onChange={(e) => set("title", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Excerpt</label><textarea value={formData.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm dark:text-white/90 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 resize-none" /></div>
            <CKEditorField label="Content" value={formData.content} onChange={(v) => set("content", v)} />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <ImageUpload label="Cover Image" value={existingCover} onChange={setCoverImage} />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">SEO</h3>
            <div><label className={labelCls}>Meta Title</label><input type="text" value={formData.seo.metaTitle} onChange={(e) => setSeo("metaTitle", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Meta Description</label><textarea value={formData.seo.metaDescription} onChange={(e) => setSeo("metaDescription", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm dark:text-white/90 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 resize-none" /></div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Settings</h3>
            <div>
              <label className={labelCls}>Category <span className="text-error-500">*</span></label>
              <select value={formData.category} onChange={(e) => set("category", e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900">
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Author</label><input type="text" value={formData.author} onChange={(e) => set("author", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Tags</label><input type="text" value={formData.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} /></div>
            <div className="flex items-center gap-3"><input type="checkbox" id="pub" checked={formData.isPublished} onChange={(e) => set("isPublished", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" /><label htmlFor="pub" className="text-sm text-gray-700 dark:text-gray-400">Published</label></div>
            <div className="flex items-center gap-3"><input type="checkbox" id="act" checked={formData.isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" /><label htmlFor="act" className="text-sm text-gray-700 dark:text-gray-400">Active</label></div>
          </div>
          <div className="flex flex-col gap-2">
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">{loading ? "Saving..." : "Update Blog"}</button>
            <button type="button" onClick={() => navigate("/blogs")} className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
