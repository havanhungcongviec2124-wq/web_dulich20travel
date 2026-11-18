const TOKEN_KEY = "20travel_admin_token";

const isLocalHostName = (host) => /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(host || "");

export const getBaseUrl = () => {
  const runtime =
    typeof window !== "undefined" && window.__API_BASE_URL__ != null
      ? String(window.__API_BASE_URL__)
      : "";
  const env = import.meta.env.VITE_API_URL != null ? String(import.meta.env.VITE_API_URL) : "";
  const pageIsLocal = typeof window !== "undefined" && isLocalHostName(window.location.hostname);
  const envIsLocal = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(env.trim());
  const effectiveEnv = env && !(envIsLocal && !pageIsLocal) ? env : "";
  const fallback = pageIsLocal ? "http://localhost:5000" : "";
  const url = (runtime || effectiveEnv || fallback).trim();
  return url.replace(/\/+$/, "");
};

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiFetch(path, options = {}) {
  let p = path.startsWith("/") ? path : `/${path}`;
  // avoid double /api when baseURL already ends with /api and path starts with /api
  const base = getBaseUrl();
  if (base.endsWith("/api") && p.startsWith("/api/")) p = p.slice(4);
  const url = `${base}${p}`;

  const { method = "GET", body, headers = {}, auth = false, isForm = false } = options;
  const finalHeaders = { ...headers };
  if (!isForm && body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = finalHeaders["Content-Type"] || "application/json";
  }
  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
        ? body
        : typeof body === "string"
        ? body
        : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else if (
    contentType.includes("spreadsheet") ||
    contentType.includes("octet-stream") ||
    contentType.includes("application/vnd")
  ) {
    data = await res.blob();
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (path, opts) => apiFetch(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => apiFetch(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => apiFetch(path, { ...opts, method: "PUT", body }),
  del: (path, opts) => apiFetch(path, { ...opts, method: "DELETE" }),
};
