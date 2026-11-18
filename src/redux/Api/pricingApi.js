import { api } from "./http";

const toQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
};

export const fetchPricingRulesApi = (params = {}) => api.get(`/api/pricing/rules${toQuery(params)}`);
export const fetchDailyPricesApi = (params = {}) => api.get(`/api/pricing/daily${toQuery(params)}`);
export const fetchCalendarApi = (params = {}) => api.get(`/api/pricing/calendar${toQuery(params)}`);
export const upsertPricingRuleApi = (payload) => api.post("/api/pricing/rules", payload, { auth: true });
export const upsertDailyPriceApi = (payload) => api.post("/api/pricing/daily", payload, { auth: true });
