import { useState, useEffect, useCallback } from "react";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../api/services/heroBanner.service";
import toast from "react-hot-toast";

export default function useHeroBanners(page) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBanners(page);
      setBanners(res.data.data);
    } catch { toast.error("Failed to load banners"); }
    finally { setLoading(false); }
  }, [page]);

  const create = async (data) => {
    const res = await createBanner(data);
    toast.success("Banner created!");
    fetchBanners();
    return res.data.data;
  };

  const update = async (id, data) => {
    const res = await updateBanner(id, data);
    toast.success("Banner updated!");
    fetchBanners();
    return res.data.data;
  };

  const remove = async (id) => {
    await deleteBanner(id);
    toast.success("Banner deleted!");
    fetchBanners();
  };

  useEffect(() => { fetchBanners(); }, [fetchBanners]);
  return { banners, loading, fetchBanners, create, update, remove };
}
