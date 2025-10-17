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
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/**
 * 마이페이지 - 내 정보 업데이트 (POST, multipart)
 * - JSON은 key=data (@RequestPart("data"))
 * - 이미지 파일은 key=image (@RequestPart("image"))
 * @param {string} accessToken
 * @param {{name?: string}} payload
 * @param {File|null} imageFile
 */
export function updateMyInfo(accessToken, payload = {}, imageFile = null) {
  const fd = new FormData();
  fd.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  if (imageFile) fd.append('image', imageFile);

  // Content-Type은 undefined로 둬야 axios가 boundary 포함하여 자동 세팅함
  return client.post('/user-service/mypage/update', fd, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': undefined,
    },
  });
}

/** 마이페이지 - 현재 주소 변경 (PATCH) */
export function changeCurrentAddress(accessToken, payload) {
  return client.patch('/user-service/change-currentAddress', payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
