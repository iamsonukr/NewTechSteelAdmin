import { useState, useEffect, useCallback } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/services/product.service";
import toast from "react-hot-toast";

export default function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts(params);
      setProducts(res.data.data);
    } catch { toast.error("Failed to load products"); }
    finally { setLoading(false); }
  }, []);

  const create = async (data) => {
    const res = await createProduct(data);
    toast.success("Product created!");
    fetchProducts();
    return res.data.data;
  };

  const update = async (id, data) => {
    const res = await updateProduct(id, data);
    toast.success("Product updated!");
    fetchProducts();
    return res.data.data;
  };

  const remove = async (id) => {
    await deleteProduct(id);
    toast.success("Product deleted!");
    fetchProducts();
  };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return { products, loading, fetchProducts, create, update, remove };
}
