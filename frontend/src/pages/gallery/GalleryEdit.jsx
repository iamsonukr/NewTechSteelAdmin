import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import ImageUpload from "../../components/shared/ImageUpload";
import useGalleryCategories from "../../hooks/useGalleryCategories";
import { getGalleryById, updateGallery } from "../../api/services/gallery.service";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL?.replace('/api','') || 'http://localhost:5000';

export default function GalleryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useGalleryCategories();
  const [formData, setFormData] = useState({ title: "", description: "", category: "", isFeatured: false, order: 0, isActive: true });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getGalleryById(id)
      .then(res => {
        const g = res.data.data;
        setFormData({ title: g.title || "", description: g.description || "", category: g.category?._id || "", isFeatured: g.isFeatured, order: g.order || 0, isActive: g.isActive });
        if (g.image) setExistingImage(`${BASE}${g.image}`);
      })
      .catch(() => toast.error("Failed to load gallery item"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);
      await updateGallery(id, fd);
      toast.success("Gallery item updated!");
      navigate("/gallery");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to update"); }
    finally { setLoading(false); }
  };

  const inputCls = "h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";

  if (fetching) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Edit Gallery Image" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Gallery", to: "/gallery" }, { label: "Edit" }]} />
      <div className="max-w-2xl bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <ImageUpload label="Image" value={existingImage} onChange={setImage} />
          <div><label className={labelCls}>Title</label><input type="text" value={formData.title} onChange={(e) => set("title", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Description</label><textarea value={formData.description} onChange={(e) => set("description", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm dark:text-white/90 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 resize-none" /></div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={formData.category} onChange={(e) => set("category", e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900">
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Display Order</label><input type="number" value={formData.order} onChange={(e) => set("order", e.target.value)} className={inputCls} /></div>
          <div className="flex gap-6">
            <div className="flex items-center gap-3"><input type="checkbox" id="feat" checked={formData.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" /><label htmlFor="feat" className="text-sm text-gray-700 dark:text-gray-400">Featured</label></div>
            <div className="flex items-center gap-3"><input type="checkbox" id="act" checked={formData.isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" /><label htmlFor="act" className="text-sm text-gray-700 dark:text-gray-400">Active</label></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">{loading ? "Saving..." : "Update Image"}</button>
            <button type="button" onClick={() => navigate("/gallery")} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
