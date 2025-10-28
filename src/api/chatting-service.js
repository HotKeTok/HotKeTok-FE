import api from './client';
import { isOk } from './common';

// POST/ 채팅방 생성
// payload 형태
// 	"participantUserIds": [101, 102],
// 	"roomType": "VENDOR_ESTIMATE" | "GENERAL"
// 	"requestFormId": 13 (optional, VENDOR_ESTIMATE일 경우 필수: 요청서 id)
export async function postNewChatroom(accessToken, payload = {}) {
  const res = await api.post('/chatting-service/rooms', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return {
    success: isOk(res),
  };
}

// GET/ 채팅방 목록 조회
export async function getChatroomList(accessToken) {
  const { data } = await api.get('/chatting-service/users/rooms', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(data),
    data: data.data ?? [],
    message: data?.message ?? '',
  };
}

// DELETE/ 채팅방 나가기
export async function deleteChatroom(accessToken, roomId) {
  const { status } = await api.delete(`/chatting-service/rooms?roomId=${roomId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: status === 204,
  };
}

export async function getChatroomDetail(accessToken, roomId) {
  const { data } = await api.get(`/chatting-service/rooms/messages?roomId=${roomId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    success: isOk(data),
    data: data?.data ?? {},
    message: data?.message ?? '',
  };
}
