import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import useBlogs from "../../hooks/useBlogs";

const BASE = import.meta.env.VITE_BACKEND_URL?.replace('/api','') || 'http://localhost:5000';

export default function BlogList() {
  const { blogs, loading, remove } = useBlogs();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await remove(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const columns = [
    { key: "coverImage", label: "Cover", render: (row) => row.coverImage
      ? <img src={`${BASE}${row.coverImage}`} className="w-14 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700" alt={row.title} />
      : <div className="w-14 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg" /> },
    { key: "title",       label: "Title" },
    { key: "category",    label: "Category", render: (row) => <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">{row.category?.name || "—"}</span> },
    { key: "isPublished", label: "Status", render: (row) => <StatusBadge status={row.isPublished ? "published" : "draft"} /> },
    { key: "author",      label: "Author" },
    { key: "actions",     label: "Actions", render: (row) => (
      <div className="flex items-center gap-2">
        <Link to={`/blogs/edit/${row._id}`} className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Pencil size={15} /></Link>
        <button onClick={() => setDeleteId(row._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Blogs" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Blogs" }]} addLabel="Add Blog" addTo="/blogs/create" />
      <DataTable columns={columns} data={blogs} loading={loading} searchKey="title" emptyMessage="No blogs found" />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
