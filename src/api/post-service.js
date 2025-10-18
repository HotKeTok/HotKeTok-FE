import client from './client';
import { isOk } from './common';

// GET/ 받은 쪽지 목록 조회
export async function getReceivedMessages(accessToken) {
  const { data } = await client.get('/post-service/receive-list', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(data),
    data: data?.data ?? [],
    message: data?.message ?? '',
  };
}

// GET/ 보낸 쪽지 목록 조회
export async function getSentMessages(accessToken) {
  const { data } = await client.get('/post-service/send-list', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(data),
    data: data?.data ?? [],
    message: data?.message ?? '',
  };
}

// GET/ 쪽지 내용 상세 조회
export async function getMessageDetail(postId, accessToken) {
  const { data } = await client.get(`/post-service/detail?postId=${postId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(data),
    data: data?.data ?? [],
    message: data?.message ?? '',
  };
}

// GET/ 이웃 목록 조회
export async function getTenantList(accessToken) {
  const { data } = await client.get('/post-service/tenant-list', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(data),
    data: data?.data ?? [],
    message: data?.message ?? '',
  };
}

// POST/ 쪽지 쓰기
export async function postMessage(accessToken, payload = {}) {
  const res = await client.post('/post-service/write', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return {
    success: isOk(res),
  };
}

// DELETE 쪽지 신고하기
export async function reportMessage(accessToken, postId) {
  const res = await client.delete(`/post-service/delete?postId=${postId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(res),
  };
}
