import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import ImageUpload from "../../components/shared/ImageUpload";
import useProductCategories from "../../hooks/useProductCategories";
import toast from "react-hot-toast";

export default function ProductCategoryCreate() {
  const navigate = useNavigate();
  const { create } = useProductCategories();
  const [formData, setFormData] = useState({ name: "", description: "", isActive: true });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);
      await create(fd);
      navigate("/product-categories");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Add Product Category" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Product Categories", to: "/product-categories" }, { label: "Add" }]} />
      <div className="max-w-2xl bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Name <span className="text-error-500">*</span></label>
            <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Category name" className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Optional description" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 resize-none" />
          </div>
          <ImageUpload label="Category Image" value={null} onChange={setImage} />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-400">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">{loading ? "Saving..." : "Save Category"}</button>
            <button type="button" onClick={() => navigate("/product-categories")} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
