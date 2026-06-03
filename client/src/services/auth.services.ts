import type { AuthResponse, LoginData, RegisterData } from "../types";
import api from "./api";

export const authService = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>("/auth/register", data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return res.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>("/auth/login", data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return res.data;
    },

    logout: async () => {
        try {
            await api.post("/auth/logout", {});
        } finally {
            localStorage.removeItem("user");
        }
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem("user");
    },
};
