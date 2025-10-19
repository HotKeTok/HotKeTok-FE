import TopBar from '../../../components/common/TopBar';
import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { color, typo } from '../../../styles/tokens';
import MessageItem from '../../../components/communication/message/MessageItem';
import { Column, Row } from '../../../styles/flex';
import ButtonFixed from '../../../components/common/ButtonFixed';
import IconNoMessage from '../../../assets/communication/message/icon-no-message.svg?react';

export default function MessageTemplate({
  toggleState,
  setToggleState,
  receivedMessages,
  sentMessages,
  loading,
}) {
  const navigate = useNavigate();

  const handleItemClick = id => {
    navigate(`/message/detail/${id}`, {
      state: { type: toggleState === 0 ? 'receive' : 'sent' },
    });
  };

  const renderContent = () => {
    if (toggleState === 0 && receivedMessages.length === 0) {
      return (
        <FullContainer $justify="center" $align="center" $gap={12}>
          <IconNoMessage />
          <NoMessageText>아직 받은 쪽지가 없어요</NoMessageText>
        </FullContainer>
      );
    } else if (toggleState === 1 && sentMessages.length === 0) {
      return (
        <FullContainer $justify="center" $align="center" $gap={12}>
          <IconNoMessage />
          <NoMessageText>아직 보낸 쪽지가 없어요</NoMessageText>
        </FullContainer>
      );
    }

    const sortedReceived = [...receivedMessages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const sortedSent = [...sentMessages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const type = toggleState === 0 ? 'receive' : 'sent';
    return (
      <Column $gap={6}>
        {toggleState === 0
          ? sortedReceived.map(entry => (
              <MessageItem
                type={type}
                entry={entry}
                onClick={() => handleItemClick(entry.postId)}
              />
            ))
          : sortedSent.map(entry => (
              <MessageItem
                type={type}
                entry={entry}
                onClick={() => handleItemClick(entry.postId)}
              />
            ))}
      </Column>
    );
  };

  return (
    <PageWithoutBottomBar>
      <TopBar title="쪽지 내역" />
      <ToggleContainer>
        <Toggle state={toggleState === 0} onClick={() => setToggleState(0)}>
          받은 쪽지
        </Toggle>
        <Toggle state={toggleState === 1} onClick={() => setToggleState(1)}>
          보낸 쪽지
        </Toggle>
      </ToggleContainer>
      <IndexContainer>
        {toggleState === 0 ? '보낸 이웃' : '받은 이웃'}
        <div>내용</div>
        <div>날짜</div>
      </IndexContainer>
      <ScrollableNoBottomBarContent
        style={{ padding: '0 20px', paddingBottom: 200, backgroundColor: '#f5f6f6' }}
      >
        {loading ? <div>데이터를 불러오는 중...</div> : renderContent()}
      </ScrollableNoBottomBarContent>
      <ButtonFixed text="쪽지 쓰기" isIcn={true} onClick={() => navigate('/message/write')} />
    </PageWithoutBottomBar>
  );
}

const ToggleContainer = styled.div`
  width: 100%;
  background-color: #fff;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const Toggle = styled.div`
  width: 50%;
  padding: 10px 0px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  ${props =>
    props.state
      ? css`
          border-bottom: 2px solid #323232;
          color: #1f1f1f;
          ${typo('subtitle1')};
        `
      : css`
          border-bottom: 2px solid #dedede;
          color: ${color('grayscale.600')};
          ${typo('body1')};
        `}
`;

const IndexContainer = styled.div`
  width: 100%;
  padding: 20px 27px 10px 27px;

  background: #f5f6f6;
  ${typo('body2')};
  color: ${color('grayscale.500')};

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FullContainer = styled(Column)`
  width: 100%;
  height: 100%;
`;

const NoMessageText = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.500')};
`;
