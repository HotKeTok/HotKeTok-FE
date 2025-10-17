// src/api/infra-service.js
import api from './client';

// 도로명 주소 검색
export async function apiSearchRoadAddress({
  keyword,
  currentPage = 0,
  countPerPage = 10,
  resultType = 'json',
}) {
  const qs = new URLSearchParams({ currentPage, countPerPage, resultType, keyword }).toString();
  const { data } = await api.get(`/infra-service/getAddress?${qs}`);

  // 서버 케이스들: { success, data } | { isSuccess, result } | 기타
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
