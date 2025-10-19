import PageHeader from '../../../components/common/PageHeader';
import TopBar from '../../../components/common/TopBar';
import { BOTTOM_BAR_HEIGHT, Page, ScrollableContent } from '../../../styles/layout';
import styled from 'styled-components';
import { typo } from '../../../styles/tokens';
import NoticeItem from '../../../components/main/notice/NoticeItem';
import { Column } from '../../../styles/flex';
import MessageIcn from '../../../assets/communication/message/message-icon.svg?react';
import MessageImg from '../../../assets/communication/message/message.png';
import NoticeComponent from '../../../components/communication/NoticeComponent';
import Notice from '../../../pages/tenant/main/Notice';
import { useNavigate } from 'react-router-dom';

export default function CommunicationTemplate({ notices }) {
  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader leftComponent={<Subtitle1>똑똑</Subtitle1>} />
      <ScrollableContent style={{ padding: '0 24px', paddingBottom: 143 }}>
        {/* 공지사항 컴포넌트 */}
        <NoticeComponent notices={notices} />

        {/* 메시지 컴포넌트 */}
        <MessageWrapper style={{ marginTop: 16 }} onClick={() => navigate('/message')}>
          <Column $gap={10} $align="flex-start">
            <MessageIcn width={32} height={32} />
            <Column $gap={4}>
              <H3 style={{ color: '#3F856A' }}>이웃에게 쪽지 보내기</H3>
              <Caption1 style={{ color: '#3F856A' }}>
                이웃에게 전할 메세지가 있으신가요? <br />
                쪽지를 보내보세요.
              </Caption1>
            </Column>
          </Column>
          <img src={MessageImg} alt="쪽지 이미지" width={63} height={71} object-fit="contain" />
        </MessageWrapper>
      </ScrollableContent>
    </Page>
  );
}

const Subtitle1 = styled.text`
  ${typo('subtitle1')};
`;

const H3 = styled.div`
  ${typo('h3')};
`;

const Caption1 = styled.div`
  ${typo('caption1')};
`;

const MessageWrapper = styled.div`
  height: 140px;
  padding: 16px 24px;

  border-radius: 20px;
  background: rgba(1, 210, 129, 0.12);

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  cursor: pointer;
`;
