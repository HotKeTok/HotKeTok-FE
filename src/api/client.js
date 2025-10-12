// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: http://...:8000/api
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client': 'hotketok-web',
  },
});

api.interceptors.response.use(
  res => res,
  err => {
    // 에러 메시지 일원화
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      '네트워크 오류가 발생했어요.';
    return Promise.reject({ ...err, message: msg });
  }
);

export default api;
