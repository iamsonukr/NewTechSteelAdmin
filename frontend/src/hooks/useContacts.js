import { useState, useEffect, useCallback } from "react";
import { getContacts, createContact, updateContact, deleteContact } from "../api/services/contactDetail.service";
import toast from "react-hot-toast";

export default function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getContacts();
      setContacts(res.data.data);
    } catch { toast.error("Failed to load contacts"); }
    finally { setLoading(false); }
  }, []);

  const create = async (data) => {
    const res = await createContact(data);
    toast.success("Contact created!");
    fetchContacts();
    return res.data.data;
  };

  const update = async (id, data) => {
    const res = await updateContact(id, data);
    toast.success("Contact updated!");
    fetchContacts();
    return res.data.data;
  };

  const remove = async (id) => {
    await deleteContact(id);
    toast.success("Contact deleted!");
    fetchContacts();
  };

  useEffect(() => { fetchContacts(); }, [fetchContacts]);
  return { contacts, loading, fetchContacts, create, update, remove };
}
