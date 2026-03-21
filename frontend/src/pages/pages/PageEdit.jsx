import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageHeader from "../../components/shared/PageHeader";
import ImageUpload from "../../components/shared/ImageUpload";
import { getPageById, updatePage } from "../../api/services/page.service";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL?.replace("/api", "") || "http://localhost:5000";

export default function PageEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "", isActive: true,
    seo: { metaTitle: "", metaDescription: "", metaKeywords: "", canonicalUrl: "", ogTitle: "", ogDescription: "" },
  });
  const [ogImage, setOgImage]           = useState(null);
  const [existingOgImage, setExistingOgImage] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);

  useEffect(() => {
    getPageById(id)
      .then(res => {
        const p = res.data.data;
        setFormData({
          title: p.title,
          isActive: p.isActive,
          seo: {
            metaTitle:       p.seo?.metaTitle       || "",
            metaDescription: p.seo?.metaDescription || "",
            metaKeywords:    (p.seo?.metaKeywords || []).join(", "),
            canonicalUrl:    p.seo?.canonicalUrl    || "",
            ogTitle:         p.seo?.ogTitle         || "",
            ogDescription:   p.seo?.ogDescription   || "",
          },
        });
        if (p.seo?.ogImage) setExistingOgImage(`${BASE}${p.seo.ogImage}`);
      })
      .catch(() => toast.error("Failed to load page"))
      .finally(() => setFetching(false));
  }, [id]);

  const set    = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const setSeo = (k, v) => setFormData(p => ({ ...p, seo: { ...p.seo, [k]: v } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) { toast.error("Page title is required"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title",    formData.title);
      fd.append("isActive", String(formData.isActive));
      fd.append("seo",      JSON.stringify({
        ...formData.seo,
        metaKeywords: formData.seo.metaKeywords.split(",").map(k => k.trim()).filter(Boolean),
      }));
      if (ogImage) fd.append("ogImage", ogImage);
      await updatePage(id, fd);
      toast.success("Page updated!");
      navigate("/pages");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update page");
    } finally { setLoading(false); }
  };

  const inputCls    = "h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900";
  const labelCls    = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";
  const textareaCls = "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 resize-none";

  if (fetching) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Edit Page" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Pages", to: "/pages" }, { label: "Edit" }]} />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Page Info</h3>
            <div>
              <label className={labelCls}>Page Title <span className="text-error-500">*</span></label>
              <input type="text" value={formData.title} onChange={e => set("title", e.target.value)} className={inputCls} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => set("isActive", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" />
              <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-400">Active</label>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">SEO Settings</h3>
            <div>
              <label className={labelCls}>Meta Title</label>
              <input type="text" value={formData.seo.metaTitle} onChange={e => setSeo("metaTitle", e.target.value)} className={inputCls} />
              <p className="mt-1 text-xs text-gray-400">{formData.seo.metaTitle.length}/60</p>
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={formData.seo.metaDescription} onChange={e => setSeo("metaDescription", e.target.value)} rows={3} className={textareaCls} />
              <p className="mt-1 text-xs text-gray-400">{formData.seo.metaDescription.length}/160</p>
            </div>
            <div>
              <label className={labelCls}>Meta Keywords</label>
              <input type="text" value={formData.seo.metaKeywords} onChange={e => setSeo("metaKeywords", e.target.value)} className={inputCls} placeholder="comma separated" />
            </div>
            <div>
              <label className={labelCls}>Canonical URL</label>
              <input type="url" value={formData.seo.canonicalUrl} onChange={e => setSeo("canonicalUrl", e.target.value)} className={inputCls} placeholder="https://newtechsteel.com/..." />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Open Graph (Social Share)</h3>
            <div>
              <label className={labelCls}>OG Title</label>
              <input type="text" value={formData.seo.ogTitle} onChange={e => setSeo("ogTitle", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>OG Description</label>
              <textarea value={formData.seo.ogDescription} onChange={e => setSeo("ogDescription", e.target.value)} rows={2} className={textareaCls} />
            </div>
            <ImageUpload label="OG Image (1200×630px)" value={existingOgImage} onChange={setOgImage} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm mb-4">Google Preview</h3>
            <div className="space-y-1">
              <p className="text-xs text-gray-400 truncate">{formData.seo.canonicalUrl || "https://newtechsteel.com/..."}</p>
              <p className="text-base text-blue-600 dark:text-blue-400 font-medium leading-tight truncate">
                {formData.seo.metaTitle || formData.title || "Page Title"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
                {formData.seo.metaDescription || "Meta description will appear here..."}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">SEO Checklist</h3>
            {[
              { label: "Meta Title",       val: formData.seo.metaTitle,       min: 30, max: 60 },
              { label: "Meta Description", val: formData.seo.metaDescription, min: 120, max: 160 },
              { label: "Canonical URL",    val: formData.seo.canonicalUrl,    min: 1, max: 999 },
            ].map(({ label, val, min, max }) => {
              const len = val.length;
              const ok = len >= min && len <= max;
              const empty = len === 0;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${empty ? "bg-gray-300 dark:bg-gray-600" : ok ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                  {!empty && <span className={`ml-auto text-xs ${ok ? "text-green-500" : "text-yellow-500"}`}>{len}</span>}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
              {loading ? "Saving..." : "Update Page"}
            </button>
            <button type="button" onClick={() => navigate("/pages")} className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
