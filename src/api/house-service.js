// src/api/house-service.js
import api from './client';

// 집주인 집 등록(파일 업로드 포함)
export async function apiLandlordRegister({ address, detailAddress, count, file }) {
  // 1) 서버 DTO에 맞춰 JSON 객체 구성
  const dto = {
    address: address ?? '',
    detailAddress: detailAddress ?? '',
    count: typeof count === 'number' ? count : Number(count || 0),
  };

  // 2) FormData 생성
  const fd = new FormData();

  // ✅ 핵심: 'data'라는 이름의 JSON 파트를 넣어야 함
  //    Blob으로 감싸서 application/json 타입을 명확히 지정
  fd.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

  // 파일 파트(컨트롤러가 @RequestPart("file")로 받는다고 가정)
  if (file) fd.append('file', file);

  // 3) 전역 JSON 기본 헤더를 덮어씌워 axios가 multipart + boundary를 자동 설정하게 함
  const { data } = await api.post('/house-service/register', fd, {
    headers: { 'Content-Type': undefined },
  });

  const success =
    data?.success === true ||
    data?.isSuccess === true ||
    data?.status === 200 ||
    data?.code === 'COMMON200';

  return {
    success,
    data: data?.data ?? data?.result ?? null,
  };
}

// 공통 성공 판별
function isOk(d) {
  return d?.success === true || d?.status === 200 || d?.code === 'COMMON200';
}

// 입주민 요청 리스트(집주인)
export async function getTenantRequestList() {
  const { data } = await api.get('/house-service/tenant-requestList');
  return {
    success: isOk(data),
    data: data?.data ?? [],
    message: data?.message ?? '',
  };
}

// 입주민 집 등록(인증 요청)
export async function apiTenantRequest(body) {
  const { data } = await api.post('/house-service/tenant-request', body);
  const success =
    data?.success === true ||
    data?.isSuccess === true ||
    data?.status === 200 ||
    data?.code === 'COMMON200';

  return {
    success,
    data: data?.data ?? data?.result ?? null,
    message: data?.message ?? '',
  };
}

// 입주민 승인(집주인 화면)
export async function approveTenant(houseId, body = {}) {
  const { data } = await api.post(`/house-service/tenant-approve/${houseId}`, body);
  return { success: isOk(data), data: data?.data ?? null, message: data?.message ?? '' };
}

// 입주민 거절(집주인 화면)
export async function rejectTenant(houseId, body = {}) {
  const { data } = await api.post(`/house-service/tenant-reject/${houseId}`, body);
  return { success: isOk(data), data: data?.data ?? null, message: data?.message ?? '' };
}

// GET 주소 리스트 조회
export async function getAddressList() {
  const { data } = await api.get('/house-service/house-list');
  return {
    success: data.success,
    status: data.status,
    data: data?.data ?? [],
  };
}

// GET 입주민 상세 조회
export async function getTenantDetail(houseNumber) {
  const { data } = await api.get(`/house-service/tenant-info?number=${houseNumber}`);
  return {
    success: isOk(data),
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}

// PATCH 입주민 정보 수정
export async function patchTenantInfo(payload = {}) {
  const { data } = await api.patch('house-service/tenant-info/change', payload);
  console.log(data);
  return {
    success: isOk(data),
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}

/**
 * 내 주소 리스트 조회
 * - GET /house-service/house-list
 * - 토큰 사용 O
 * - 응답의 state === 'NONE' 인 항목은 프론트에서 제외
 */
export async function apiGetHouseList(accessToken) {
  const { data } = await api.get('/house-service/house-list', {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });

  const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';

  // data 또는 result 어느 쪽이든 배열로 수용
  const raw = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.result)
    ? data.result
    : [];

  // NONE 제외 + 안전 정렬(대표주소 먼저)
  const items = raw
    .filter(h => (h?.state || '') !== 'NONE')
    .sort((a, b) => (b?.isCurrent === true) - (a?.isCurrent === true));

  return {
    success,
    data: items,
    message: data?.message ?? '',
  };
}
