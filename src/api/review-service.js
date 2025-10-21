// src/api/review-service.js
import api from './client';

// 후기 목록 조회
export async function apiGetVendorReviews({ vendorId }) {
  const { data } = await api.get('/review-service', { params: { vendorId } });
  const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';
  return {
    success,
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}

// 후기 작성
export async function apiCreateReview(formData) {
  const { data } = await api.post('/review-service', formData, {
    headers: {
      // Authorization은 인터셉터에서 주입된다고 가정
      // Authorization: `Bearer ${token}`,
      // ★ 절대 Content-Type 설정하지 마세요 (boundary 깨짐)
      Accept: 'application/json',
    },
    // FormData 원본 그대로 전송
    transformRequest: [d => d],
  });

  const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';

  return {
    success,
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}
