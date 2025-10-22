// src/api/vendor-service.js
import api from './client';

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
