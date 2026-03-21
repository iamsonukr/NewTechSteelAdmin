import { adminService } from "./axios";

export const setupInterceptors = (auth, setAuth) => {

    const logout = () => {
        console.log("Logging out user due to auth failure");
        localStorage.removeItem("AccessToken");
        localStorage.removeItem("UserRole");
        setAuth(null);
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    };

    const interceptorId = adminService.interceptors.response.use(
        (res) => res,
        async (err) => {
            const originalRequest = err.config;
            if (err.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                logout();
            }
            return Promise.reject(err);
        }
    );

    // Return cleanup function to eject interceptor when needed
    return () => {
        adminService.interceptors.response.eject(interceptorId);
    };
};