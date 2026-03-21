import { Link } from "react-router-dom";
import { Plus, ChevronRight } from "lucide-react";

export default function PageHeader({ title, breadcrumbs = [], addLabel, addTo }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">{title}</h1>
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={13} />}
                {b.to
                  ? <Link to={b.to} className="hover:text-brand-500 transition-colors">{b.label}</Link>
                  : <span className="text-gray-800 dark:text-white/70">{b.label}</span>}
              </span>
            ))}
          </div>
        )}
      </div>
      {addLabel && addTo && (
        <Link
          to={addTo}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors shadow-theme-xs"
        >
          <Plus size={16} />
          {addLabel}
        </Link>
      )}
    </div>
  );
}
