// src/api/auth.js
import api from './client';

/**
 * [회원가입]
 * POST /auth-service/signup
 * body: { name, logInId, password, phoneNumber }
 * resp: { success, status, data: { name }, timestamp }
 */
export async function apiSignUp({ name, logInId, password, phoneNumber }) {
  const { data } = await api.post('/auth-service/signup', {
    name,
    logInId,
    password,
    phoneNumber,
  });
  return data;
}

/**
 * [인증번호 요청]
 * POST /auth-service/phone/send
 * body: { phoneNumber }
 * resp: { success, status, data: { phoneNumber }, timestamp }
 */
export async function apiPhoneSend({ phoneNumber }) {
  // 1) 숫자만 남기기
  const digits = String(phoneNumber || '')
    .replace(/\D/g, '')
    .slice(0, 11);

  if (digits.length !== 11) {
    const err = new Error('휴대폰 번호는 11자리여야 해요.');
    err.code = 'INVALID_PHONE';
    throw err;
  }

  // 2) 쿼리스트링으로 요청 보내기 (Body 없음)
  const { data } = await api.post(`/auth-service/phone/send?phone=${digits}`, {});
  return data;
}

/**
 * [인증번호 인증]
 * POST /auth-service/phone/verify
 * body: { phoneNumber, code }
 * resp: { success, status, data: { result }, timestamp }
 */
export async function apiPhoneVerify({ phoneNumber, code }) {
  const { data } = await api.post('/auth-service/phone/verify', {
    phoneNumber,
    code,
  });
  return data;
}

/**
 * [아이디 중복확인]
 * POST /auth-service/id/verify
 * body: { logInId }
 * resp: { success, status, data: { result }, timestamp }
 */
export async function apiIdVerify({ logInId }) {
  const { data } = await api.post('/auth-service/id/verify', { logInId });
  return data;
}
