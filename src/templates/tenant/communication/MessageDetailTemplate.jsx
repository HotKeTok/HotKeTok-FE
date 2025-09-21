import React, { useState } from 'react';
import TopBar from '../../../components/common/TopBar';
import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
import styled from 'styled-components';
import {
  EXAMPLE_RECEIVED_MESSAGE_LIST,
  EXAMPLE_SENT_MESSAGE_LIST,
} from '../../../mocks/communication/message';
import { TAG_ICONS } from '../../../constants/tenant/main/communication/tag';
import PencilIcn from '../../../assets/communication/message/pencil-icon.svg?react';
import { formatDateToYMD, getHHMMTime } from '../../../utils/dateFormat';
import { color, typo } from '../../../styles/tokens';
import MenuIcn from '../../../assets/common/icon-menu.svg?react';
import ReportMenuIcon from '../../../components/communication/message/ReportMenuIcon';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { TIME_OPTIONS } from '../../../constants/tenant/main/communication/message';
import { useNavigate } from 'react-router-dom';

/**
 * MessageDetailTemplate component
 * @param {number} id
 * @param {type} "receive" | "sent"
 * @param {object} message
 * @param {function} onReply
 * @returns
 */
export default function MessageDetailTemplate({ id, type = 'receive', message = {}, onReply }) {
  const navigation = useNavigate();
  const [modal, setModal] = useState(false);
  const messageDetail =
    (type === 'receive' ? EXAMPLE_RECEIVED_MESSAGE_LIST : EXAMPLE_SENT_MESSAGE_LIST).find(
      msg => msg.id == id
    ) || {};
  // todo: 탭에 따라 type 검토

  function handleReplyClick() {
    if (typeof onReply === 'function') onReply(message);
  }

  function handleReportClick() {
    setModal(true);
  }

  function handleConfirmReport() {
    // todo: 신고시 삭제 api 요청
    setModal(false);
    navigation(-1);
  }

  const TagComponent = TAG_ICONS[messageDetail.tag];

  return (
    <PageWithoutBottomBar>
      <TopBar
        title={`${type === 'sent' ? '보낸 쪽지' : '받은 쪽지'}`}
        rightComponent={<ReportMenuIcon onClick={() => handleReportClick()} />}
      />
      <ConfirmModal
        isOpen={modal}
        title="쪽지 신고"
        description="해당 쪽지를 신고하시겠어요?"
        onClose={() => setModal(false)}
        onConfirm={handleConfirmReport}
        confirmText="확인"
      />
      <ScrollableNoBottomBarContent>
        <ContentContainer>
          <IndexAndValue>
            <Title>{type === 'sent' ? '보낸' : '받은'} 이웃</Title>
            <Value>
              {type === 'receive'
                ? messageDetail.anonymity
                  ? '익명'
                  : messageDetail.sender
                : messageDetail.sender}
            </Value>
          </IndexAndValue>

          <IndexAndValue>
            <Title>날짜</Title>
            <Value>{`${formatDateToYMD(messageDetail.createdAt)} / ${getHHMMTime(
              messageDetail.createdAt
            )}`}</Value>
          </IndexAndValue>

          <IndexAndValue>
            <Title>태그</Title>
            <TagArea>
              <TagComponent />
            </TagArea>
          </IndexAndValue>

          <IndexAndValue style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <Title>내용</Title>
            <DescriptBox>
              <div>{messageDetail.content}</div>
            </DescriptBox>
          </IndexAndValue>

          {type === 'receive' && !messageDetail.anonymity ? (
            <ButtonWrapper>
              <SendButton onClick={handleReplyClick}>
                <PencilIcn width={12} height={12} />
                {messageDetail.senderId || messageDetail.receiverId}호에 답장하기
              </SendButton>
            </ButtonWrapper>
          ) : null}
        </ContentContainer>
      </ScrollableNoBottomBarContent>
    </PageWithoutBottomBar>
  );
}

const ContentContainer = styled.div`
  padding: 30px 24px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
`;

const IndexAndValue = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #565656;
`;

const Title = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

const Value = styled.div`
  color: ${color('grayscale.800')};
  ${typo('body1')};

  white-space: pre-line;
  text-align: right;
`;

const DescriptBox = styled.div`
  width: 100%;
  display: flex;
  padding: 13px 15px;
  align-items: flex-start;
  border-radius: 6px;
  border: 1px solid #efefef;
  background: #fafafb;

  ${typo('body2')};
  color: ${color('grayscale.800')};
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-items: center;
`;

const SendButton = styled.div`
  cursor: pointer;
  padding: 11px 14px;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;

  border-radius: 30px;
  border: 1px solid rgba(1, 210, 129, 0.3);
  background: rgba(1, 210, 129, 0.04);

  color: #1f1f1f;
  display: flex;
  flex-direction: row;
  align-items: center;

  ${typo('button3')};
`;

const TagArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
