// src/api/adminAuth.js
import api from './client';

// 공통 성공 판별
function isOk(d) {
  return d?.success === true || d?.status === 200 || d?.code === 'COMMON200';
}

/** 입주민 요청 리스트 */
export async function getTenantRequestList() {
  const { data } = await api.get('/house-service/tenant-requestList');
  return {
    success: isOk(data),
    data: data?.data ?? [],
    message: data?.message ?? '',
  };
}

/** 입주민 승인 */
export async function approveTenant(houseId, body = {}) {
  // 명세서 오타 가능성: 승인 엔드포인트가 reject로 적혀있음.
  // 일반적으로 approve는 '/tenant-approve/{houseId}'일 확률이 높아 먼저 시도,
  // 404이면 '/tenant-reject' 등 서버 실제 경로에 맞춰 교체해도 됨.
  try {
    const { data } = await api.post(`/house-service/tenant-approve/${houseId}`, body);
    return { success: isOk(data), data: data?.data ?? null, message: data?.message ?? '' };
  } catch (e) {
    // 혹시 서버가 정말 reject 경로를 쓰고 있다면 ↓ 주석 풀고 임시 fallback
    // const { data } = await api.post(`/house-service/tenant-reject/${houseId}`, body);
    // return { success: isOk(data), data: data?.data ?? null, message: data?.message ?? '' };
    throw e;
  }
}

/** 입주민 거절 */
export async function rejectTenant(houseId, body = {}) {
  const { data } = await api.post(`/house-service/tenant-reject/${houseId}`, body);
  return { success: isOk(data), data: data?.data ?? null, message: data?.message ?? '' };
}
