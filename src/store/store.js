import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import authUiReducer from "./slices/authUiSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    ui: authUiReducer,
  },
});

export default store;
