import { adminService } from "../axios";
export const getProducts = (params = {}) => adminService.get('/products', { params: { all: true, ...params } });
export const getProductById = (id) => adminService.get(`/products/single/${id}`);
export const createProduct = (data) => adminService.post('/products', data);
export const updateProduct = (id, data) => adminService.put(`/products/${id}`, data);
export const deleteProduct = (id) => adminService.delete(`/products/${id}`);
