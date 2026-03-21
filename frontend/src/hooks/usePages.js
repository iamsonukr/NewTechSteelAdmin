import { useState, useEffect, useCallback } from "react";
import { getPages, createPage, updatePage, deletePage } from "../api/services/page.service";
import toast from "react-hot-toast";

export default function usePages() {
  const [pages, setPages]     = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPages();
      setPages(res.data.data);
    } catch { toast.error("Failed to load pages"); }
    finally { setLoading(false); }
  }, []);

  const create = async (data) => {
    const res = await createPage(data);
    toast.success("Page created!");
    fetchPages();
    return res.data.data;
  };

  const update = async (id, data) => {
    const res = await updatePage(id, data);
    toast.success("Page updated!");
    fetchPages();
    return res.data.data;
  };

  const remove = async (id) => {
    await deletePage(id);
    toast.success("Page deleted!");
    fetchPages();
  };

  useEffect(() => { fetchPages(); }, [fetchPages]);
  return { pages, loading, fetchPages, create, update, remove };
}
