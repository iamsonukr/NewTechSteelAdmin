import { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../../components/shared/PageHeader";
import ImageUpload from "../../components/shared/ImageUpload";
import { createBanner } from "../../api/services/heroBanner.service";
import toast from "react-hot-toast";

const PAGES = ["home", "about", "products", "blogs", "gallery", "contact"];

export default function HeroBannerCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    page: "home", title: "", subtitle: "", description: "",
    buttonText: "", buttonLink: "", overlayOpacity: 50,
    alignment: "center", isActive: true, order: 0,
  });
  const [bgImage, setBgImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.page) { toast.error("Page is required"); return; }
    if (!bgImage)       { toast.error("Background image is required"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append("backgroundImage", bgImage);
      await createBanner(fd);
      toast.success("Banner created!");
      navigate("/hero-banners");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create banner");
    } finally { setLoading(false); }
  };

  const inputCls  = "h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900";
  const labelCls  = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";
  const selectCls = "h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900";

  return (
    <div>
      <PageHeader title="Add Hero Banner" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Hero Banners", to: "/hero-banners" }, { label: "Add" }]} />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Banner Content</h3>
            <div>
              <label className={labelCls}>Page <span className="text-error-500">*</span></label>
              <select value={formData.page} onChange={e => set("page", e.target.value)} className={selectCls}>
                {PAGES.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Heading</label><input type="text" value={formData.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="e.g. Premium Steel Solutions" /></div>
            <div><label className={labelCls}>Subtitle</label><input type="text" value={formData.subtitle} onChange={e => set("subtitle", e.target.value)} className={inputCls} placeholder="e.g. Quality you can trust" /></div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={formData.description} onChange={e => set("description", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Button Text</label><input type="text" value={formData.buttonText} onChange={e => set("buttonText", e.target.value)} className={inputCls} placeholder="Get Quote" /></div>
              <div><label className={labelCls}>Button Link</label><input type="text" value={formData.buttonLink} onChange={e => set("buttonLink", e.target.value)} className={inputCls} placeholder="/contact" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <ImageUpload label="Background Image * (1920×600px recommended)" value={null} onChange={setBgImage} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Settings</h3>
            <div>
              <label className={labelCls}>Text Alignment</label>
              <select value={formData.alignment} onChange={e => set("alignment", e.target.value)} className={selectCls}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Overlay Opacity: {formData.overlayOpacity}%</label>
              <input type="range" min={0} max={90} value={formData.overlayOpacity} onChange={e => set("overlayOpacity", Number(e.target.value))} className="w-full accent-brand-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0% (No overlay)</span><span>90% (Dark)</span></div>
            </div>
            <div><label className={labelCls}>Display Order</label><input type="number" value={formData.order} onChange={e => set("order", Number(e.target.value))} className={inputCls} /></div>
            <div className="flex items-center gap-3"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => set("isActive", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" /><label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-400">Active</label></div>
          </div>
          <div className="flex flex-col gap-2">
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">{loading ? "Saving..." : "Save Banner"}</button>
            <button type="button" onClick={() => navigate("/hero-banners")} className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
