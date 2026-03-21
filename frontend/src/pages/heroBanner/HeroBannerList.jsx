import { useState } from "react";
import { Link } from "react-router";
import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import useHeroBanners from "../../hooks/useHeroBanners";

const BASE = import.meta.env.VITE_BACKEND_URL?.replace("/api", "") || "http://localhost:5000";

export default function HeroBannerList() {
  const { banners, loading, remove } = useHeroBanners();
  const [deleteId, setDeleteId]      = useState(null);
  const [deleting, setDeleting]      = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await remove(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const columns = [
    { key: "backgroundImage", label: "Image", render: (row) =>
      row.backgroundImage
        ? <img src={`${BASE}${row.backgroundImage}`} className="w-20 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700" alt={row.title} />
        : <div className="w-20 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"><ImageIcon size={16} className="text-gray-400" /></div>
    },
    { key: "page",      label: "Page",      render: (row) => <span className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded font-medium">{row.page}</span> },
    { key: "title",     label: "Title" },
    { key: "alignment", label: "Align",     render: (row) => <span className="capitalize text-sm text-gray-600 dark:text-gray-400">{row.alignment}</span> },
    { key: "order",     label: "Order" },
    { key: "isActive",  label: "Status",    render: (row) => <StatusBadge status={row.isActive} /> },
    { key: "actions",   label: "Actions",   render: (row) => (
      <div className="flex items-center gap-2">
        <Link to={`/hero-banners/edit/${row._id}`} className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Pencil size={15} /></Link>
        <button onClick={() => setDeleteId(row._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Hero Banners" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Hero Banners" }]} addLabel="Add Banner" addTo="/hero-banners/create" />
      <DataTable columns={columns} data={banners} loading={loading} searchKey="page" emptyMessage="No hero banners found" />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
