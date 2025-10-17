// src/utils/auth.js
const ACCESS_KEY = 'HK_ACCESS_TOKEN';
const REFRESH_KEY = 'HK_REFRESH_TOKEN';
const ROLE_KEY = 'HK_ROLE';

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) || '';
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || '';
}

export function setRole(role) {
  localStorage.setItem(ROLE_KEY, role);
}
export function clearAuth() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function parseJwt(token) {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

/** 액세스 토큰 만료 임박(기본 30s)이면 true */
export function isAccessTokenExpiringSoon(token, skewSec = 30) {
  const p = parseJwt(token);
  if (!p?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return p.exp - now <= skewSec;
}
