import { adminService } from "../axios";
export const getBanners     = (page)      => adminService.get(`/hero-banners?all=true${page ? `&page=${page}` : ""}`);
export const getBannerById  = (id)        => adminService.get(`/hero-banners/${id}`);
export const createBanner   = (data)      => adminService.post("/hero-banners", data);
export const updateBanner   = (id, data)  => adminService.put(`/hero-banners/${id}`, data);
export const deleteBanner   = (id)        => adminService.delete(`/hero-banners/${id}`);
