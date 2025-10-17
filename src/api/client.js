// src/api/client.js
import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearAuth,
  isAccessTokenExpiringSoon,
} from '../utils/auth';
import { apiRefreshToken } from './auth-service';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

/** 동시 401 처리용 큐 */
let isRefreshing = false;
let pendingQueue = []; // [{ resolve, reject, config }]

// ✅ 토큰 주입/리프레시를 건너뛸 엔드포인트(로그인/회원가입/토큰갱신 등)
const AUTH_WHITELIST = [
  '/auth-service/login',
  '/auth-service/signup',
  '/auth-service/refresh', // 실제 갱신 경로에 맞춰 수정
];

function processQueue(error, newAccessToken) {
  pendingQueue.forEach(p => {
    if (error) p.reject(error);
    else {
      p.config.headers = p.config.headers || {};
      p.config.headers.Authorization = `Bearer ${newAccessToken}`;
      api.request(p.config).then(p.resolve).catch(p.reject);
    }
  });
  pendingQueue = [];
}

/** 요청 인터셉터: 토큰 첨부 + 만료 임박 시 선제 갱신(옵션) */
api.interceptors.request.use(async config => {
  // 1) 경로 추출을 항상 안전하게 (baseURL 고려)
  const base = api.defaults.baseURL || '';
  // config.url 이 절대경로든 상대경로든 모두 pathname만 뽑아냄
  let pathname = '';
  try {
    pathname = new URL(config.url, base).pathname; // 예: '/infra-service/getAddress'
  } catch {
    pathname = (config.url || '').split('?')[0] || '';
  }
  // 2) 화이트리스트(로그인/회원가입/리프레시)만 토큰 주입/선제 리프레시 스킵
  const isAuthFree = AUTH_WHITELIST.some(p => pathname.startsWith(p));
  if (isAuthFree) {
    if (config.headers?.Authorization) delete config.headers.Authorization;
    return config;
  }
  const at = getAccessToken();
  if (at) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${at}`;
  }

  // 선제 갱신
  if (at && isAccessTokenExpiringSoon(at) && getRefreshToken() && !isRefreshing) {
    try {
      isRefreshing = true;
      const res = await apiRefreshToken();
      if (res?.success) {
        const newAT = res?.data?.accessToken;
        const newRT = res?.data?.refreshToken;
        setTokens({ accessToken: newAT, refreshToken: newRT });
        config.headers.Authorization = `Bearer ${newAT}`;
      } else {
        throw new Error('Refresh failed');
      }
    } catch (e) {
      clearAuth();
      if (window.location.pathname !== '/sign-in') window.location.replace('/sign-in');
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }

  return config;
});

/** 응답 인터셉터: 401 시 리프레시 후 원요청 재시도 */
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    const status = error?.response?.status;

    const urlPath = (original?.url || '').replace(api.defaults.baseURL, '');
    const isAuthFree = AUTH_WHITELIST.some(p => urlPath.startsWith(p));

    // 401 + 재시도 전이면
    if (status === 401 && !isAuthFree && !original?._retry && getRefreshToken()) {
      // 이미 다른 요청이 갱신 중이면 큐에 적재
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject, config: original });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const res = await apiRefreshToken();
        if (!res?.success) throw new Error('Refresh failed');

        const newAT = res?.data?.accessToken;
        const newRT = res?.data?.refreshToken;
        if (!newAT) throw new Error('No access token from refresh');

        setTokens({ accessToken: newAT, refreshToken: newRT });
        processQueue(null, newAT);
        isRefreshing = false;

        // 원 요청 재시도
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAT}`;
        return api.request(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        // 404 USER_NOT_FOUND 같은 경우 포함: 로그아웃
        clearAuth();
        if (window.location.pathname !== '/sign-in') window.location.replace('/sign-in');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
