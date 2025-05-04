import axios from "axios";

const api = axios.create({
    baseURL: 'https://localhost:4523/api',
  });
  
  // 请求拦截器：在每次请求前自动添加 Token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
export default api;