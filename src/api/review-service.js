// src/api/review-service.js
import api from './client';
import { getAccessToken } from '../utils/auth';

// POST : 업체 후기 작성 (multipart/form-data)
export async function apiCreateReview(formData) {
  const { data } = await api.post('/review-service', formData, {
    headers: {
      // Authorization은 인터셉터에서 주입된다고 가정
      Accept: 'application/json',
    },
    transformRequest: [d => d], // 그대로 통과
  });

  const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';
  return {
    success,
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}

// GET : 업체별 후기 목록 조회
export async function apiGetVendorReviews({ vendorId }) {
  const token = getAccessToken?.();
  const { data } = await api.get('/review-service', {
    params: { vendorId },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';
  return {
    success,
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}

// DELETE : 후기 삭제
export async function apiDeleteReview({ reviewId }) {
  const { data } = await api.delete('/review-service', {
    params: { reviewId },
    headers: {
      Accept: 'application/json',
      // Authorization은 인터셉터에서 주입된다고 가정
    },
  });

  const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';
  return {
    success,
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}

// GET : 리뷰 작성 가능 여부 조회
export async function apiGetReviewWriteStatus({ vendorId }) {
  const token = getAccessToken?.();
  const { data } = await api.get('/review-service/status', {
    params: { vendorId }, // ← 서버가 vendorId를 받도록 확정
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // ★ isSuccess 를 포함해서 성공 판별
  const success =
    data?.isSuccess === true ||
    data?.success === true ||
    data?.status === 200 ||
    data?.code === 'COMMON200';

  return {
    success,
    data: data?.result ?? data?.data ?? null, // ← result 기준으로 정규화
    message: data?.message ?? '',
  };
}
