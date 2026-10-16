import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("quiz_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getApiError(error, fallback = "Something went wrong. Please try again.") {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === "ERR_NETWORK") return "Cannot connect to the server. Check that the backend is running.";
  return fallback;
}

export default api;
