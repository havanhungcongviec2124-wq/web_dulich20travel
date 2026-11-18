import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, fetchMeApi, changePasswordApi } from "../Api/authApi";
import { setToken, clearToken, getToken } from "../Api/http";

export const loginAdmin = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await loginApi(payload);
    if (res?.token) setToken(res.token);
    return res;
  } catch (err) {
    return rejectWithValue(err.message || "Đăng nhập thất bại");
  }
});

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchMeApi();
    return res;
  } catch (err) {
    return rejectWithValue(err.message || "Không thể xác thực");
  }
});

export const changePassword = createAsyncThunk("auth/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const res = await changePasswordApi(payload);
    return res;
  } catch (err) {
    return rejectWithValue(err.message || "Không thể đổi mật khẩu");
  }
});

const initialState = {
  user: null,
  token: getToken(),
  status: "idle",
  error: null,
  initialized: !getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = "";
      state.status = "idle";
      state.error = null;
      state.initialized = true;
      clearToken();
      localStorage.removeItem("20travel_admin_remember");
      localStorage.removeItem("20travel_admin_email");
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || getToken();
        state.error = null;
        state.initialized = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.initialized = true;
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload?.user || action.payload?.data || null;
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        clearToken();
        state.status = "idle";
        state.user = null;
        state.token = "";
        state.error = null;
        state.initialized = true;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
