// src/utils/auth.js
const ACCESS_KEY = 'HK_ACCESS_TOKEN';
const REFRESH_KEY = 'HK_REFRESH_TOKEN';
const USER_KEY = 'HK_USER';
const ROLE_KEY = 'HK_ROLE'; // 'tenant' | 'landlord'

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

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setRole(role) {
  if (role) localStorage.setItem(ROLE_KEY, role);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY) || ''; // 'tenant' | 'landlord'
}

export function clearAuth() {
  clearTokens();
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
}
