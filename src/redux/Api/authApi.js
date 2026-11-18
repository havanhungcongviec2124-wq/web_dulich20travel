import { api } from "./http";

export const loginApi = (payload) => api.post("/api/auth/login", payload);
export const fetchMeApi = () => api.get("/api/auth/me", { auth: true });
export const changePasswordApi = (payload) => api.post("/api/auth/change-password", payload, { auth: true });
export const forgotPasswordApi = (payload) => api.post("/api/auth/forgot-password", payload);
