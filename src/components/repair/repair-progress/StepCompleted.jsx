// src/components/repair/repair-progress/StepCompleted.jsx
import React from 'react';
import styled from 'styled-components';
import Button from '../../common/Button';
import RepairDetailRows from '../repair-progress/RepairDetailRows';
import { color, typo } from '../../../styles/tokens';
import { useNavigate } from 'react-router-dom';

export default function StepCompleted({ selectedQuote, onWriteReview, hopeAt }) {
  const nav = useNavigate();
  if (!selectedQuote) return null;

  return (
    <>
      <Divider />
      <SectionHeader>수리 정보</SectionHeader>
      <Card>
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
      </Card>
      <StickyFooter>
        <Button text="후기 작성하기" active onClick={onWriteReview} />
      </StickyFooter>
    </>
  );
}

const Divider = styled.div`
  height: 8px;
  background: ${color('grayscale.100')};
  width: 100%;
  margin-top: 6px;
`;
const SectionHeader = styled.div`
  padding: 16px 24px 8px 24px;
  background: #fff;
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;
const Card = styled.div`
  padding: 16px 24px 24px 24px;
  background: #fff;
`;
const StickyFooter = styled.div`
  position: sticky;
  bottom: 10px;
  background: #fff;
  padding: 12px 24px 18px;
`;
