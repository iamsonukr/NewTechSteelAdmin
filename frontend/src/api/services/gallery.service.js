import { adminService } from "../axios";
export const getGallery = (params = {}) => adminService.get('/gallery', { params: { all: true, ...params } });
export const getGalleryById = (id) => adminService.get(`/gallery/${id}`);
export const createGallery = (data) => adminService.post('/gallery', data);
export const updateGallery = (id, data) => adminService.put(`/gallery/${id}`, data);
export const deleteGallery = (id) => adminService.delete(`/gallery/${id}`);
