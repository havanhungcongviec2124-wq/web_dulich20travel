import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCategoriesApi,
  fetchServicesApi,
  fetchServiceBySlugApi,
  fetchLocationsApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
} from "../Api/catalogApi";

export const fetchCategories = createAsyncThunk("catalog/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchCategoriesApi();
    return res?.data || res || [];
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchServices = createAsyncThunk("catalog/fetchServices", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await fetchServicesApi(params);
    return res || { data: [], total: 0 };
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchServiceBySlug = createAsyncThunk("catalog/fetchServiceBySlug", async (slug, { rejectWithValue }) => {
  try {
    const res = await fetchServiceBySlugApi(slug);
    return res?.data || res;
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchLocations = createAsyncThunk("catalog/fetchLocations", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchLocationsApi();
    return res?.data || res || [];
  } catch (err) { return rejectWithValue(err.message); }
});

export const createCategory = createAsyncThunk("catalog/createCategory", async (payload, { rejectWithValue }) => {
  try { const res = await createCategoryApi(payload); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});
export const updateCategory = createAsyncThunk("catalog/updateCategory", async ({ id, data }, { rejectWithValue }) => {
  try { const res = await updateCategoryApi(id, data); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});
export const deleteCategory = createAsyncThunk("catalog/deleteCategory", async (id, { rejectWithValue }) => {
  try { await deleteCategoryApi(id); return id; }
  catch (err) { return rejectWithValue(err.message); }
});

export const createService = createAsyncThunk("catalog/createService", async (payload, { rejectWithValue }) => {
  try { const res = await createServiceApi(payload); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});
export const updateService = createAsyncThunk("catalog/updateService", async ({ id, data }, { rejectWithValue }) => {
  try { const res = await updateServiceApi(id, data); return res?.data || res; }
  catch (err) { return rejectWithValue(err.message); }
});
export const deleteService = createAsyncThunk("catalog/deleteService", async (id, { rejectWithValue }) => {
  try { await deleteServiceApi(id); return id; }
  catch (err) { return rejectWithValue(err.message); }
});

const initialState = {
  categories: [],
  services: [],
  servicesTotal: 0,
  selectedService: null,
  locations: [],
  status: "idle",
  serviceStatus: "idle",
  error: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    clearSelectedService(state) { state.selectedService = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchServices.pending, (state) => { state.status = "loading"; })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        const p = action.payload || {};
        state.services = Array.isArray(p) ? p : (p.data || []);
        state.servicesTotal = p.total ?? state.services.length;
      })
      .addCase(fetchServices.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(fetchServiceBySlug.pending, (state) => { state.serviceStatus = "loading"; state.selectedService = null; })
      .addCase(fetchServiceBySlug.fulfilled, (state, action) => { state.serviceStatus = "succeeded"; state.selectedService = action.payload; })
      .addCase(fetchServiceBySlug.rejected, (state, action) => { state.serviceStatus = "failed"; state.error = action.payload; })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.locations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(createCategory.fulfilled, (state, action) => { if (action.payload) state.categories.push(action.payload); })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const item = action.payload; if (!item) return;
        const idx = state.categories.findIndex((c) => c._id === item._id || c.key === item.key);
        if (idx >= 0) state.categories[idx] = item;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      })
      .addCase(createService.fulfilled, (state, action) => { if (action.payload) state.services.push(action.payload); })
      .addCase(updateService.fulfilled, (state, action) => {
        const item = action.payload; if (!item) return;
        const idx = state.services.findIndex((s) => s._id === item._id || s.slug === item.slug);
        if (idx >= 0) state.services[idx] = item;
        if (state.selectedService && (state.selectedService._id === item._id || state.selectedService.slug === item.slug)) state.selectedService = item;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s._id !== action.payload);
      });
  },
});

export const { clearSelectedService } = catalogSlice.actions;
export default catalogSlice.reducer;
