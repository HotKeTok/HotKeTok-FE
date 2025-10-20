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
// response 형태
//  {
//             "roomId": 1,
//             "lastMessageContent": "아직 메시지가 없습니다.",
//             "lastMessageTime": "2025-09-23T02:27:42.644684",
//             "unreadCount": 0,
//             "participants": [
//                 {
//                     "userId": 101,
//                     "userName": "알 수 없는 사용자",
//                     "profileImageUrl": null,
//                     "senderType": VENDOR | OWNER | TENANT
//                     "joinedAt": "2025-09-23T02:27:42.744024",
//                 },
//                 {
//                     "userId": 102,
//                     "userName": "알 수 없는 사용자",
//                     "profileImageUrl": null,
//                    "senderType": VENDOR | OWNER | TENANT
//                     "joinedAt": "2025-09-23T02:27:42.74775",
//                 }
//             ],
//             // 공사업체와의 채팅(함께톡)이라면
//             "address": "동작구 상도로",
//             "estimateStaus": "MATCHING"
//         }
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

// GET/ 채팅방 상세 조회
// response 형태
//  "data": [
//         {
//             "messageId": 2,
//             "roomId": 1,
//             "senderId": 101,
//             "content": "첫 문장 테스트",
//             "createdAt": "2025-09-23T12:26:41.550112"
//         },
//         {
//             "messageId": 3,
//             "roomId": 1,
//             "senderId": 102,
//             "content": "발신 테스트",
//             "createdAt": "2025-09-23T12:27:50.757481"
//         }
//     ],
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
