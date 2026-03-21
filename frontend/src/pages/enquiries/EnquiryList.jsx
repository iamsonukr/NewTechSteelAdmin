import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import useEnquiries from "../../hooks/useEnquiries";

const statusTabs = ["all", "new", "read", "replied", "closed"];

export default function EnquiryList() {
  const [activeTab, setActiveTab] = useState("all");
  const { enquiries, stats, loading, remove } = useEnquiries();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => { setDeleting(true); await remove(deleteId); setDeleting(false); setDeleteId(null); };

  const filtered = activeTab === "all" ? enquiries : enquiries.filter(e => e.status === activeTab);

  const columns = [
    { key: "name",    label: "Name" },
    { key: "email",   label: "Email" },
    { key: "phone",   label: "Phone" },
    { key: "source",  label: "Source", render: (row) => <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">{row.source}</span> },
    { key: "status",  label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", label: "Date", render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { key: "actions", label: "Actions", render: (row) => (
      <div className="flex items-center gap-2">
        <Link to={`/enquiries/${row._id}`} className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Eye size={15} /></Link>
        <button onClick={() => setDeleteId(row._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Enquiries" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Enquiries" }]} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {[
          { label: "Total", value: stats.total, color: "text-gray-800 dark:text-white/90" },
          { label: "New", value: stats.new, color: "text-blue-600 dark:text-blue-400" },
          { label: "Read", value: stats.read, color: "text-gray-600 dark:text-gray-400" },
          { label: "Replied", value: stats.replied, color: "text-green-600 dark:text-green-400" },
          { label: "Closed", value: stats.closed, color: "text-red-600 dark:text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {statusTabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${activeTab === tab ? "bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 shadow-theme-xs" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {tab}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} searchKey="name" emptyMessage="No enquiries found" />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
