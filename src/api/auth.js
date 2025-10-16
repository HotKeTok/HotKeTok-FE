// src/api/auth.js
import api from './client';
import { getRefreshToken } from '../utils/auth';

// 로그인
export async function apiLogin({ logInId, password, role }) {
  const { data } = await api.post('/auth-service/login', {
    logInId,
    password,
    role, // 'OWNER' | 'TENANT'
  });
  return data;
}

// 리프레시 토큰으로 토큰 재발급
export async function apiRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const { data } = await api.post('/auth-service/refresh', { refreshToken });
  // data: { success, status, data: { accessToken, refreshToken } }
  return data;
}

// 회원가입
export async function apiSignUp({ name, logInId, password, phoneNumber }) {
  const { data } = await api.post('/auth-service/signup', {
    name,
    logInId,
    password,
    phoneNumber,
  });
  return data;
}

// 인증번호 요청
export async function apiPhoneSend({ phoneNumber }) {
  // 숫자만 남기기
  const digits = String(phoneNumber || '')
    .replace(/\D/g, '')
    .slice(0, 11);

  if (digits.length !== 11) {
    const err = new Error('휴대폰 번호는 11자리여야 해요.');
    err.code = 'INVALID_PHONE';
    throw err;
  }

  // 쿼리스트링으로 요청 보내기 (Body 없음)
  const { data } = await api.post(`/auth-service/phone/send?phone=${digits}`, {});
  return data;
}

// 인증번호 인증
export async function apiPhoneVerify({ phoneNumber, code }) {
  const digits = String(phoneNumber || '')
    .replace(/\D/g, '')
    .slice(0, 11);
  const codeStr = String(code || '').replace(/\D/g, '');
  if (digits.length !== 11 || codeStr.length === 0) {
    throw new Error('휴대폰 번호 또는 인증번호가 올바르지 않아요.');
  }
  const { data } = await api.post(`/auth-service/phone/verify?phone=${digits}&code=${codeStr}`, {});
  return data;
}

// 아이디 중복확인
export async function apiIdVerify({ logInId }) {
  const id = String(logInId || '').trim();
  if (!id) {
    throw new Error('아이디를 입력해주세요.');
  }
  const { data } = await api.post(`/auth-service/id/verify?logInId=${id}`, {});
  return data;
}
