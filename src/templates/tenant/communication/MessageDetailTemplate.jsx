import { useState } from 'react';
import TopBar from '../../../components/common/TopBar';
import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
import styled from 'styled-components';
import PencilIcn from '../../../assets/communication/message/pencil-icon.svg?react';
import { formatDateToYMD, getHHMMTime } from '../../../utils/dateFormat';
import { color, typo } from '../../../styles/tokens';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import OptionsMenu from '../../../components/common/OptionsMenu';
import { TAG_DATA } from '../../../constants/tenant/main/communication/tag';

/**
 * MessageDetailTemplate component
 * @param {number} id
 * @param {type} "receive" | "sent"
 * @param {object} message
 * @param {function} onReply
 * @returns
 */
export default function MessageDetailTemplate({
  type = 'receive',
  messageDetail = {},
  onReply,
  onReport,
}) {
  const navigation = useNavigate();
  const [modal, setModal] = useState(false);

  function handleReplyClick() {
    if (typeof onReply === 'function') onReply(messageDetail);
  }

  function handleReportClick() {
    setModal(true);
  }

  function handleConfirmReport() {
    onReport();
    setModal(false);
    navigation(-1);
  }

  const menuOption = [
    {
      label: '신고하기',
      onClick: handleReportClick,
    },
  ];

  return (
    <PageWithoutBottomBar>
      <TopBar
        title={`${type === 'sent' ? '보낸 쪽지' : '받은 쪽지'}`}
        rightComponent={type === 'receive' && <OptionsMenu options={menuOption} />}
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
            <Title>{type === 'sent' ? '받은' : '보낸'} 이웃</Title>
            <Value>
              {type === 'receive' && messageDetail.isAnonymous
                ? '익명'
                : messageDetail.senderNumber}
            </Value>
          </IndexAndValue>

          <IndexAndValue>
            <Title>날짜</Title>
            <Value>{`${formatDateToYMD(messageDetail.createdAt)} / ${getHHMMTime(
              messageDetail.createdAt
            )}`}</Value>
          </IndexAndValue>

          <IndexAndValue style={{ alignItems: 'flex-start' }}>
            <Title>태그</Title>
            <TagArea>
              {messageDetail.tags.length > 0 &&
                messageDetail.tags.map(tag => {
                  const TagIcon = TAG_DATA.find(t => t.id === tag).activeIcon;
                  return <TagIcon key={tag} />;
                })}
            </TagArea>
          </IndexAndValue>

          {messageDetail.silentTime && (
            <IndexAndValue style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <Title>⏰ 이 시간 이후부터는 조용히 해주셨으면 좋겠어요!</Title>
              <QuietTime>{messageDetail.silentTime}</QuietTime>
            </IndexAndValue>
          )}

          <IndexAndValue style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <Title>내용</Title>
            <DescriptBox>{messageDetail.content}</DescriptBox>
          </IndexAndValue>

          {type === 'receive' && !messageDetail.anonymity ? (
            <ButtonWrapper>
              <SendButton onClick={handleReplyClick}>
                <PencilIcn width={12} height={12} />
                {messageDetail.senderNumber}에 답장하기
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
  word-break: break-all;

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
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 8px;
`;

const QuietTime = styled.div`
  width: 100%;
  margin-left: auto;
  text-align: right;
  border-radius: 6px;
  padding: 5px;
  ${typo('body1')};
  color: ${color('grayscale.800')};

  white-space: pre-line;
`;
