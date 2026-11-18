import { api, getToken, getBaseUrl } from "./http";

const toQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && v !== "all") qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
};

export const fetchAdminStatsApi = () => api.get("/api/admin/stats", { auth: true });
export const fetchActivityLogsApi = (params = {}) => api.get(`/api/activity-logs${toQuery(params)}`, { auth: true });
export const createActivityLogApi = (payload) => api.post("/api/activity-logs", payload, { auth: true });

export const exportExcelApi = async (type) => {
  const base = getBaseUrl();
  const path = `/api/excel/export?type=${encodeURIComponent(type)}`;
  const url = base.endsWith("/api") ? `${base}${path.slice(4)}` : `${base}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) {
    let msg = "Không thể export file.";
    try {
      const j = await res.json();
      msg = j.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const blob = await res.blob();
  return { blob, contentDisposition: res.headers.get("content-disposition") || "" };
};

export const importExcelApi = async ({ type, file, commit }) => {
  const base = getBaseUrl();
  const path = `/api/excel/import?type=${encodeURIComponent(type)}&commit=${commit ? "true" : "false"}`;
  const url = base.endsWith("/api") ? `${base}${path.slice(4)}` : `${base}${path}`;
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Không thể xử lý file import.");
  }
  return data.data || data;
};
