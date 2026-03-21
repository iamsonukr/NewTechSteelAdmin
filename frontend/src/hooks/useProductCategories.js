import { useState, useEffect, useCallback } from "react";
import { getProductCategories, createProductCategory, updateProductCategory, deleteProductCategory } from "../api/services/productCategory.service";
import toast from "react-hot-toast";

export default function useProductCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductCategories();
      setCategories(res.data.data);
    } catch { toast.error("Failed to load product categories"); }
    finally { setLoading(false); }
  }, []);

  const create = async (data) => {
    const res = await createProductCategory(data);
    toast.success("Category created!");
    fetchCategories();
    return res.data.data;
  };

  const update = async (id, data) => {
    const res = await updateProductCategory(id, data);
    toast.success("Category updated!");
    fetchCategories();
    return res.data.data;
  };

  const remove = async (id) => {
    await deleteProductCategory(id);
    toast.success("Category deleted!");
    fetchCategories();
  };

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  return { categories, loading, fetchCategories, create, update, remove };
}
