import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import useGalleryCategories from "../../hooks/useGalleryCategories";
import toast from "react-hot-toast";

export default function GalleryCategoryCreate() {
  const navigate = useNavigate();
  const { create } = useGalleryCategories();
  const [formData, setFormData] = useState({ name: "", description: "", isActive: true });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) { toast.error("Name is required"); return; }
    setLoading(true);
    try { await create(formData); navigate("/admin-panel/gallery-categories"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed to create category"); }
    finally { setLoading(false); }
  };

  const inputCls = "h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900";

  return (
    <div>
      <PageHeader title="Add Gallery Category" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Gallery Categories", to: "/gallery-categories" }, { label: "Add" }]} />
      <div className="max-w-2xl bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Name <span className="text-error-500">*</span></label><input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Category name" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label><textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm dark:text-white/90 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 resize-none" /></div>
          <div className="flex items-center gap-3"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-brand-500" /><label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-400">Active</label></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">{loading ? "Saving..." : "Save Category"}</button>
            <button type="button" onClick={() => navigate("/admin-panel/gallery-categories")} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
