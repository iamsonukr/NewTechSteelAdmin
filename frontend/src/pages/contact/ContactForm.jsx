// Shared form used by both ContactCreate and ContactEdit
import { useState } from "react";
import { Plus, X } from "lucide-react";

const SOCIAL_PLATFORMS = ["facebook", "instagram", "linkedin", "twitter", "youtube", "pinterest"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday - Friday", "Monday - Saturday"];

const inputCls    = "h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900";
const labelCls    = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";
const sectionCls  = "bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4";

export default function ContactForm({ formData, setFormData, loading, onSubmit, onCancel, submitLabel = "Save" }) {
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const setAddr = (k, v) => setFormData(p => ({ ...p, address: { ...p.address, [k]: v } }));

  // Phones
  const addPhone    = ()        => set("phones", [...formData.phones, ""]);
  const updatePhone = (i, v)   => set("phones", formData.phones.map((p, idx) => idx === i ? v : p));
  const removePhone = (i)      => set("phones", formData.phones.filter((_, idx) => idx !== i));

  // Emails
  const addEmail    = ()        => set("emails", [...formData.emails, ""]);
  const updateEmail = (i, v)   => set("emails", formData.emails.map((e, idx) => idx === i ? v : e));
  const removeEmail = (i)      => set("emails", formData.emails.filter((_, idx) => idx !== i));

  // Social Links
  const addSocial    = ()             => set("socialLinks", [...formData.socialLinks, { platform: "facebook", url: "" }]);
  const updateSocial = (i, k, v)     => set("socialLinks", formData.socialLinks.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  const removeSocial = (i)            => set("socialLinks", formData.socialLinks.filter((_, idx) => idx !== i));

  // Business Hours
  const addHours    = ()             => set("businessHours", [...formData.businessHours, { day: "Monday", hours: "", closed: false }]);
  const updateHours = (i, k, v)     => set("businessHours", formData.businessHours.map((h, idx) => idx === i ? { ...h, [k]: v } : h));
  const removeHours = (i)            => set("businessHours", formData.businessHours.filter((_, idx) => idx !== i));

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Branch Info */}
      <div className={sectionCls}>
        <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Branch Info</h3>
        <div>
          <label className={labelCls}>Branch Name <span className="text-error-500">*</span></label>
          <input type="text" value={formData.branchName} onChange={e => set("branchName", e.target.value)} className={inputCls} placeholder="e.g. Head Office, Delhi Branch" />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isPrimary" checked={formData.isPrimary} onChange={e => set("isPrimary", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" />
            <label htmlFor="isPrimary" className="text-sm text-gray-700 dark:text-gray-400">Primary Branch</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => set("isActive", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-500" />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-400">Active</label>
          </div>
        </div>
        <div>
          <label className={labelCls}>Display Order</label>
          <input type="number" value={formData.order} onChange={e => set("order", Number(e.target.value))} className={inputCls} />
        </div>
      </div>

      {/* Phone Numbers */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Phone Numbers</h3>
          <button type="button" onClick={addPhone} className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600">
            <Plus size={14} /> Add
          </button>
        </div>
        {formData.phones.map((phone, i) => (
          <div key={i} className="flex gap-2">
            <input type="tel" value={phone} onChange={e => updatePhone(i, e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
            <button type="button" onClick={() => removePhone(i)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"><X size={15} /></button>
          </div>
        ))}
        {formData.phones.length === 0 && <p className="text-xs text-gray-400 italic">No phone numbers added</p>}
      </div>

      {/* Emails */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Email Addresses</h3>
          <button type="button" onClick={addEmail} className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600">
            <Plus size={14} /> Add
          </button>
        </div>
        {formData.emails.map((email, i) => (
          <div key={i} className="flex gap-2">
            <input type="email" value={email} onChange={e => updateEmail(i, e.target.value)} className={inputCls} placeholder="info@newtechsteel.com" />
            <button type="button" onClick={() => removeEmail(i)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"><X size={15} /></button>
          </div>
        ))}
        {formData.emails.length === 0 && <p className="text-xs text-gray-400 italic">No email addresses added</p>}
      </div>

      {/* Address */}
      <div className={sectionCls}>
        <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Address</h3>
        <div><label className={labelCls}>Address Line 1</label><input type="text" value={formData.address.line1} onChange={e => setAddr("line1", e.target.value)} className={inputCls} placeholder="Street / Building" /></div>
        <div><label className={labelCls}>Address Line 2</label><input type="text" value={formData.address.line2} onChange={e => setAddr("line2", e.target.value)} className={inputCls} placeholder="Area / Landmark" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>City</label><input type="text" value={formData.address.city} onChange={e => setAddr("city", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>State</label><input type="text" value={formData.address.state} onChange={e => setAddr("state", e.target.value)} className={inputCls} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Pincode</label><input type="text" value={formData.address.pincode} onChange={e => setAddr("pincode", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Country</label><input type="text" value={formData.address.country} onChange={e => setAddr("country", e.target.value)} className={inputCls} /></div>
        </div>
      </div>

      {/* WhatsApp & Maps */}
      <div className={sectionCls}>
        <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">WhatsApp & Maps</h3>
        <div><label className={labelCls}>WhatsApp Number</label><input type="tel" value={formData.whatsapp} onChange={e => set("whatsapp", e.target.value)} className={inputCls} placeholder="+91 98765 43210" /></div>
        <div><label className={labelCls}>Google Maps URL</label><input type="url" value={formData.googleMapsUrl} onChange={e => set("googleMapsUrl", e.target.value)} className={inputCls} placeholder="https://maps.google.com/..." /></div>
        <div>
          <label className={labelCls}>Google Maps Embed Code</label>
          <textarea value={formData.googleMapsEmbed} onChange={e => set("googleMapsEmbed", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 resize-none font-mono text-xs" placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>' />
        </div>
      </div>

      {/* Social Links */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Social Media Links</h3>
          <button type="button" onClick={addSocial} className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600"><Plus size={14} /> Add</button>
        </div>
        {formData.socialLinks.map((s, i) => (
          <div key={i} className="flex gap-2">
            <select value={s.platform} onChange={e => updateSocial(i, "platform", e.target.value)} className="h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:border-brand-300 focus:outline-hidden dark:bg-gray-900 capitalize">
              {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="url" value={s.url} onChange={e => updateSocial(i, "url", e.target.value)} className={`${inputCls} flex-1`} placeholder="https://..." />
            <button type="button" onClick={() => removeSocial(i)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"><X size={15} /></button>
          </div>
        ))}
        {formData.socialLinks.length === 0 && <p className="text-xs text-gray-400 italic">No social links added</p>}
      </div>

      {/* Business Hours */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">Business Hours</h3>
          <button type="button" onClick={addHours} className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600"><Plus size={14} /> Add</button>
        </div>
        {formData.businessHours.map((h, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select value={h.day} onChange={e => updateHours(i, "day", e.target.value)} className="h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:border-brand-300 focus:outline-hidden dark:bg-gray-900 min-w-[160px]">
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="text" value={h.hours} onChange={e => updateHours(i, "hours", e.target.value)} disabled={h.closed} className={`${inputCls} flex-1 disabled:opacity-40`} placeholder="9:00 AM - 6:00 PM" />
            <div className="flex items-center gap-1.5 shrink-0">
              <input type="checkbox" checked={h.closed} onChange={e => updateHours(i, "closed", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-500" />
              <span className="text-xs text-gray-500">Closed</span>
            </div>
            <button type="button" onClick={() => removeHours(i)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"><X size={15} /></button>
          </div>
        ))}
        {formData.businessHours.length === 0 && <p className="text-xs text-gray-400 italic">No business hours added</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          {loading ? "Saving..." : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
