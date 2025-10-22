// src/api/review-service.js
import api from './client';
import { getAccessToken } from '../utils/auth';

// 후기 목록 조회
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

// 후기 작성 (multipart/form-data)
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

// ✅ 후기 삭제 (DELETE /review-service?reviewId=123)
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
