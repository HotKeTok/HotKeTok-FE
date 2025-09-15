import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import ButtonRound from '../../components/common/ButtonRound';
import TopBar from '../../components/common/TopBar';
import { EXAMPLE_CHAT_DATA } from '../../mocks/communication/chat';
import { Page, ScrollableContent } from '../../styles/layout';

const formatTimestamp = isoString => {
  const messageDate = new Date(isoString);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (messageDate >= startOfToday) {
    return messageDate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } else {
    return messageDate
      .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/\.$/, '')
      .replace(/ /g, '');
  }
};

const SwipeableListItem = ({ children, onDelete }) => {
  const listRef = useRef(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentTranslateX = useRef(0);

  const getClientX = e => (e.touches ? e.touches[0].clientX : e.clientX);

  const onInteractionStart = e => {
    startX.current = getClientX(e);
    isSwiping.current = true;
    listRef.current.style.transition = 'none';
  };

  const onInteractionMove = e => {
    if (!isSwiping.current) return;
    const currentX = getClientX(e);
    const deltaX = currentX - startX.current;
    const newTranslateX = Math.min(0, Math.max(-70, currentTranslateX.current + deltaX));
    listRef.current.style.transform = `translateX(${newTranslateX}px)`;
  };

  const onInteractionEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    listRef.current.style.transition = 'transform 0.3s ease-in-out';

    const transformMatrix = window.getComputedStyle(listRef.current).transform;
    const translateX = new DOMMatrix(transformMatrix).m41;

    if (translateX < -35) {
      listRef.current.style.transform = 'translateX(-70px)';
      currentTranslateX.current = -70;
    } else {
      listRef.current.style.transform = 'translateX(0px)';
      currentTranslateX.current = 0;
    }
  };

  return (
    <ChatItemContainer>
      <SwipeableWrapper
        ref={listRef}
        onMouseDown={onInteractionStart}
        onTouchStart={onInteractionStart}
        onMouseMove={onInteractionMove}
        onTouchMove={onInteractionMove}
        onMouseUp={onInteractionEnd}
        onTouchEnd={onInteractionEnd}
        onMouseLeave={onInteractionEnd}
      >
        {children}
        <DeleteButton onClick={onDelete}>삭제</DeleteButton>
      </SwipeableWrapper>
    </ChatItemContainer>
  );
};

export default function ChatTemplate() {
  const [activeTab, setActiveTab] = useState('direct');
  const [chats, setChats] = useState(EXAMPLE_CHAT_DATA);

  const handleDelete = (id, type) => {
    alert(`Deleting chat item ${id}`);
  };

  const chatsToShow = activeTab === 'direct' ? chats.directTalk : chats.groupTalk;

  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);
  return (
    <Page>
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
      <ScrollableContent customheight={`calc(100vh - 160px)`}>
        {chatsToShow.map(chat => (
          <SwipeableListItem key={chat.id} onDelete={() => handleDelete(chat.id, activeTab)}>
            <ChatItem>
              <AvatarContainer>
                {chat.avatar ? <Avatar src={chat.avatar} /> : <DefaultAvatar />}
              </AvatarContainer>
              <MessageInfo>
                <SenderInfo>
                  <SenderName>{chat.name}</SenderName>
                  {chat.type === 'contractor' && <SenderType>인테리어공사</SenderType>}
                </SenderInfo>
                <LastMessage>{chat.lastMessage}</LastMessage>
              </MessageInfo>
              <MetaInfo>
                <Timestamp>{formatTimestamp(chat.timestamp)}</Timestamp>
                {chat.unreadCount > 0 && <UnreadBadge>{chat.unreadCount}</UnreadBadge>}
              </MetaInfo>
            </ChatItem>
          </SwipeableListItem>
        ))}
      </ScrollableContent>
    </Page>
  );
}

const ToggleContainer = styled.div`
  padding: 10px 16px;
  display: flex;
  gap: 8px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  ${({ active }) =>
    active
      ? css`
          background-color: #3f8bfa;
          color: white;
        `
      : css`
          background-color: #f0f0f0;
          color: #888;
        `}
`;
const ChatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChatItemContainer = styled.li`
  background-color: #fff;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
`;

const SwipeableWrapper = styled.div`
  display: flex;
  position: relative;
  touch-action: pan-y;
`;

const DeleteButton = styled.button`
  background-color: #ff4d4f;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  width: 70px;
  flex-shrink: 0;
`;

const ChatItem = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  background-color: #fff;
  width: 100%;
  flex-shrink: 0;
`;

const AvatarContainer = styled.div`
  margin-right: 12px;
`;
const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;
const DefaultAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e0e0e0;
`;
const MessageInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
const SenderInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;
const SenderName = styled.span`
  font-weight: bold;
  font-size: 16px;
`;
const SenderType = styled.span`
  font-size: 12px;
  color: #888;
  margin-left: 8px;
`;
const LastMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  font-size: 12px;
  color: #aaa;
  padding-left: 10px;
`;
const Timestamp = styled.span``;
const UnreadBadge = styled.div`
  background-color: #ff4d4f;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
`;
