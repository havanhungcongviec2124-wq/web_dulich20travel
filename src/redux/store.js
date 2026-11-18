import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import catalogReducer from "./slices/catalogSlice";
import consultantReducer from "./slices/consultantSlice";
import contentReducer from "./slices/contentSlice";
import pricingReducer from "./slices/pricingSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    consultants: consultantReducer,
    content: contentReducer,
    pricing: pricingReducer,
    admin: adminReducer,
  },
});

export default store;
