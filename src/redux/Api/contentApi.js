import { api } from "./http";

export const fetchContentApi = () => api.get("/api/content");
export const updateContentApi = (payload) => api.put("/api/content", payload, { auth: true });
