import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAdminStatsApi, fetchActivityLogsApi, createActivityLogApi } from "../Api/adminApi";

export const fetchAdminStats = createAsyncThunk("admin/fetchStats", async (_, { rejectWithValue }) => {
  try { const res = await fetchAdminStatsApi(); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});

export const fetchActivityLogs = createAsyncThunk("admin/fetchLogs", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await fetchActivityLogsApi(params);
    return res || { data: [], total: 0 };
  } catch (err) { return rejectWithValue(err.message); }
});

export const createActivityLog = createAsyncThunk("admin/createLog", async (payload, { rejectWithValue }) => {
  try { const res = await createActivityLogApi(payload); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});

const slice = createSlice({
  name: "admin",
  initialState: { stats: null, logs: [], logsTotal: 0, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.fulfilled, (s, a) => { s.stats = a.payload; })
      .addCase(fetchActivityLogs.pending, (s) => { s.status = "loading"; })
      .addCase(fetchActivityLogs.fulfilled, (s, a) => { s.status = "succeeded"; const p = a.payload||{}; s.logs = Array.isArray(p) ? p : (p.data||[]); s.logsTotal = p.total ?? s.logs.length; })
      .addCase(fetchActivityLogs.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })
      .addCase(createActivityLog.fulfilled, (s, a) => { if (a.payload) s.logs.unshift(a.payload); });
  },
});

export default slice.reducer;
