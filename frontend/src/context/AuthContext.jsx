import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { adminService } from "../api/axios";
import { setupInterceptors } from "../api/setupInterceptors";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthContextProvider = ({ children }) => {

    // ─── Single source of truth ──────────────────────────────────────────────
    const [AccessToken, setAccessToken] = useState(
        () => localStorage.getItem("AccessToken") || ""
    );

    const [UserRole, setUserRole] = useState(
        () => localStorage.getItem("UserRole") || ""
    );

    const [auth, setAuth] = useState(() => {
        const accessToken = localStorage.getItem("AccessToken");
        const userRole = localStorage.getItem("UserRole");
        return accessToken ? { accessToken, userRole } : null;
    });

    // ─── Admin Profile ───────────────────────────────────────────────────────
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        role: "",  // "admin" | "editor"
    });

    // ─── Keep a ref to the interceptor cleanup fn ────────────────────────────
    const interceptorCleanup = useRef(null);

    // ─── Fetch Admin Profile ─────────────────────────────────────────────────
    const fetchProfileData = useCallback(async () => {
        if (!AccessToken) return;
        try {
            const response = await adminService.get("/auth/me");
            setProfileData(response.data.user);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    }, [AccessToken]);

    // ─── Login ───────────────────────────────────────────────────────────────
    const login = (token, role) => {
        localStorage.setItem("AccessToken", token);
        localStorage.setItem("UserRole", role);
        setAccessToken(token);
        setUserRole(role);
        setAuth({ accessToken: token, userRole: role });
    };

    // ─── Logout ──────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        localStorage.removeItem("AccessToken");
        localStorage.removeItem("UserRole");
        setAccessToken("");
        setUserRole("");
        setAuth(null);
        setProfileData({ name: "", email: "", role: "" });
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }, []);

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const isAuthenticated = () => !!AccessToken;
    const hasRole = (requiredRole) => UserRole === requiredRole;
    const isAdmin = () => UserRole === "admin";
    const isEditor = () => UserRole === "editor";

    // ─── Setup interceptors once auth is available ───────────────────────────
    useEffect(() => {
        // Eject previous interceptor before setting up new one
        if (interceptorCleanup.current) {
            interceptorCleanup.current();
        }
        if (auth) {
            interceptorCleanup.current = setupInterceptors(auth, logout);
        }
        // Cleanup on unmount
        return () => {
            if (interceptorCleanup.current) {
                interceptorCleanup.current();
            }
        };
    }, [auth, logout]);

    // ─── Fetch profile when token changes ────────────────────────────────────
    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    // ─── Context values ──────────────────────────────────────────────────────
    const values = {
        AccessToken,
        setAccessToken,
        UserRole,
        setUserRole,
        auth,
        setAuth,
        login,
        logout,
        isAuthenticated,
        hasRole,
        isAdmin,
        isEditor,
        profileData,
        setProfileData,
        fetchProfileData,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;