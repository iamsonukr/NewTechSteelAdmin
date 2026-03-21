import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import { adminService } from "../../api/axios";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const toggleShow = (k) => setShow(p => ({ ...p, [k]: !p[k] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required"); return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match"); return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters"); return;
    }
    setLoading(true);
    try {
      await adminService.put("/auth/update-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally { setLoading(false); }
  };

  const inputCls = "h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";

  const PasswordField = ({ id, label, field }) => (
    <div>
      <label className={labelCls}>{label} <span className="text-error-500">*</span></label>
      <div className="relative">
        <input
          type={show[field] ? "text" : "password"}
          value={formData[id]}
          onChange={(e) => set(id, e.target.value)}
          disabled={loading}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => toggleShow(field)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {show[field] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Change Password"
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Change Password" }]}
      />
      <div className="max-w-lg bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField id="currentPassword" label="Current Password" field="current" />
          <PasswordField id="newPassword"     label="New Password"     field="new" />
          <PasswordField id="confirmPassword" label="Confirm New Password" field="confirm" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Minimum 6 characters</p>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
