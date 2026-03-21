import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, Tag, FileText, BookOpen,
  Image, FolderOpen, MessageSquare, Settings, ChevronLeft, ChevronRight, Building2
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Products", icon: Package, to: "/products" },
  { label: "Product Categories", icon: Tag, to: "/product-categories" },
  { label: "Blogs", icon: FileText, to: "/blogs" },
  { label: "Blog Categories", icon: BookOpen, to: "/blog-categories" },
  { label: "Gallery", icon: Image, to: "/gallery" },
  { label: "Gallery Categories", icon: FolderOpen, to: "/gallery-categories" },
  { label: "Enquiries", icon: MessageSquare, to: "/enquiries" },
  { label: "Change Password", icon: Settings, to: "/settings/change-password" },
  {
    icon: <FileSearch />,
    name: "Pages & SEO",
    path: "/pages",
  },
  {
    icon: <Phone />,
    name: "Contact Details",
    path: "/contact-details",
  },
  {
    icon: <Layout />,
    name: "Hero Banners",
    path: "/hero-banners",
  },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-40 flex flex-col transition-all duration-300 ${open ? "w-64" : "w-16"}`}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700/60 min-h-[64px]">
        <Building2 className="text-brand-400 shrink-0" size={24} />
        {open && <span className="font-bold text-base tracking-wide text-white truncate">NewTech Steel</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            title={!open ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? "bg-brand-500 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {open && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center py-4 border-t border-gray-700/60 text-gray-400 hover:text-white transition-colors"
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </aside>
  );
}
