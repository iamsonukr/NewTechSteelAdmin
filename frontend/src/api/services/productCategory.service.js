import { adminService } from "../axios";
export const getProductCategories = () => adminService.get('/product-categories?all=true');
export const getProductCategoryById = (id) => adminService.get(`/product-categories/${id}`);
export const createProductCategory = (data) => adminService.post('/product-categories', data);
export const updateProductCategory = (id, data) => adminService.put(`/product-categories/${id}`, data);
export const deleteProductCategory = (id) => adminService.delete(`/product-categories/${id}`);
