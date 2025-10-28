import { formatIsTodayOrIsoTime, getHHMMTimeWithHour12 } from '../../utils/dateFormat';
import styled, { css } from 'styled-components';
import React from 'react';
import { color, typo } from '../../styles/tokens';
import { Row } from '../../styles/flex';

export default function MessageBubble({ message, isMe, senderInfo, showDateSeparator }) {
  return (
    <React.Fragment key={message.messageId}>
      {showDateSeparator && (
        <DateSeparator>{formatIsTodayOrIsoTime(message.createdAt)}</DateSeparator>
      )}
      <MessageRow isMe={isMe}>
        {!isMe && (
          <Row $gap={8} $align="center" style={{ padding: '0 4px' }}>
            <Avatar src={senderInfo?.profileImageUrl || 'https://i.pravatar.cc/150?u=default'} />
            <SenderName>{senderInfo?.userName || '알 수 없음'}</SenderName>
          </Row>
        )}
        <MessageContainer>
          <BubbleContainer>
            {isMe && <Timestamp>{getHHMMTimeWithHour12(message.createdAt)}</Timestamp>}
            <MessageBubbleComp isMe={isMe}>{message.content}</MessageBubbleComp>
            {!isMe && <Timestamp>{getHHMMTimeWithHour12(message.createdAt)}</Timestamp>}
          </BubbleContainer>
        </MessageContainer>
      </MessageRow>
    </React.Fragment>
  );
}

const DateSeparator = styled.div`
  text-align: center;
  ${typo('caption1')}
  color: ${color('grayscale.400')};
  margin: 20px auto;
`;

const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2px;
  justify-content: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
  align-items: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: contain;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SenderName = styled.div`
  ${typo('button2')};
  color: ${color('grayscale.800')};
`;

const BubbleContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
`;

const Timestamp = styled.span`
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
`;

const MessageBubbleComp = styled.div`
  padding: 12px 18px;
  border-radius: 20px;
  ${typo('body2')};
  line-height: 20px;
  word-break: break-all;

  ${({ isMe }) =>
    isMe
      ? css`
          background-color: ${color('brand.primary')};
          color: white;
          border-bottom-right-radius: 0px;
        `
      : css`
          background-color: #ffffff;
          color: ${color('grayscale.800')};
          border-bottom-left-radius: 0px;
        `}
`;
