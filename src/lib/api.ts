import axios from "axios";

const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || "https://wedding-catalog-api.vercel.app"
).replace(/\/+$/, "");

const api = axios.create({
    baseURL: `${apiBase}/api`,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
