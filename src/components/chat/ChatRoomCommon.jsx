import ChatRoomTemplate from '../../templates/common/chat/ChatRoomTemplate';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore'; // 💡 [추가]

const ChatRoomCommon = () => {
  const { id } = useParams();
  const roomId = parseInt(id, 10);
  const { accessToken, userId } = useAuthStore();

  const enterChatRoom = useChatStore(state => state.enterChatRoom);
  const leaveChatRoom = useChatStore(state => state.leaveChatRoom);
  const sendMessage = useChatStore(state => state.sendMessage);
  const isConnected = useChatStore(state => state.isConnected);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !roomId || !isConnected || !userId) {
      return;
    }

    const setupRoom = async () => {
      setLoading(true);
      await enterChatRoom(roomId);

      setLoading(false);
    };

    setupRoom();

    return () => {
      leaveChatRoom();
    };
  }, [accessToken, roomId, userId, isConnected, enterChatRoom, leaveChatRoom]);

  const handleSendMessage = messageContent => {
    if (!messageContent.trim()) return;
    sendMessage(roomId, userId, messageContent);
  };

  if (loading || !isConnected) {
    return (
      <div style={{ padding: '20px' }}>
        {isConnected ? '메시지를 불러오는 중...' : '채팅 서버에 연결 중...'}
      </div>
    );
  }

  return <ChatRoomTemplate onSendMessage={handleSendMessage} />;
};

export default ChatRoomCommon;
