import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import ButtonRound from '../../../components/common/ButtonRound';
import TopBar from '../../../components/common/TopBar';
import { Page, ScrollableNoBottomBarContent, TOP_BAR_HEIGHT } from '../../../styles/layout';
import { useNavigate } from 'react-router-dom';
import { formatTodayTimeOrIsoTime } from '../../../utils/dateFormat';
import SwipeableChatItem from '../../../components/chat/SwipableChatItem';
import { Column, Row } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import IcnNoChat from '../../../assets/chat/no-chat-icon.svg?react';
import IcnDefaultProfile from '../../../assets/common/icon-profile-default.svg?react';
import Toast from '../../../components/common/Toast';
import { useAuthStore } from '../../../store/useAuthStore';
import IconPinned from '../../../assets/common/icon-pinned.svg?react';

export default function ChatTemplate({ chatRooms, onDelete, toast, closeToast }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('direct');
  const userId = useAuthStore(state => state.userId);

  const processedChats = useMemo(() => {
    const myUserId = userId;

    const directTalk = [];
    const groupTalk = [];

    chatRooms.forEach(chat => {
      if (chat.participants.length > 2) {
        const newChat = {
          ...chat,
          name: chat.participants
            .filter(p => p.userId !== myUserId)
            .map(p => p.userName)
            .join(', '),
          isGroup: true,
          vendorAvatar:
            chat.participants.find(p => p.senderType === 'VENDOR')?.profileImageUrl || null,
        };
        groupTalk.push(newChat); // 가공된 단체 채팅방 정보 저장
      } else {
        const otherParticipant = chat.participants.find(p => p.userId !== myUserId);
        const newChat = {
          ...chat,
          name: otherParticipant?.userName || '알 수 없는 사용자',
          avatar: otherParticipant?.profileImageUrl,
          isGroup: false,
          isVendor: otherParticipant?.senderType === 'VENDOR',
          vendorCategory: otherParticipant?.category || null,
          unitNumber: otherParticipant?.unitNumber || null,
        };
        directTalk.push(newChat); // 가공된 개인 채팅방 정보 저장
      }
    });

    return { directTalk, groupTalk };
  }, [chatRooms]);

  const chatsToShow = activeTab === 'direct' ? processedChats.directTalk : processedChats.groupTalk;

  console.log(chatsToShow);
  return (
    <Page style={{ backgroundColor: '#f5f6f6', position: 'relative' }}>
      <Toast show={toast.open} onClose={closeToast} message={toast.message} duration={1000} />
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

      <ScrollableNoBottomBarContent style={{ padding: '0 24px' }}>
        {chatsToShow.length === 0 ? (
          <FullContainer>
            <IcnNoChat width={155} height={84} />
            <H2 style={{ marginBottom: 4, marginTop: 6 }}>진행 중인 채팅이 없어요.</H2>
            <Body1>입주민, 시공업체 와의 채팅은 여기에 표시됩니다.</Body1>
          </FullContainer>
        ) : (
          <Column
            $gap={16}
            style={{
              paddingTop: 10,
              paddingBottom: 50,
              height: `calc(100vh- ${TOP_BAR_HEIGHT}) -80px`,
            }}
          >
            {chatsToShow.map(chat => (
              <SwipeableChatItem
                key={chat.roomId}
                onDelete={() => onDelete(chat.roomId, chat.name)}
              >
                <ChatItem onClick={() => navigate(`/chat/chat-room/${chat.roomId}`)}>
                  {chat.isGroup && chat.vendorAvatar ? (
                    <VendorAvatar src={chat.vendorAvatar} />
                  ) : chat.avatar ? (
                    <Avatar src={chat.avatar} />
                  ) : (
                    <IcnDefaultProfile width={57} height={57} />
                  )}

                  <Column $justify="flex-start" $align="flex-start" style={{ width: '100%' }}>
                    <MessageInfo>
                      <SenderInfo>
                        <SenderName>{chat.name}</SenderName>
                        {/* 개인톡이면서 상대방이 업체일 경우 태그 표시 */}
                        {chat.isVendor && <SenderType>업체</SenderType>}
                        {chat.isLandlordChat && <IconPinned />}
                      </SenderInfo>
                      <Timestamp>{formatTodayTimeOrIsoTime(chat.lastMessageTime)}</Timestamp>
                    </MessageInfo>
                    <MessageContent>
                      <LastMessage
                        style={{ maxWidth: chat.unreadCount > 0 ? 230 : 'auto' }}
                        isPlaceholder={chat.lastMessageContent === '아직 메시지가 없습니다.'}
                      >
                        {chat.lastMessageContent === '아직 메시지가 없습니다.'
                          ? '대화를 시작해보세요!'
                          : chat.lastMessageContent}
                      </LastMessage>
                      {chat.unreadCount > 0 && <UnreadBadge>{chat.unreadCount}</UnreadBadge>}
                    </MessageContent>
                  </Column>
                </ChatItem>
              </SwipeableChatItem>
            ))}
          </Column>
        )}
      </ScrollableNoBottomBarContent>
    </Page>
  );
}

const ToggleContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;

  padding: 10px 32px 0px;
  display: flex;
  gap: 8px;
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

  ${({ isPlaceholder }) =>
    isPlaceholder &&
    css`
      color: ${color('grayscale.500')};
    `}
`;

const FullContainer = styled.div`
  width: 100%;
  height: 65%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const H2 = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.600')};
`;

const Body1 = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.600')};
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
