import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./services/ms_auth_config.js";
import { PersistGate } from "redux-persist/integration/react";

const msalIntance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <MsalProvider instance={msalIntance}>
        <Provider store={store}>
          <PersistGate loading={<div> Loading... </div>} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </MsalProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
