import { useState, useEffect, useCallback } from "react";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../api/services/blog.service";
import toast from "react-hot-toast";

export default function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBlogs();
      setBlogs(res.data.data);
    } catch { toast.error("Failed to load blogs"); }
    finally { setLoading(false); }
  }, []);

  const create = async (data) => {
    const res = await createBlog(data);
    toast.success("Blog created!");
    fetchBlogs();
    return res.data.data;
  };

  const update = async (id, data) => {
    const res = await updateBlog(id, data);
    toast.success("Blog updated!");
    fetchBlogs();
    return res.data.data;
  };

  const remove = async (id) => {
    await deleteBlog(id);
    toast.success("Blog deleted!");
    fetchBlogs();
  };

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);
  return { blogs, loading, fetchBlogs, create, update, remove };
}
