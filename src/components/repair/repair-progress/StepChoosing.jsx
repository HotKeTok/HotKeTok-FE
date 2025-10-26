// src/components/repair/repair-progress/StepChoosing.jsx
import React from 'react';
import styled from 'styled-components';
import ModeItem from '../../common/ModeItem';
import Button from '../../common/Button';
import { Row, Column } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import iconChevron from '../../../assets/repair/icon-chevron.svg';
import { formatNumberWithCommas } from '../../../utils/number';
import { useNavigate } from 'react-router-dom';

export default function StepChoosing({
  mode,
  quotes,
  selectedQuoteId,
  setSelectedQuoteId,
  canProceed,
  onProceed,
}) {
  const nav = useNavigate();

  const goVendor = (e, vendorId) => {
    e.stopPropagation(); // 카드 선택과 충돌 방지
    if (vendorId == null) return;
    // ✅ 쿼리파라미터로 라우팅
    nav({
      pathname: '/vendor-profile',
      search: `?vendorId=${encodeURIComponent(String(vendorId))}`,
    });
  };

  return (
    <Wrap>
      <Header>
        <Title>받은 견적</Title>
        <Desc>
          {quotes.length}개 업체에서 견적서를 보내왔어요.
          <br />
          수리를 진행할 업체를 선택해 주세요.
        </Desc>
      </Header>

      <Body>
        <Column $gap={10}>
          {quotes.map(q => (
            <ModeItem
              key={q.id}
              selected={selectedQuoteId === q.id}
              onClick={() => (mode === 'SELF' ? setSelectedQuoteId(q.id) : null)}
              height="auto"
              padding="18px 24px"
            >
              <Column>
                <Row>
                  <Row
                    $gap={10}
                    style={{ cursor: q.vendorId ? 'pointer' : 'default' }}
                    onClick={e => goVendor(e, q.vendorId)}
                  >
                    <Avatar src={q.avatar} alt="" />
                    <Company>
                      {q.companyName} <Arrow src={iconChevron} />
                    </Company>
                  </Row>
                </Row>
                <Phone>{q.phone}</Phone>
                <Content>{q.content}</Content>
                <Price>
                  {q.decisionLater
                    ? '상담 후 결정'
                    : (typeof q.price === 'number' ? formatNumberWithCommas(q.price) : q.price) +
                      '원'}
                </Price>
              </Column>
            </ModeItem>
          ))}
        </Column>
        <Footer>
          <Button
            active={canProceed} // 🔹 집주인 뷰일 땐 무조건 활성화
            onClick={onProceed}
            text={mode === 'LANDLORD' ? '집주인이 선택합니다' : '견적서 선택'}
          />
        </Footer>
      </Body>
    </Wrap>
  );
}

const Wrap = styled.div`
  margin-top: 10px;
  background: #fff;
`;
const Header = styled.div`
  padding: 16px 24px;
`;
const Title = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;
const Desc = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
  margin-top: 4px;
`;
const Body = styled.div`
  padding: 0 24px 16px 24px;
`;
const Footer = styled.div`
  margin-top: 30px;
`;
const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${color('grayscale.200')};
`;
const Company = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.600')};
  display: flex;
  align-items: center;
`;
const Arrow = styled.img`
  margin-left: 4px;
`;
const Phone = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
  margin-top: 4px;
`;
const Content = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.800')};
  margin: 2px 0 10px 0;
`;
const Price = styled.div`
  width: 100%;
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
  text-align: end;
`;
