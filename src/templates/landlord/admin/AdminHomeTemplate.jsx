import PageHeader from '../../../components/common/PageHeader';
import NoticeComponent from '../../../components/communication/NoticeComponent';
import { Page, ScrollableContent } from '../../../styles/layout';
import { typo } from '../../../styles/tokens';
import styled from 'styled-components';
import { EXAMPLE_NOTICES } from '../../../mocks/main/notice';
import { ADMIN_DASHBOARD_ITEMS, DASHBOARD_ITEMS } from '../../../constants/landlord/main';
import { useNavigate } from 'react-router-dom';
import { Column, Row } from '../../../styles/flex';
import ArrowRight from '../../../assets/common/icon-arrow-right.svg?react';

export default function AdminHomeTemplate({ noticeList }) {
  const navigate = useNavigate();

  const filteredItems = ADMIN_DASHBOARD_ITEMS.map(key =>
    Object.values(DASHBOARD_ITEMS).find(item => item.key === key)
  );

  return (
    <Page>
      <PageHeader leftComponent={<Subtitle1>관리</Subtitle1>} />
      <ScrollableContent style={{ padding: '0 24px', paddingBottom: 143 }}>
        <NoticeComponent notices={noticeList} />

        <DashboardContainer>
          {filteredItems.map((item, index) => {
            const IconComponent = item.image;

            return (
              <Button
                key={index}
                onClick={() => navigate(item.route)}
                style={{ background: item.background }}
              >
                <Row $gap={14}>
                  <TextWrapper>
                    <Title>{item.text}</Title>
                    {/* description이 true일 때만 특정 텍스트를 보여주는 로직 (예시) */}
                    {item.description && <Description>3건 진행중</Description>}
                  </TextWrapper>
                  <Column $justify={'center'} style={{ height: 38, width: 20, cursor: 'pointer' }}>
                    <StyleArrowRight width={7} height={11} stroke="#565656" />
                  </Column>
                </Row>
                <Icon>
                  <IconComponent />
                </Icon>
              </Button>
            );
          })}
        </DashboardContainer>
      </ScrollableContent>
    </Page>
  );
}

const StyleArrowRight = styled(ArrowRight)`
  width: 7px;
  height: 12.5px;

  path {
    stroke: #323232;
  }
`;

const Subtitle1 = styled.div`
  ${typo('subtitle1')};
`;

const DashboardContainer = styled.div`
  width: 100%;
  margin-top: 16px;
  display: grid;
  gap: 10px;
`;

const Button = styled.button`
  border-radius: 20px;
  padding: 12px 8px 12px 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s;
  height: 140px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TextWrapper = styled.div`
  width: 80%;
`;

const Title = styled.div`
  ${typo('h1')};
  color: #000;
  word-break: keep-all;
`;

const Description = styled.p`
  font-size: 14px;
  color: #868e96;
  margin: 0;
`;

const Icon = styled.div`
  width: 50px;
  height: 50px;
  align-self: flex-end; // 아이콘을 오른쪽 아래로
`;
