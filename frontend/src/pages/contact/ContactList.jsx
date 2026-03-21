import { useState } from "react";
import { Link } from "react-router";
import { Pencil, Trash2, Star, Phone, Mail, MapPin } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import useContacts from "../../hooks/useContacts";

export default function ContactList() {
  const { contacts, loading, remove } = useContacts();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await remove(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader
        title="Contact Details"
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Contact Details" }]}
        addLabel="Add Branch"
        addTo="/contact-details/create"
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
              <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => <div key={j} className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />)}
              </div>
            </div>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-400">
          No contact details found. Add your first branch.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map(contact => (
            <div key={contact._id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">{contact.branchName}</h3>
                  {contact.isPrimary && <Star size={14} className="text-yellow-500 fill-yellow-400" />}
                </div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={contact.isActive} />
                  <Link to={`/contact-details/edit/${contact._id}`} className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors ml-2"><Pencil size={14} /></Link>
                  <button onClick={() => setDeleteId(contact._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="space-y-2">
                {contact.phones?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone size={13} className="shrink-0 text-gray-400" />
                    <span>{contact.phones.join(" · ")}</span>
                  </div>
                )}
                {contact.emails?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={13} className="shrink-0 text-gray-400" />
                    <span>{contact.emails.join(" · ")}</span>
                  </div>
                )}
                {contact.address?.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={13} className="shrink-0 text-gray-400" />
                    <span>{[contact.address.city, contact.address.state, contact.address.pincode].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
