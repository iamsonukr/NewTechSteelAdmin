import { useState, useEffect, useCallback } from "react";
import { getGalleryCategories, createGalleryCategory, updateGalleryCategory, deleteGalleryCategory } from "../api/services/galleryCategory.service";
import toast from "react-hot-toast";

export default function useGalleryCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getGalleryCategories();
      setCategories(res.data.data);
    } catch { toast.error("Failed to load gallery categories"); }
    finally { setLoading(false); }
  }, []);

  const create = async (data) => {
    const res = await createGalleryCategory(data);
    toast.success("Category created!");
    fetchCategories();
    return res.data.data;
  };

  const update = async (id, data) => {
    const res = await updateGalleryCategory(id, data);
    toast.success("Category updated!");
    fetchCategories();
    return res.data.data;
  };

  const remove = async (id) => {
    await deleteGalleryCategory(id);
    toast.success("Category deleted!");
    fetchCategories();
  };

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  return { categories, loading, fetchCategories, create, update, remove };
}
