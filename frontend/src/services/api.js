import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const STORAGE_KEY = "sms_auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore bad storage data and continue without auth header.
    }
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration (401)
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    }

    // Handle forbidden access (403)
    if (error.response?.status === 403) {
      toast.error("You don't have permission to access this resource.");
    }

    // Handle network errors
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  },
);

export default api;
