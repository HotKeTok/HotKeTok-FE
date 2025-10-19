import client from './client';
import { isOk } from './common';

// GET/ 공지사항 목록 조회
export async function getNoticeList(accessToken) {
  const { data } = await client.get('/notice-service/list', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(data),
    data: data?.data ?? [],
    message: data?.message ?? '',
  };
}

// GET/ 공지사항 상세 조회
export async function getNoticeDetail(noticeId, accessToken) {
  const { data } = await client.get(`/notice-service?noticeId=${noticeId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(data),
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}

// POST/ 공지사항 작성
export async function postNotice(accessToken, payload = {}) {
  const res = await client.post('/notice-service', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return {
    success: isOk(res),
  };
}

// PATCH/ 공지사항 수정
// 수정할 값만 포함
export async function updateNotice(accessToken, payload = {}) {
  const res = await client.patch('/notice-service', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return {
    success: isOk(res),
  };
}

// DELETE 공지사항 삭제
export async function deleteNotice(accessToken, noticeId) {
  const res = await client.delete(`/notice-service?noticeId=${noticeId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(res),
  };
}
