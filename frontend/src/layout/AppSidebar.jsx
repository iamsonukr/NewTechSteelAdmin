import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  Tag,
  FileText,
  BookOpen,
  Image,
  FolderOpen,
  MessageSquare,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Building2,
  FileSearch,
  Phone,
  Layout,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    icon: <LayoutDashboard />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <Package />,
    name: "Products",
    path: "/products",
    subItems: [
      { name: "All Products", path: "/products" },
      { name: "Add Product", path: "/products/create" },
      { name: "Product Categories", path: "/product-categories" },
    ],
  },
  {
    icon: <FileText />,
    name: "Blogs",
    path: "/blogs",
    subItems: [
      { name: "All Blogs", path: "/blogs" },
      { name: "Add Blog", path: "/blogs/create" },
      { name: "Blog Categories", path: "/blog-categories" },
    ],
  },
  {
    icon: <Image />,
    name: "Gallery",
    path: "/gallery",
    subItems: [
      { name: "All Images", path: "/gallery" },
      { name: "Add Image", path: "/gallery/create" },
      { name: "Gallery Categories", path: "/gallery-categories" },
    ],
  },
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
  {
    icon: <MessageSquare />,
    name: "Enquiries",
    path: "/enquiries",
  },
  {
    icon: <Settings />,
    name: "Settings",
    path: "/settings/change-password",
    adminOnly: true,
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { isAdmin } = useAuth();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  // Filter nav items based on role
  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => !item.adminOnly || isAdmin());
  }, [isAdmin]);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  // Check if any subitem is active (to keep parent highlighted)
  const isParentActive = useCallback(
    (item) => {
      if (!item.subItems) return false;
      return item.subItems.some(sub => location.pathname.startsWith(sub.path));
    },
    [location.pathname]
  );

  const handleSubmenuToggle = useCallback((index, menuType, event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isExpanded) setIsHovered(true);
  }, [isExpanded, setIsHovered]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, [setIsHovered]);

  // Auto-open submenu if a child path is active
  useEffect(() => {
    let matched = false;
    filteredNavItems.forEach((nav, index) => {
      if (nav.subItems) {
        const hasActive = nav.subItems.some(sub => location.pathname.startsWith(sub.path));
        if (hasActive) {
          setOpenSubmenu({ type: "main", index });
          matched = true;
        }
      }
    });
    if (!matched) setOpenSubmenu(null);
  }, [location.pathname, filteredNavItems]);

  // Calculate submenu heights for animation
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const element = subMenuRefs.current[key];
      if (element) {
        requestAnimationFrame(() => {
          setSubMenuHeight((prev) => ({
            ...prev,
            [key]: element.scrollHeight || 0,
          }));
        });
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = useCallback(
    (items, menuType) => (
      <ul className="flex flex-col gap-4">
        {items.map((nav, index) => (
          <li key={`${menuType}-${nav.name}-${index}`}>
            {nav.subItems ? (
              // Item with submenu
              <button
                type="button"
                onClick={(e) => handleSubmenuToggle(index, menuType, e)}
                className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index || isParentActive(nav)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
                aria-expanded={openSubmenu?.type === menuType && openSubmenu?.index === index}
              >
                <span
                  className={`menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index || isParentActive(nav)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDown
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                      }`}
                  />
                )}
              </button>
            ) : (
              // Regular nav item
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path) || location.pathname.startsWith(nav.path + "/")
                      ? "menu-item-active"
                      : "menu-item-inactive"
                    }`}
                >
                  <span
                    className={`menu-item-icon-size ${isActive(nav.path) || location.pathname.startsWith(nav.path + "/")
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* Submenu dropdown */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  if (el) subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`] || "auto"}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={`${subItem.name}-${subItem.path}`}>
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item ${isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                          }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    ),
    [isExpanded, isHovered, isMobileOpen, openSubmenu, subMenuHeight, isActive, isParentActive, handleSubmenuToggle, location.pathname]
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="text-lg font-bold text-gray-800 dark:text-white/90 leading-tight">
              NewTech<br />
              <span className="text-brand-500 text-sm font-semibold">Steel</span>
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;