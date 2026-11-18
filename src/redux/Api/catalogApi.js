import { api } from "./http";

const toQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
};

export const fetchCategoriesApi = () => api.get("/api/categories");
export const createCategoryApi = (payload) => api.post("/api/categories", payload, { auth: true });
export const updateCategoryApi = (id, data) => api.put(`/api/categories/${id}`, data, { auth: true });
export const deleteCategoryApi = (id) => api.del(`/api/categories/${id}`, { auth: true });

export const fetchServicesApi = (params = {}) => api.get(`/api/services${toQuery(params)}`);
export const fetchServiceBySlugApi = (slug) => api.get(`/api/services/slug/${encodeURIComponent(slug)}`);
export const createServiceApi = (payload) => api.post("/api/services", payload, { auth: true });
export const updateServiceApi = (id, data) => api.put(`/api/services/${id}`, data, { auth: true });
export const deleteServiceApi = (id) => api.del(`/api/services/${id}`, { auth: true });

export const fetchLocationsApi = () => api.get("/api/locations");
