// src/components/repair/repair-progress/StepMatching.jsx
import React from 'react';
import styled from 'styled-components';
import RepairDetailRows from '../repair-progress/RepairDetailRows';
import { color, typo } from '../../../styles/tokens';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';

export default function StepMatching({ mode, selectedQuote, hopeAt }) {
  const nav = useNavigate();

  const handleChat = () => {
    alert('채팅페이지로 이동처리해야함');
  };

  if (!selectedQuote) return null;

  return (
    <>
      <div style={{ height: '10px', backgroundColor: '#F5F6F6' }} />
      <Wrap>
        <Header>
          <Title>선택한 견적</Title>
        </Header>
        <Body>
          <RepairDetailRows
            companyName={selectedQuote.companyName}
            phone={selectedQuote.phone}
            price={selectedQuote.price}
            schedule={hopeAt}
            content={selectedQuote.content}
            avatar={selectedQuote.avatar}
            decisionLater={selectedQuote.decisionLater}
            onCompanyClick={() =>
              selectedQuote.vendorId &&
              nav({
                pathname: '/vendor-profile',
                search: `?vendorId=${encodeURIComponent(String(selectedQuote.vendorId))}`,
              })
            }
          />
          <Footer>
            <Button onClick={handleChat} text="1:1 문의하기" />
          </Footer>
        </Body>
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  background: #fff;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
`;
const Title = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;
const Body = styled.div`
  padding: 16px 24px;
`;

const Footer = styled.div`
  margin-top: 30px;
`;
