import { adminService } from "../axios";
export const getBlogs = (params = {}) => adminService.get('/blogs', { params: { all: true, ...params } });
export const getBlogById = (id) => adminService.get(`/blogs/${id}`);
export const createBlog = (data) => adminService.post('/blogs', data);
export const updateBlog = (id, data) => adminService.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => adminService.delete(`/blogs/${id}`);
