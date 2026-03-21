import { useState, useEffect, useCallback } from "react";
import { getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory } from "../api/services/blogCategory.service";
import toast from "react-hot-toast";

export default function useBlogCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBlogCategories();
      setCategories(res.data.data);
    } catch { toast.error("Failed to load blog categories"); }
    finally { setLoading(false); }
  }, []);

  const create = async (data) => {
    const res = await createBlogCategory(data);
    toast.success("Category created!");
    fetchCategories();
    return res.data.data;
  };

  const update = async (id, data) => {
    const res = await updateBlogCategory(id, data);
    toast.success("Category updated!");
    fetchCategories();
    return res.data.data;
  };

  const remove = async (id) => {
    await deleteBlogCategory(id);
    toast.success("Category deleted!");
    fetchCategories();
  };

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  return { categories, loading, fetchCategories, create, update, remove };
}
