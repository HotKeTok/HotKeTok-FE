// src/api/myPage.js
import client from './client';

/** 마이페이지 - 내 정보 조회 */
export function fetchMyInfo(accessToken) {
  return client.get('/user-service/mypage/info', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/** ✅ 마이페이지 - 현재 주소/세대번호 조회 (GET) */
export function fetchCurrentAddress(accessToken) {
  return client.get('/user-service/current-address-and-number', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/**
 * 마이페이지 - 내 정보 업데이트 (POST, multipart)
 * - JSON은 key=data (@RequestPart("data"))
 * - 이미지 파일은 key=image (@RequestPart("image"))
 */
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

/** 마이페이지 - 현재 주소 변경 (PATCH) */
export function changeCurrentAddress(accessToken, payload) {
  return client.patch('/user-service/change-currentAddress', payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
