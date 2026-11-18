import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPricingRulesApi,
  fetchDailyPricesApi,
  fetchCalendarApi,
  upsertPricingRuleApi,
  upsertDailyPriceApi,
} from "../Api/pricingApi";

export const fetchPricingRules = createAsyncThunk("pricing/fetchRules", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await fetchPricingRulesApi(params);
    return res?.data || res || [];
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchDailyPrices = createAsyncThunk("pricing/fetchDaily", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await fetchDailyPricesApi(params);
    return res?.data || res || [];
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchCalendar = createAsyncThunk("pricing/fetchCalendar", async (params, { rejectWithValue }) => {
  try {
    const res = await fetchCalendarApi(params || {});
    return { key: `${params?.serviceCode||""}|${params?.packageId||"default"}|${params?.month||""}`, data: res?.data || res };
  } catch (err) { return rejectWithValue(err.message); }
});

export const upsertPricingRule = createAsyncThunk("pricing/upsertRule", async (payload, { rejectWithValue }) => {
  try { const res = await upsertPricingRuleApi(payload); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});
export const upsertDailyPrice = createAsyncThunk("pricing/upsertDaily", async (payload, { rejectWithValue }) => {
  try { const res = await upsertDailyPriceApi(payload); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});

const slice = createSlice({
  name: "pricing",
  initialState: { rules: [], daily: [], calendars: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricingRules.fulfilled, (s, a) => { s.rules = Array.isArray(a.payload) ? a.payload : []; })
      .addCase(fetchDailyPrices.fulfilled, (s, a) => { s.daily = Array.isArray(a.payload) ? a.payload : []; })
      .addCase(fetchCalendar.fulfilled, (s, a) => { if (a.payload) s.calendars[a.payload.key] = a.payload.data; })
      .addCase(upsertPricingRule.fulfilled, (s, a) => {
        const item = a.payload; if (!item) return;
        const i = s.rules.findIndex((r) => (r._id && r._id === item._id) || (r.serviceCode === item.serviceCode && (r.packageId||"default") === (item.packageId||"default")));
        if (i >= 0) s.rules[i] = item; else s.rules.push(item);
      })
      .addCase(upsertDailyPrice.fulfilled, (s, a) => {
        const items = Array.isArray(a.payload) ? a.payload : (a.payload?.data || a.payload ? [a.payload] : []);
        if (Array.isArray(items) && items.length) {
          items.forEach((item) => {
            if (!item || !item.date) return;
            const i = s.daily.findIndex((d) => d.serviceCode === item.serviceCode && (d.packageId||"default") === (item.packageId||"default") && d.date === item.date);
            if (i >= 0) s.daily[i] = item; else s.daily.push(item);
          });
        }
      });
  },
});

export default slice.reducer;
