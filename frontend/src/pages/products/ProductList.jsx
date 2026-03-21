import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Star } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import useProducts from "../../hooks/useProducts";

const BASE = import.meta.env.VITE_BACKEND_URL?.replace('/api','') || 'http://localhost:5000';

export default function ProductList() {
  const { products, loading, remove } = useProducts();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await remove(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const columns = [
    { key: "image", label: "Image", render: (row) => row.images?.[0]
      ? <img src={`${BASE}${row.images[0]}`} className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700" alt={row.name} />
      : <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg" /> },
    { key: "name",       label: "Name" },
    { key: "category",   label: "Category", render: (row) => <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">{row.category?.name || "—"}</span> },
    { key: "isFeatured", label: "Featured",  render: (row) => row.isFeatured ? <Star size={15} className="text-yellow-500 fill-yellow-400" /> : <span className="text-gray-300">—</span> },
    { key: "isActive",   label: "Status",    render: (row) => <StatusBadge status={row.isActive} /> },
    { key: "actions",    label: "Actions",   render: (row) => (
      <div className="flex items-center gap-2">
        <Link to={`/products/edit/${row._id}`} className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Pencil size={15} /></Link>
        <button onClick={() => setDeleteId(row._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Products" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Products" }]} addLabel="Add Product" addTo="/products/create" />
      <DataTable columns={columns} data={products} loading={loading} searchKey="name" emptyMessage="No products found" />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
