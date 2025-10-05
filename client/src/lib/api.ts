import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE });
console.log("API base", import.meta.env.VITE_API_BASE);

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth");
  if (raw) {
    const { accessToken } = JSON.parse(raw);
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
