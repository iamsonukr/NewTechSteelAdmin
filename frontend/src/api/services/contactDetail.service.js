import { adminService } from "../axios";
export const getContacts      = ()         => adminService.get("/contact-details?all=true");
export const getContactById   = (id)       => adminService.get(`/contact-details/${id}`);
export const createContact    = (data)     => adminService.post("/contact-details", data);
export const updateContact    = (id, data) => adminService.put(`/contact-details/${id}`, data);
export const deleteContact    = (id)       => adminService.delete(`/contact-details/${id}`);
