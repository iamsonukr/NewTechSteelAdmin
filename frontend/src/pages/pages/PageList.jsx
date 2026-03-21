import { useState } from "react";
import { Link } from "react-router";
import { Pencil, Trash2, Globe } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import usePages from "../../hooks/usePages";

export default function PageList() {
  const { pages, loading, remove } = usePages();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await remove(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const columns = [
    { key: "title",  label: "Page Title" },
    { key: "slug",   label: "Slug", render: (row) => (
      <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">/{row.slug}</span>
    )},
    { key: "seo", label: "Meta Title", render: (row) => (
      <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs block">
        {row.seo?.metaTitle || <span className="text-gray-300 dark:text-gray-600 italic">Not set</span>}
      </span>
    )},
    { key: "seo2", label: "Canonical URL", render: (row) => (
      row.seo?.canonicalUrl
        ? <a href={row.seo.canonicalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-brand-500 hover:underline"><Globe size={12} />{row.seo.canonicalUrl}</a>
        : <span className="text-gray-300 dark:text-gray-600 italic text-xs">Not set</span>
    )},
    { key: "isActive", label: "Status", render: (row) => <StatusBadge status={row.isActive} /> },
    { key: "actions",  label: "Actions",  render: (row) => (
      <div className="flex items-center gap-2">
        <Link to={`/pages/edit/${row._id}`} className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Pencil size={15} /></Link>
        <button onClick={() => setDeleteId(row._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Pages & SEO"
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Pages" }]}
        addLabel="Add Page"
        addTo="/pages/create"
      />
      <DataTable columns={columns} data={pages} loading={loading} searchKey="title" emptyMessage="No pages found" />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
