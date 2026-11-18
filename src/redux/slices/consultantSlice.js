import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchConsultantsApi,
  createConsultantApi,
  updateConsultantApi,
  deleteConsultantApi,
} from "../Api/consultantApi";

export const fetchConsultants = createAsyncThunk("consultants/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await fetchConsultantsApi(params);
    return res?.data || res || [];
  } catch (err) { return rejectWithValue(err.message); }
});

export const createConsultant = createAsyncThunk("consultants/create", async (payload, { rejectWithValue }) => {
  try { const res = await createConsultantApi(payload); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});
export const updateConsultant = createAsyncThunk("consultants/update", async ({ id, data }, { rejectWithValue }) => {
  try { const res = await updateConsultantApi(id, data); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});
export const deleteConsultant = createAsyncThunk("consultants/delete", async (id, { rejectWithValue }) => {
  try { await deleteConsultantApi(id); return id; }
  catch (err) { return rejectWithValue(err.message); }
});

const slice = createSlice({
  name: "consultants",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsultants.pending, (s) => { s.status = "loading"; })
      .addCase(fetchConsultants.fulfilled, (s, a) => { s.status = "succeeded"; s.items = Array.isArray(a.payload) ? a.payload : []; })
      .addCase(fetchConsultants.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })
      .addCase(createConsultant.fulfilled, (s, a) => { if (a.payload) s.items.push(a.payload); })
      .addCase(updateConsultant.fulfilled, (s, a) => {
        const i = s.items.findIndex((x) => x._id === a.payload?._id || x.key === a.payload?.key);
        if (i >= 0) s.items[i] = a.payload;
      })
      .addCase(deleteConsultant.fulfilled, (s, a) => { s.items = s.items.filter((x) => x._id !== a.payload); });
  },
});

export default slice.reducer;
