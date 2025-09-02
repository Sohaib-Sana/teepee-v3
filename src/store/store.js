import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import authUiReducer from "./slices/authUiSlice";
import paperReducer from "./slices/paperSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: authUiReducer,
    papers: paperReducer,
  },
});

export default store;
