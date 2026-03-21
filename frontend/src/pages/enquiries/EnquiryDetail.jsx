import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, Package } from "lucide-react";
import StatusBadge from "../../components/shared/StatusBadge";
import { getEnquiryById, updateEnquiryStatus } from "../../api/services/enquiry.service";
import toast from "react-hot-toast";

const statuses = ["new", "read", "replied", "closed"];

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getEnquiryById(id)
      .then(res => setEnquiry(res.data.data))
      .catch(() => toast.error("Failed to load enquiry"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await updateEnquiryStatus(id, status);
      setEnquiry(prev => ({ ...prev, status }));
      toast.success("Status updated!");
    } catch { toast.error("Failed to update status"); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!enquiry) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/enquiries")} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><ArrowLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Enquiry Detail</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">From {enquiry.name} · {new Date(enquiry.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm mb-4">Message</h3>
            {enquiry.subject && <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{enquiry.subject}</p>}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
          </div>
          {enquiry.productRef && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm mb-3 flex items-center gap-2"><Package size={14} /> Product Reference</h3>
              <p className="text-sm text-brand-500">{enquiry.productRef.name}</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm"><Mail size={14} className="text-gray-400 shrink-0" /><span className="text-gray-700 dark:text-gray-300">{enquiry.email}</span></div>
              {enquiry.phone && <div className="flex items-center gap-2.5 text-sm"><Phone size={14} className="text-gray-400 shrink-0" /><span className="text-gray-700 dark:text-gray-300">{enquiry.phone}</span></div>}
              <div className="flex items-center gap-2.5 text-sm"><Globe size={14} className="text-gray-400 shrink-0" /><span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">{enquiry.source}</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm mb-4">Update Status</h3>
            <div className="flex items-center gap-2 mb-4"><StatusBadge status={enquiry.status} /></div>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map(s => (
                <button key={s} onClick={() => handleStatusChange(s)} disabled={updating || enquiry.status === s}
                  className={`py-2 text-xs font-medium rounded-lg capitalize transition-colors ${enquiry.status === s ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"} disabled:opacity-50`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
