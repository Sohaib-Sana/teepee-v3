import axios from "axios";

export const api = axios.create({baseURL: import.meta.env.VITE_BASE_URL});

api.interceptors.request(
    (config)=>{
        const token = localStorage.getItem('access_token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
     return config; 
    },(error) => {
    return Promise.reject(error);
  });

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