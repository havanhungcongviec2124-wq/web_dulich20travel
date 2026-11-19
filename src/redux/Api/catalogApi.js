import { api } from "./http";

const toQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
};

const normalizeText = (v) =>
  String(v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

const loadMock = async () => import("../../data/mockData.js");

const withMock = async (fn, fallback) => {
  try {
    return await fn();
  } catch {
    return await fallback();
  }
};

export const fetchCategoriesApi = () =>
  withMock(
    () => api.get("/api/categories"),
    async () => {
      const { categories } = await loadMock();
      return { data: categories || [] };
    }
  );

export const createCategoryApi = (payload) => api.post("/api/categories", payload, { auth: true });
export const updateCategoryApi = (id, data) => api.put(`/api/categories/${id}`, data, { auth: true });
export const deleteCategoryApi = (id) => api.del(`/api/categories/${id}`, { auth: true });

export const fetchServicesApi = (params = {}) =>
  withMock(
    () => api.get(`/api/services${toQuery(params)}`),
    async () => {
      const { services } = await loadMock();
      let list = Array.isArray(services) ? [...services] : [];
      const { q, category, location, limit } = params || {};
      if (category) list = list.filter((s) => s.category === category || s.categoryKey === category || s.categoryId === category);
      if (location) {
        const l = normalizeText(location);
        list = list.filter((s) => normalizeText(s.location).includes(l) || normalizeText(s.locationSlug || s.locationKey).includes(l));
      }
      if (q) {
        const needle = normalizeText(q);
        list = list.filter((s) => normalizeText(s.name).includes(needle) || normalizeText(s.code).includes(needle));
      }
      const total = list.length;
      if (limit != null && limit !== "") list = list.slice(0, Number(limit) || list.length);
      return { data: list, total };
    }
  );

export const fetchServiceBySlugApi = (slug) =>
  withMock(
    () => {
      if (!slug || slug === "undefined" || slug === "null") {
        const err = new Error("Không tìm thấy dịch vụ.");
        err.status = 404;
        return Promise.reject(err);
      }
      return api.get(`/api/services/slug/${encodeURIComponent(slug)}`);
    },
    async () => {
      if (!slug || slug === "undefined" || slug === "null") {
        const err = new Error("Không tìm thấy dịch vụ.");
        err.status = 404;
        throw err;
      }
      const { services } = await loadMock();
      const list = Array.isArray(services) ? services : [];
      const found = list.find((s) => s.slug === slug || s.code === slug || s.id === slug);
      if (!found) {
        const err = new Error("Không tìm thấy dịch vụ.");
        err.status = 404;
        throw err;
      }
      return { data: found };
    }
  );

export const createServiceApi = (payload) => api.post("/api/services", payload, { auth: true });
export const updateServiceApi = (id, data) => api.put(`/api/services/${id}`, data, { auth: true });
export const deleteServiceApi = (id) => api.del(`/api/services/${id}`, { auth: true });

export const fetchLocationsApi = () =>
  withMock(
    () => api.get("/api/locations"),
    async () => {
      const { services } = await loadMock();
      const list = Array.isArray(services) ? services : [];
      const seen = new Map();
      list.forEach((s) => {
        const name = s.location || s.locationName;
        if (!name) return;
        const slug = s.locationSlug || normalizeText(name).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        if (!seen.has(slug)) seen.set(slug, { name, slug });
      });
      return { data: Array.from(seen.values()) };
    }
  );
