// src/api/initProcess.js
import api from './client';

/** 도로명 주소 검색 */
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

/** 입주민 등록(인증요청) */
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

/** 집주인 등록(파일 업로드 포함) */
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
