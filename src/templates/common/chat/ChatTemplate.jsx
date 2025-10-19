import { useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import ButtonRound from '../../../components/common/ButtonRound';
import TopBar from '../../../components/common/TopBar';
import { Page, ScrollableContent } from '../../../styles/layout';
import { useNavigate } from 'react-router-dom';
import { DUMMY_CHAT_LIST } from '../../../constants/chat';
import { formatTodayTimeOrIsoTime } from '../../../utils/dateFormat';
import SwipeableChatItem from '../../../components/chat/SwipableChatItem';
import { Column, Row } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';

export default function ChatTemplate({ chatRooms }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('direct');
  // API로부터 받은 원본 데이터라고 가정합니다.
  const [rawChats, setRawChats] = useState([]);

  // 🚨 데이터 가공 로직
  // 원본 데이터가 변경될 때만 재계산하도록 useMemo를 사용합니다.
  const processedChats = useMemo(() => {
    // 현재 사용자를 입주민(userId: 101)으로 가정합니다.
    const myUserId = 101;

    const directTalk = [];
    const groupTalk = [];

    DUMMY_CHAT_LIST.forEach(chat => {
      // UI 렌더링에 필요한 형태로 데이터를 가공합니다.
      const transformedChat = {
        id: chat.roomId, // key로 사용할 id
        lastMessage: chat.lastMessageContent,
        timestamp: chat.lastMessageTime,
        unreadCount: chat.unreadCount,
        // 원본 데이터도 참조할 수 있도록 포함
        original: chat,
      };

      if (chat.participants.length > 2) {
        // 단체톡 (함께톡) 처리
        transformedChat.name = chat.address || '단체 채팅';
        transformedChat.isGroup = true;
        // 단체톡의 경우 참여자 이름 목록을 부가 정보로 저장
        transformedChat.participantNames = chat.participants
          .filter(p => p.userId !== myUserId)
          .map(p => p.userName)
          .join(', ');
        groupTalk.push(transformedChat);
      } else {
        // 개인톡 (바로톡) 처리
        const otherParticipant = chat.participants.find(p => p.userId !== myUserId);
        transformedChat.name = otherParticipant?.userName || '알 수 없는 사용자';
        transformedChat.avatar = otherParticipant?.profileImageUrl;
        transformedChat.isGroup = false;
        // 업체(VENDOR) 여부를 확인하여 태그를 표시하기 위한 속성
        transformedChat.isVendor = otherParticipant?.senderType === 'VENDOR';
        directTalk.push(transformedChat);
      }
    });

    return { directTalk, groupTalk };
  }, [rawChats]);

  const handleDelete = id => {
    alert(`채팅방 ID ${id} 삭제`);
    // 실제로는 여기서 API 호출 후 rawChats 상태를 업데이트해야 합니다.
    setRawChats(prevChats => prevChats.filter(chat => chat.roomId !== id));
  };

  const chatsToShow = activeTab === 'direct' ? processedChats.directTalk : processedChats.groupTalk;
  return (
    <Page style={{ backgroundColor: '#f5f6f6' }}>
      <TopBar title="채팅" />
      <ToggleContainer>
        <ButtonRound
          filled={activeTab === 'direct'}
          text="바로톡"
          onClick={() => setActiveTab('direct')}
          height={38}
        />
        <ButtonRound
          filled={activeTab === 'group'}
          text="함께톡"
          onClick={() => setActiveTab('group')}
          height={38}
        />
      </ToggleContainer>
      <ScrollableContainerWithGap style={{ padding: '0 24px' }}>
        {chatsToShow.map(chat => (
          <SwipeableChatItem key={chat.id} onDelete={() => handleDelete(chat.roomId)}>
            <ChatItem onClick={() => navigate(`/chat/chat-room/${chat.roomId}`)}>
              {/* TODO: 단체톡은 시공업체 아이콘, 개인톡은 상대방 프로필 이미지 표시 */}
              <Avatar src={chat.avatar} />

              <Column $justify="flex-start" $align="flex-start" style={{ width: '100%' }}>
                <MessageInfo>
                  <SenderInfo>
                    <SenderName>{chat.name}</SenderName>
                    {/* 개인톡이면서 상대방이 업체일 경우 태그 표시 */}
                    {chat.isVendor && <SenderType>업체</SenderType>}
                  </SenderInfo>
                  <Timestamp>{formatTodayTimeOrIsoTime(chat.timestamp)}</Timestamp>
                </MessageInfo>
                <MessageContent>
                  {/* 단체톡일 경우 참여자 목록을 부가 정보로 표시 */}
                  <LastMessage style={{ maxWidth: chat.unreadCount > 0 ? 230 : 'auto' }}>
                    {chat.lastMessage}
                  </LastMessage>
                  {chat.unreadCount > 0 && <UnreadBadge>{chat.unreadCount}</UnreadBadge>}
                </MessageContent>
              </Column>
            </ChatItem>
          </SwipeableChatItem>
        ))}
      </ScrollableContainerWithGap>
    </Page>
  );
}

const ToggleContainer = styled.div`
  padding: 10px 32px 20px;
  display: flex;
  gap: 8px;
`;

const ScrollableContainerWithGap = styled(ScrollableContent)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChatItem = styled.div`
  padding: 6px;

  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 10px;
  flex-shrink: 0;

  cursor: pointer;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const MessageInfo = styled.div`
  width: 100%;

  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
`;

const SenderInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const SenderName = styled.div`
  ${typo('button1')};
  color: ${color('grayscale.800')};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SenderType = styled.div`
  ${typo('caption2')}
  color: ${color('grayscale.500')};
  margin-left: 6px;
  flex-shrink: 0;
`;

const LastMessage = styled.p`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  min-width: 0;

  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageContent = styled.div`
  width: 100%;
  flex-shrink: 0;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${typo('body2')};
  color: ${color('grayscale.800')};
`;

const Timestamp = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;

const UnreadBadge = styled.div`
  background-color: ${color('brand.primary')};
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
`;
