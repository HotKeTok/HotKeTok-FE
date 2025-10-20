import ChatRoomTemplate from '../../../templates/common/chat/ChatRoomTemplate';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChatroomDetail } from '../../../api/chatting-service';
import { subscribeToChannel, publishMessage } from '../../../api/websocket'; // 웹소켓 함수
import { useAuthStore } from '../../../store/useAuthStore';

const MY_USER_ID = 38; // 더미, 실제 아이디로 교체

const ChatRoom = () => {
  const { id } = useParams();
  const { accessToken, user } = useAuthStore();

  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. 과거 메시지 가져오기
    const fetchHistory = async () => {
      if (!accessToken || !id) return;
      setLoading(true);
      const { success, data } = await getChatroomDetail(accessToken, id);
      if (success) {
        setMessages(data.messages); // 실제 데이터 구조에 맞게 수정 필요
        setParticipants(data.participants.filter(user => user.id !== MY_USER_ID)); // 실제 데이터 구조에 맞게 수정 필요
      }
      setLoading(false);
    };

    fetchHistory();

    // 2. 웹소켓 구독
    const subscription = subscribeToChannel(id, newMessage => {
      // 새 메시지가 도착하면 기존 메시지 목록에 추가
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    // 3. 컴포넌트가 사라질 때 구독 해제 (매우 중요!)
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [accessToken, id]);

  // Template에게 넘겨줄 함수: 메시지 전송 로직
  const handleSendMessage = messageContent => {
    const payload = {
      roomId: parseInt(id, 10),
      senderId: user.id,
      content: messageContent,
    };
    publishMessage('/pub/chat/message', payload);
  };

  if (loading) return <div>메시지를 불러오는 중...</div>;

  return (
    <ChatRoomTemplate
      messages={messages}
      participants={participants}
      onSendMessage={handleSendMessage}
      myUserId={MY_USER_ID}
    />
  );
};

export default ChatRoom;
