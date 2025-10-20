import ChatTemplate from '../../../templates/common/chat/ChatTemplate';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatroomList } from '../../../api/chatting-service';
import { useAuthStore } from '../../../store/useAuthStore';

// 집주인 채팅 메인 페이지
export default function Chat() {
  const navigate = useNavigate();
  const { accessToken, role } = useAuthStore();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!accessToken) return;

      setLoading(true);
      const { success, data } = await getChatroomList(accessToken);

      if (success) {
        // 내가 보낸 메시지인지 확인하기 위해 'isMe' 속성 추가
        const processedData = data.map(room => ({
          ...room,
          participants: room.participants.map(p => ({
            ...p,
            isMe: true, // todo(이후 삭제)
          })),
        }));

        setChatRooms(processedData);
      }
      setLoading(false);
    };

    fetchRooms();
  }, [accessToken]);

  // Template에게 넘겨줄 함수: 클릭 시 해당 채팅방으로 이동
  const handleRoomClick = roomId => {
    navigate(`/tenant/chat/${roomId}`);
  };

  if (loading) return <div>로딩 중...</div>;

  // 데이터 로딩과 정렬이 끝난 후, Template에게 props로 전달하여 렌더링
  return <ChatTemplate chatRooms={chatRooms} onRoomClick={handleRoomClick} />;
}
