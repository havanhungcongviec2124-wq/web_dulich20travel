import { api } from "./http";

const loadMock = async () => import("../../data/mockData.js");

export const fetchConsultantsApi = async (params = {}) => {
  const qs = params.active ? "?active=true" : "";
  try {
    return await api.get(`/api/consultants${qs}`);
  } catch {
    const { consultants } = await loadMock();
    let list = Array.isArray(consultants) ? consultants : [];
    if (params.active) list = list.filter((c) => c.active !== false && c.status !== "Tạm ẩn");
    return { data: list };
  }
};

export const createConsultantApi = (payload) => api.post("/api/consultants", payload, { auth: true });
export const updateConsultantApi = (id, data) => api.put(`/api/consultants/${id}`, data, { auth: true });
export const deleteConsultantApi = (id) => api.del(`/api/consultants/${id}`, { auth: true });
