import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { adminService } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { toast.error("Please fill in all fields"); return; }
    setIsLoading(true);
    try {
      const res = await adminService.post("/auth/login", formData);
      if (res.data.success) {
        login(res.data.token, res.data.user.role);
        toast.success("Welcome back!");
        navigate("/admin-panel/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-md border border-gray-200 dark:border-gray-800 p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-white/90">NewTech Steel</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Sign In</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Email <span className="text-error-500">*</span>
              </label>
              <input
                type="email"
                placeholder="admin@newtechsteel.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={isLoading}
                className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 dark:focus:border-brand-800 disabled:opacity-40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Password <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={isLoading}
                  className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 dark:focus:border-brand-800 disabled:opacity-40"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors shadow-theme-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
