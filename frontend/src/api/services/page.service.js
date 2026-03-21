import { adminService } from "../axios";
export const getPages       = ()        => adminService.get("/pages?all=true");
export const getPageById    = (id)      => adminService.get(`/pages/id/${id}`);
export const getPageBySlug  = (slug)    => adminService.get(`/pages/${slug}`);
export const createPage     = (data)    => adminService.post("/pages", data);
export const updatePage     = (id, data)=> adminService.put(`/pages/${id}`, data);
export const deletePage     = (id)      => adminService.delete(`/pages/${id}`);
