// src/components/repair/repair-progress/StepMatching.jsx
import React from 'react';
import styled from 'styled-components';
import ButtonSmall from '../../common/ButtonSmall';
import RepairDetailRows from '../repair-progress/RepairDetailRows';
import { color, typo } from '../../../styles/tokens';
import { useNavigate } from 'react-router-dom';

export default function StepMatching({ mode, selectedQuote, hopeAt, onCancel }) {
  const nav = useNavigate();

  if (!selectedQuote) return null;

  return (
    <Wrap>
      <Header>
        <Title>선택한 견적</Title>
        {mode === 'SELF' && <ButtonSmall width={60} text="취소" onClick={onCancel} />}
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
      </Body>
    </Wrap>
  );
}

const Wrap = styled.div`
  background: #fff;
  margin-top: 10px;
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
