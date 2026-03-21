import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import CKEditorField from "../../components/shared/CKEditorField";
import useProductCategories from "../../hooks/useProductCategories";
import { getProductById, updateProduct } from "../../api/services/product.service";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL?.replace('/api','') || 'http://localhost:5000';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useProductCategories();
  const [formData, setFormData] = useState({ name: "", shortDescription: "", description: "", specifications: "", category: "", isFeatured: false, isActive: true, tags: "", seo: { metaTitle: "", metaDescription: "" } });
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [brochure, setBrochure] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then(res => {
        const p = res.data.data;
        setFormData({ name: p.name, shortDescription: p.shortDescription || "", description: p.description || "", specifications: p.specifications || "", category: p.category?._id || "", isFeatured: p.isFeatured, isActive: p.isActive, tags: (p.tags || []).join(", "), seo: { metaTitle: p.seo?.metaTitle || "", metaDescription: p.seo?.metaDescription || "" } });
        setExistingImages((p.images || []).map(img => `${BASE}${img}`));
      })
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const setSeo = (k, v) => setFormData(p => ({ ...p, seo: { ...p.seo, [k]: v } }));

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setNewImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) { toast.error("Name and category are required"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("shortDescription", formData.shortDescription);
      fd.append("description", formData.description);
      fd.append("specifications", formData.specifications);
      fd.append("category", formData.category);
      fd.append("isFeatured", formData.isFeatured);
      fd.append("isActive", formData.isActive);
      fd.append("tags", formData.tags);
      fd.append("seo", JSON.stringify(formData.seo));
      newImages.forEach(img => fd.append("images", img));
      if (brochure) fd.append("brochure", brochure);
      await updateProduct(id, fd);
      toast.success("Product updated!");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally { setLoading(false); }
  };

  const inputCls = "h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";

  if (fetching) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Edit Product" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Products", to: "/products" }, { label: "Edit" }]} />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Basic Info</h3>
            <div><label className={labelCls}>Name <span className="text-error-500">*</span></label><input type="text" value={formData.name} onChange={(e) => set("name", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Short Description</label><textarea value={formData.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 resize-none" /></div>
            <CKEditorField label="Description" value={formData.description} onChange={(v) => set("description", v)} />
            <CKEditorField label="Specifications" value={formData.specifications} onChange={(v) => set("specifications", v)} />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm mb-4">Images</h3>
            {existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Existing images</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((src, i) => <img key={i} src={src} className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />)}
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Upload new images (replaces existing)</p>
            <input type="file" multiple accept="image/*" onChange={handleNewImages} className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-500 dark:text-gray-400 shadow-theme-xs file:mr-4 file:border-0 file:rounded-l-lg file:border-r file:border-gray-200 dark:file:border-gray-700 file:bg-gray-50 dark:file:bg-gray-800 file:py-3 file:px-3 file:text-sm file:text-gray-700 dark:file:text-gray-400" />
            {newImagePreviews.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{newImagePreviews.map((src, i) => <img key={i} src={src} className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />)}</div>}
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
            <div><label className={labelCls}>Tags</label><input type="text" value={formData.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>New Brochure (PDF)</label><input type="file" accept=".pdf" onChange={(e) => setBrochure(e.target.files[0])} className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:border-0 file:rounded-l-lg file:border-r file:border-gray-200 dark:file:border-gray-700 file:bg-gray-50 dark:file:bg-gray-800 file:py-3 file:px-3 file:text-sm file:text-gray-700 dark:file:text-gray-400" /></div>
            <div className="flex items-center gap-3"><input type="checkbox" id="feat" checked={formData.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" /><label htmlFor="feat" className="text-sm text-gray-700 dark:text-gray-400">Featured</label></div>
            <div className="flex items-center gap-3"><input type="checkbox" id="act" checked={formData.isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" /><label htmlFor="act" className="text-sm text-gray-700 dark:text-gray-400">Active</label></div>
          </div>
          <div className="flex flex-col gap-2">
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">{loading ? "Saving..." : "Update Product"}</button>
            <button type="button" onClick={() => navigate("/products")} className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
