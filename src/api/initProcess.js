// src/api/initProcess.js
import api from './client';

// 도로명 주소 검색
export async function apiSearchRoadAddress({
  keyword,
  currentPage = 0,
  countPerPage = 5,
  resultType = 'json',
}) {
  const { data } = await api.get('/infra-service/getAddress', {
    params: { currentPage, countPerPage, resultType, keyword },
  });
  return data;
}

// 입주민 초기정보등록
export async function apiTenantRequest(payload) {
  const { data } = await api.post('/house-service/tenant-request', payload);
  return data;
}

//집주인 초기정보등록(등기부등본 업로드 포함)

export async function apiLandlordRegister({ address, detailAddress, count, file }) {
  const form = new FormData();

  // JSON 부분을 Blob으로 감싸기
  const payload = { address, detailAddress, count: String(count) };
  form.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

  // 파일 추가
  if (file) form.append('file', file);

  // 전송
  await api.post('/house-service/register', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
