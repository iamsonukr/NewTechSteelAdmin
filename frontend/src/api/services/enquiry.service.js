import { adminService } from "../axios";
export const getEnquiries = (params = {}) => adminService.get('/enquiries', { params });
export const getEnquiryById = (id) => adminService.get(`/enquiries/${id}`);
export const updateEnquiryStatus = (id, status) => adminService.patch(`/enquiries/${id}/status`, { status });
export const deleteEnquiry = (id) => adminService.delete(`/enquiries/${id}`);
export const getEnquiryStats = () => adminService.get('/enquiries/stats');
