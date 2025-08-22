import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";

const store = configureStore({
  redux: {
    appReducer: appReducer,
  },
});
