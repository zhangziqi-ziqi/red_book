import axios from "axios";
import { ElMessage } from 'element-plus'

const chatAPI = axios.create({
    baseURL: 'http://localhost:8080'
  })
  
  // 请求拦截器：在每次请求前自动添加 Token
  chatAPI.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers["Content-Type"] = 'application/json;charset=UTF-8';
        config.headers.Authorization = `Bearer ${token}`;
        // ElMessage.info('请求拦截器：添加了 ' + token);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
export default chatAPI;