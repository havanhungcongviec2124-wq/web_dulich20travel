import { api } from "./http";

const toQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
};

const withMock = async (fn, fallback) => {
  try {
    return await fn();
  } catch {
    return await fallback();
  }
};

export const fetchPricingRulesApi = (params = {}) =>
  withMock(
    () => api.get(`/api/pricing/rules${toQuery(params)}`),
    async () => ({ data: [] })
  );

export const fetchDailyPricesApi = (params = {}) =>
  withMock(
    () => api.get(`/api/pricing/daily${toQuery(params)}`),
    async () => ({ data: [] })
  );

export const fetchCalendarApi = (params = {}) =>
  withMock(
    () => api.get(`/api/pricing/calendar${toQuery(params)}`),
    async () => ({ data: { rule: null, daily: [], month: params.month || "", serviceCode: params.serviceCode || "" } })
  );

export const upsertPricingRuleApi = (payload) => api.post("/api/pricing/rules", payload, { auth: true });
export const upsertDailyPriceApi = (payload) => api.post("/api/pricing/daily", payload, { auth: true });
