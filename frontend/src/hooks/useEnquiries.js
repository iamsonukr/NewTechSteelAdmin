import { useState, useEffect, useCallback } from "react";
import { getEnquiries, getEnquiryStats, updateEnquiryStatus, deleteEnquiry } from "../api/services/enquiry.service";
import toast from "react-hot-toast";

export default function useEnquiries(params = {}) {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0, closed: 0 });
  const [loading, setLoading] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const [enqRes, statsRes] = await Promise.all([getEnquiries(params), getEnquiryStats()]);
      setEnquiries(enqRes.data.data);
      setStats(statsRes.data.data);
    } catch { toast.error("Failed to load enquiries"); }
    finally { setLoading(false); }
  }, []);

  const updateStatus = async (id, status) => {
    await updateEnquiryStatus(id, status);
    toast.success("Status updated!");
    fetchEnquiries();
  };

  const remove = async (id) => {
    await deleteEnquiry(id);
    toast.success("Enquiry deleted!");
    fetchEnquiries();
  };

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);
  return { enquiries, stats, loading, fetchEnquiries, updateStatus, remove };
}
