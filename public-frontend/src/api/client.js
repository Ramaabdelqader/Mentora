import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// attach token if present
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("mentora_token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});


export default api;
