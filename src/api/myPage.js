// src/api/myPage.js
import client from './client';

/** 마이페이지 - 내 정보 조회 */
export function fetchMyInfo(accessToken) {
  return client.get('/user-service/mypage/info', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/** 마이페이지 - 현재 주소/세대번호 조회 (POST) */
export function fetchCurrentAddress(accessToken, body = {}) {
  return client.post('/user-service/current-address-and-number', body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8', // ✅ 추가
    },
  });
}

/** 마이페이지 - 내 정보 업데이트 (POST) */
export function updateMyInfo(accessToken, payload) {
  // payload: { name: '홍길동' }
  return client.post('/user-service/mypage/update', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8', // ✅ 추가
    },
  });
}

/** 마이페이지 - 현재 주소 변경 (PATCH) */
export function changeCurrentAddress(accessToken, payload) {
  return client.patch('/user-service/change-currentAddress', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8', // ✅ 추가
    },
  });
}
