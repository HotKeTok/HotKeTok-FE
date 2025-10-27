// src/api/user-service.js
import client from './client';
import api from './client';

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

/**
 * 현재 설정된 주소/호수 변경
 * @param {string} accessToken
 * @param {{ currentAddress: string, currentNumber: string }} body
 * @returns {{success:boolean, status:number, data:any, message:string, code?:string}}
 */
export async function apiChangeCurrentAddress(accessToken, { currentAddress, currentNumber }) {
  try {
    const res = await api.put(
      '/user-service/change/current-address-and-number',
      { currentAddress, currentNumber },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        // ✅ 이 요청은 공통 성공 토스트 끄기
        meta: { silentSuccessToast: true },
      }
    );

    const data = res?.data ?? {};
    // ✅ 어떤 2xx든 성공으로 간주 + 서버 포맷도 함께 체크
    const status = Number(res?.status) || 0;
    const isHttp2xx = status >= 200 && status < 300;
    const success =
      isHttp2xx ||
      data?.isSuccess === true ||
      data?.code === 'COMMON200' ||
      String(data?.code || '').includes('200');

    return {
      success,
      status: status || 200,
      data: data?.result ?? data?.data ?? null,
      message: data?.message ?? '',
      code: data?.code ?? 'COMMON200',
    };
  } catch (err) {
    const r = err?.response;
    const payload = r?.data ?? {};
    const status = r?.status ?? payload?.status ?? 500;
    const code = payload?.code || payload?.data?.errorClassName || 'REQUEST_FAILED';
    const message = payload?.message || err?.message || '현재 주소 변경 중 오류가 발생했습니다.';
    return { success: false, status, code, message, data: payload?.result ?? null };
  }
}
