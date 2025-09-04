import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// แนบ Token อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ได้มาจากหน้า login ที่เราทำไว้แล้ว
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
