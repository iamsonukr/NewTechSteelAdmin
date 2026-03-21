import { useAuth } from "../../context/AuthContext";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { profileData, logout } = useAuth();
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Welcome back,{" "}
        <span className="font-semibold text-gray-800 dark:text-white/90">{profileData.name || "Admin"}</span>
      </p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
            <User size={15} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 dark:text-white/90 leading-tight">{profileData.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize leading-tight">{profileData.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
