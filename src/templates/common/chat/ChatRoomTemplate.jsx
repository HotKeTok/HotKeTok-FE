// 공통 채팅방 상세 템플릿
// messages: 채팅 메시지 배열
// onSendMessage: 메시지 전송 함수
// myUserId: 내 사용자 ID
// roomInfo: 방 정보 (예: 제목)
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Page, ScrollableNoBottomBarContent } from '../../../styles/layout';
import TopBar from '../../../components/common/TopBar'; // 공용 TopBar 컴포넌트
import { formatTodayTimeOrIsoTime, getHHMMTimeWithHour12 } from '../../../utils/dateFormat';
import IcnSend from '../../../assets/chat/send-icon.svg?react';
import { color, typo } from '../../../styles/tokens';
import MessageBubble from '../../../components/chat/MessageBubble';

// 템플릿 컴포넌트
export default function ChatRoomTemplate({ messages, participants, myUserId, onSendMessage }) {
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    // 컨테이너가 존재하면, 컨테이너의 스크롤 위치를 컨테이너의 전체 높이로 설정
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]); // 메시지 목록이 변경될 때마다 실행

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const renderMessages = () => {
    let lastDisplayedDate = null;
    return messages.map(msg => {
      const currentDate = new Date(msg.createdAt).toDateString();
      const showDateSeparator = currentDate !== lastDisplayedDate;
      lastDisplayedDate = currentDate;

      const isMe = msg.senderId === myUserId;
      const senderInfo = {
        avatar: null,
        name: null,
      };

      return (
        <MessageBubble
          key={msg.messageId}
          message={msg}
          isMe={isMe}
          senderInfo={senderInfo}
          showDateSeparator={showDateSeparator}
        />
      );
    });
  };

  return (
    <Page>
      <TopBar title={'대화'} />
      <StyledScrollableContent ref={containerRef}>{renderMessages()}</StyledScrollableContent>
      <InputContainer>
        <InputWrapper>
          <ChatInput
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="메시지를 입력하세요"
          />

          <SendButton onClick={handleSend} disabled={!inputValue.trim()}>
            <StyledSendIcn width={20} height={20} disabled={!inputValue.trim()} />
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </Page>
  );
}

const StyledScrollableContent = styled(ScrollableNoBottomBarContent)`
  padding: 16px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputContainer = styled.div`
  position: fixed;
  width: 390px;
  padding-bottom: 20px;
  background-color: ${color('grayscale.200')};

  bottom: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 10px 20px 20px;
`;

const InputWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${color('grayscale.300')};
  background-color: ${color('grayscale.200')};
  border-radius: 30px;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ChatInput = styled.input`
  background: transparent;
  outline: none;
  border: none;

  flex-grow: 1;
  padding-left: 15px;
  font-size: 15px;

  &:focus {
    outline: none;
  }
`;

const SendButton = styled.div`
  height: 100%;
  padding: 0 10px;

  height: 40px;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;

    svg {
      path {
        stroke: ${color('grayscale.500')};
      }
    }
  }
`;

const StyledSendIcn = styled(IcnSend)`
  ${props =>
    props.disabled
      ? css`
          path {
            stroke: ${color('grayscale.500')};
          }
        `
      : css`
          path {
            stroke: black;
          }
        `}
`;
