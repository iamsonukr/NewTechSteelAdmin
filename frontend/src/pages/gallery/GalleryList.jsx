import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Star } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import useGallery from "../../hooks/useGallery";
import { useEffect } from "react";

const BASE = import.meta.env.VITE_BACKEND_URL?.replace('/api','') || 'http://localhost:5000';

export default function GalleryList() {
  const { gallery, loading, remove } = useGallery();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => { setDeleting(true); await remove(deleteId); setDeleting(false); setDeleteId(null); };

  useEffect(() => {
    console.log("Gallery items:", gallery);
}, [gallery]);

  return (
    <div>
      <PageHeader title="Gallery" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Gallery" }]} addLabel="Add Image" addTo="/gallery/create" />
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : gallery.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-400">No gallery items found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {gallery.map(item => (
            <div key={item._id} className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="aspect-square">
                <img src={`${BASE}${item.image}`} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex items-center justify-between">
                  <StatusBadge status={item.isActive} />
                  {item.isFeatured && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                </div>
                <div>
                  {item.title && <p className="text-white text-xs font-medium truncate mb-2">{item.title}</p>}
                  <div className="flex gap-2">
                    <Link to={`/gallery/edit/${item._id}`} className="flex-1 flex items-center justify-center py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs transition-colors"><Pencil size={13} /></Link>
                    <button onClick={() => setDeleteId(item._id)} className="flex-1 flex items-center justify-center py-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white text-xs transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
