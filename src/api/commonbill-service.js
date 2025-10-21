import client from './client';
import { isOk } from './common';

// GET/ 공동관리비 목록 조회
export async function getCommonBills(accessToken, year) {
  const response = await client.get(`commonbill-service/view/year?year=${year}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: response.data.success,
    status: response.status,
    data: response.data?.data ?? null,
    message: response.data?.message ?? '',
  };
}

// GET/ 공동관리비 상세 조회
export async function getCommonBillDetail(accessToken, year, month) {
  const response = await client.get(`/commonbill-service/view?year=${year}&month=${month}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: response.data.success,
    status: response.status,
    data: response.data?.data ?? null,
    message: response.data?.message ?? '',
  };
}

// POST/ 공동관리비 등록
// {
// 	"description": "엘리베이터 공사 수수료",
//   "amount": 30000,
//   "type": "EXPENSE",
//   "date": "2020-10-23"
// }
export async function postCommonBill(accessToken, payload = {}) {
  const { data } = await client.post('/commonbill-service/create', payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(data),
    message: data?.message ?? '',
  };
}
