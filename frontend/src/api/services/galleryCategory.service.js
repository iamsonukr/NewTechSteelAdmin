import { adminService } from "../axios";
export const getGalleryCategories = () => adminService.get('/gallery-categories?all=true');
export const getGalleryCategoryById = (id) => adminService.get(`/gallery-categories/${id}`);
export const createGalleryCategory = (data) => adminService.post('/gallery-categories', data);
export const updateGalleryCategory = (id, data) => adminService.put(`/gallery-categories/${id}`, data);
export const deleteGalleryCategory = (id) => adminService.delete(`/gallery-categories/${id}`);
