import { api } from "./http";

export const fetchConsultantsApi = (params = {}) => {
  const qs = params.active ? "?active=true" : "";
  return api.get(`/api/consultants${qs}`);
};

export const createConsultantApi = (payload) => api.post("/api/consultants", payload, { auth: true });
export const updateConsultantApi = (id, data) => api.put(`/api/consultants/${id}`, data, { auth: true });
export const deleteConsultantApi = (id) => api.del(`/api/consultants/${id}`, { auth: true });
