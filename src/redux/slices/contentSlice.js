import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchContentApi, updateContentApi } from "../Api/contentApi";

export const fetchContent = createAsyncThunk("content/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchContentApi();
    return res?.data || res || {};
  } catch (err) { return rejectWithValue(err.message); }
});

export const updateContent = createAsyncThunk("content/update", async (payload, { rejectWithValue }) => {
  try {
    const res = await updateContentApi(payload);
    return res?.data || res;
  } catch (err) { return rejectWithValue(err.message); }
});

const slice = createSlice({
  name: "content",
  initialState: { data: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (s) => { s.status = "loading"; })
      .addCase(fetchContent.fulfilled, (s, a) => { s.status = "succeeded"; s.data = a.payload; })
      .addCase(fetchContent.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })
      .addCase(updateContent.fulfilled, (s, a) => { s.data = a.payload || s.data; });
  },
});

export default slice.reducer;
