import axios from "axios";
import getToken from "./token_helper";

export const api = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // just pass it through if OK
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired. Redirecting to login...");
      // Optionally refresh token or redirect
    }
    return Promise.reject(error);
  }
);
