import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { useNavigate } from 'react-router-dom';
import { Row } from '../../styles/flex';
import { toKoreanTime } from '../../utils/dateFormat';
import { formatIsTodayOrIsoTime, getHHMMTimeWithHour12 } from '../../utils/dateFormat';
import ProfileDefaultIcon from '../../assets/common/icon-profile-default.svg?react';

export default function Chat({ message, isMe, senderInfo, showDateSeparator }) {
  const navigate = useNavigate();
  const [isEstimateSelected, parsedData] = useMemo(() => {
    try {
      const data = JSON.parse(message.content);
      if (data && data.type === 'ESTIMATE_SELECTED') {
        return [true, data];
      }
    } catch (e) {}
    return [false, null];
  }, [message.content]);

  const handleDetailClick = () => {
    const jsonString = message.content;

    const data = JSON.parse(jsonString);
    const estimateId = data.estimateId;
    console.log('estimateId', estimateId);

    if (parsedData) {
      // 상세페이지가 따로 없으므로
      navigate(`/repair-progress?id=${estimateId}`);
    }
  };

  return (
    <React.Fragment key={message.messageId}>
      {showDateSeparator && (
        <DateSeparator>{formatIsTodayOrIsoTime(message.createdAt)}</DateSeparator>
      )}
      <MessageRow isMe={isMe}>
        {!isMe && (
          <Row $gap={8} $align="center" style={{ padding: '0 4px' }}>
            <Avatar>
              {senderInfo?.profileImageUrl ? (
                <img src={senderInfo.profileImageUrl} alt="profile" />
              ) : (
                <ProfileDefaultIcon />
              )}
            </Avatar>
            <SenderName>{senderInfo?.userName || '알 수 없음'}</SenderName>
          </Row>
        )}
        <MessageContainer>
          <BubbleContainer>
            {isMe && (
              <Timestamp>{getHHMMTimeWithHour12(toKoreanTime(message.createdAt))}</Timestamp>
            )}
            <MessageBubbleComp isMe={isMe} $isEstimate={isEstimateSelected}>
              {isEstimateSelected ? (
                <EstimateView>
                  <EstimateContent>
                    <EstimateTitle>사장님의 견적서를 선택했어요!</EstimateTitle>
                    <ImageGrid>
                      {(parsedData.imageUrls || []).map((url, index) => (
                        <EstimateImage key={index} src={url} alt={`estimate-${index}`} />
                      ))}
                    </ImageGrid>
                  </EstimateContent>
                  <DetailButton isMe={isMe} onClick={handleDetailClick}>
                    자세히 보기
                  </DetailButton>
                </EstimateView>
              ) : (
                message.content
              )}
            </MessageBubbleComp>
            {!isMe && (
              <Timestamp>{getHHMMTimeWithHour12(toKoreanTime(message.createdAt))}</Timestamp>
            )}
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

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
  flex-direction: ${({ isMe }) => (isMe ? 'row' : 'row-reverse')};
`;

const Timestamp = styled.span`
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
  white-space: nowrap;
`;

const MessageBubbleComp = styled.div`
  padding: ${props => (props.$isEstimate ? '0' : '12px 18px')};
  border-radius: 20px;
  ${typo('body2')};
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-all;
  overflow: hidden;
  max-width: 300px;

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
          box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
        `}
`;

const EstimateView = styled.div`
  display: flex;
  flex-direction: column;
`;

const EstimateContent = styled.div`
  padding: 18px 18px 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EstimateTitle = styled.span`
  ${typo('subtitle2')};
  color: inherit;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const EstimateImage = styled.img`
  width: 100%;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  background-color: ${color('grayscale.200')};
`;

const DetailButton = styled.button`
  width: 100%;
  padding: 14px;
  text-align: center;
  ${typo('button2')};
  cursor: pointer;
  border: none;
  border-radius: 0;

  ${props =>
    props.isMe
      ? css`
          background-color: rgba(255, 255, 255, 0.2);
          color: #fff;
        `
      : css`
          background-color: ${color('grayscale.200')};
          color: ${color('grayscale.900')};
        `}
`;
