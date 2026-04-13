import { create } from "zustand";

interface AuthState {
    token: string | null;
    admin: { name: string; email: string } | null;
    setAuth: (token: string, admin: { name: string; email: string }) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    token:
        typeof window !== "undefined" ? localStorage.getItem("admin_token") : null,
    admin:
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("admin_user") || "null")
            : null,

    setAuth: (token, admin) => {
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_user", JSON.stringify(admin));
        set({ token, admin });
    },

    logout: () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        set({ token: null, admin: null });
    },

    isAuthenticated: () => !!get().token,
}));
