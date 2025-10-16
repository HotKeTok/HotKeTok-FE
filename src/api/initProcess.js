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

export async function apiOwnerRegister({ address, detailAddress, count, file }) {
  const form = new FormData();
  form.append('address', address);
  form.append('detailAddress', detailAddress);
  form.append('count', String(count));
  if (file) form.append('file', file);

  const { data } = await api.post('/house-service/register', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
