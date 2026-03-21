import { adminService } from "../axios";
export const getBlogCategories = () => adminService.get('/blog-categories?all=true');
export const getBlogCategoryById = (id) => adminService.get(`/blog-categories/${id}`);
export const createBlogCategory = (data) => adminService.post('/blog-categories', data);
export const updateBlogCategory = (id, data) => adminService.put(`/blog-categories/${id}`, data);
export const deleteBlogCategory = (id) => adminService.delete(`/blog-categories/${id}`);
