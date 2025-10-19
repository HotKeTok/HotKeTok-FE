import PageHeader from '../../../components/common/PageHeader';
import NoticeComponent from '../../../components/communication/NoticeComponent';
import { Page, ScrollableContent } from '../../../styles/layout';
import { typo } from '../../../styles/tokens';
import styled from 'styled-components';
import { ADMIN_DASHBOARD_ITEMS, DASHBOARD_ITEMS } from '../../../constants/landlord/main';
import { useNavigate } from 'react-router-dom';
import { Column, Row } from '../../../styles/flex';
import ArrowRight from '../../../assets/common/icon-arrow-right.svg?react';

export default function AdminHomeTemplate({ noticeList }) {
  const navigate = useNavigate();

  // const filteredItems = Object.values(DASHBOARD_ITEMS).filter(item =>
  //   ADMIN_DASHBOARD_ITEMS.includes(item.key)
  // );

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
                style={{ backgroundColor: item.backgroundColor }}
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
  margin-top: 16px;
  display: grid;
  gap: 10px;

  // 2개의 컬럼을 정의합니다.
  grid-template-columns: repeat(2, 1fr);

  // 그리드 레이아웃의 '지도'를 그립니다.
  // 1행: item-1, item-2
  // 2행: item-3 이 두 칸을 모두 차지
  grid-template-areas:
    'item-1 item-2'
    'item-3 item-3';

  // 각 자식 요소를 그려진 지도 위의 이름에 할당합니다.
  & > *:nth-child(1) {
    grid-area: item-1;
  }
  & > *:nth-child(2) {
    grid-area: item-2;
  }
  & > *:nth-child(3) {
    grid-area: item-3;
  }
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
