import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import useProductCategories from "../../hooks/useProductCategories";

export default function ProductCategoryList() {
  const { categories, loading, remove } = useProductCategories();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await remove(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const columns = [
    { key: "image", label: "Image", render: (row) => row.image
      ? <img src={`${import.meta.env.VITE_BACKEND_URL?.replace('/api','')}${row.image}`} className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700" alt={row.name} />
      : <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg" /> },
    { key: "name",     label: "Name" },
    { key: "slug",     label: "Slug", render: (row) => <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{row.slug}</span> },
    { key: "isActive", label: "Status", render: (row) => <StatusBadge status={row.isActive} /> },
    { key: "actions",  label: "Actions", render: (row) => (
      <div className="flex items-center gap-2">
        <Link to={`/product-categories/edit/${row._id}`} className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Pencil size={15} /></Link>
        <button onClick={() => setDeleteId(row._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Product Categories" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Product Categories" }]} addLabel="Add Category" addTo="/product-categories/create" />
      <DataTable columns={columns} data={categories} loading={loading} searchKey="name" emptyMessage="No product categories found" />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
