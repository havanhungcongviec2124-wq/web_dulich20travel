import { api } from "./http";

const loadMock = async () => import("../../data/mockData.js");

export const fetchContentApi = async () => {
  try {
    return await api.get("/api/content");
  } catch {
    const { company, websiteBanner, services } = await loadMock();
    const featured = Array.isArray(services) ? services.slice(0, 8) : [];
    return {
      data: {
        company: company || {},
        banner: websiteBanner || {},
        featured,
      },
    };
  }
};

export const updateContentApi = (payload) => api.put("/api/content", payload, { auth: true });
