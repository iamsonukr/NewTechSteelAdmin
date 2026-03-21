import { useState, useEffect, useCallback } from "react";
import { getGallery, createGallery, updateGallery, deleteGallery } from "../api/services/gallery.service";
import toast from "react-hot-toast";

export default function useGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getGallery();
      setGallery(res.data.data);
    } catch { toast.error("Failed to load gallery"); }
    finally { setLoading(false); }
  }, []);

  const create = async (data) => {
    const res = await createGallery(data);
    toast.success("Gallery item created!");
    fetchGallery();
    return res.data.data;
  };

  const update = async (id, data) => {
    const res = await updateGallery(id, data);
    toast.success("Gallery item updated!");
    fetchGallery();
    return res.data.data;
  };

  const remove = async (id) => {
    await deleteGallery(id);
    toast.success("Gallery item deleted!");
    fetchGallery();
  };

  useEffect(() => { fetchGallery(); }, [fetchGallery]);
  return { gallery, loading, fetchGallery, create, update, remove };
}
