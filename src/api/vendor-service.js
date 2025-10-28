// src/api/vendor-service.js
import api from './client';
import { getAccessToken } from '../utils/auth';

// GET : 업체 정보 확인
export async function apiGetVendorProfile({ vendorId }) {
  const { data } = await api.get('/vendor-service/profile', {
    params: { vendorId },
  });

  const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';

  return {
    success,
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}

// GET : 업체 소식 확인
export async function apiGetVendorNews({ vendorId }) {
  const { data } = await api.get('/vendor-service/news', {
    params: { vendorId },
  });

  const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';

  return {
    success,
    data: Array.isArray(data?.data) ? data.data : [],
    message: data?.message ?? '',
  };
}

// GET : 수리 요청 상세 조회
export async function apiFetchVendorRequestDetail(requestId) {
  if (!requestId && requestId !== 0) {
    throw new Error('상세 조회를 위한 requestId가 필요합니다.');
  }
  const token = getAccessToken();

  const { data } = await api.get('/vendor-service/request-detail', {
    headers: { Authorization: `Bearer ${token}` },
    params: { requestId }, // ✅ 쿼리 파라미터
  });

  const success =
    data?.isSuccess === true ||
    data?.success === true ||
    data?.code === 'COMMON200' ||
    data?.status === 200;

  const payload = data?.result ?? data?.data ?? null;

  return {
    success,
    raw: data ?? null,
    result: payload, // { category, address, estimateTime, ... }
    message: data?.message ?? '',
  };
}
