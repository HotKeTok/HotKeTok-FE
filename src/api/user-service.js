// src/api/user-service.js
import client from './client';

// 마이페이지 사용자 정보 조회
export function fetchMyInfo(accessToken) {
  return client.get('/user-service/mypage/info', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// 마이 페이지 사용자 정보 편집
export function updateMyInfo(accessToken, payload = {}, imageFile = null) {
  const fd = new FormData();
  fd.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  if (imageFile) fd.append('image', imageFile);

  return client.post('/user-service/mypage/update', fd, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': undefined, // axios가 boundary 자동 설정
    },
  });
}

// 사용자 현재 주소 조회
export function fetchCurrentAddress(accessToken) {
  return client.get('/user-service/get/current-address-and-number', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// 사용자 현재 주소 조회
export function changeCurrentAddress(accessToken, payload) {
  return client.put('/user-service/change/current-address-and-number', payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
