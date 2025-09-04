import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import authReducer from "./slices/authSlice";
import authUiReducer from "./slices/authUiSlice";
import paperReducer from "./slices/paperSlice";

// Persist config just for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  // whitelist: ["user"], // ✅ only save user object (so subject_id persists)
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    ui: authUiReducer,
    papers: paperReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
