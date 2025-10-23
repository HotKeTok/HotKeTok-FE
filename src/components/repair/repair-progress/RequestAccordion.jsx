// src/components/repair/repair-progress/RequestAccordion.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import RequestSummary from '../RequestSummary';

export default function RequestAccordion({ request, mode }) {
  const [open, setOpen] = useState(true);

  return (
    <Accordion>
      <Header onClick={() => setOpen(o => !o)}>
        <Title>요청서</Title>
        <Chevron $open={open} />
      </Header>

      {open && (
        <Body>
          <RequestSummary
            context={{
              typeKey: 'etc',
              fullDateLabel: request.hopeAt, // 완성된 문자열 그대로 사용
              payer: mode === 'SELF' ? 'me' : 'landlord',
              images: request.images,
              desc: request.description,
              useAI: false,
            }}
            address={request.address}
            repairTypes={[{ key: 'etc', label: request.categoryLabel }]}
          />
        </Body>
      )}
    </Accordion>
  );
}

const Accordion = styled.div`
  background: #fff;
  margin-top: 10px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  cursor: pointer;
`;
const Title = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;
const Chevron = styled.div`
  width: 6px;
  height: 6px;
  display: inline-block;
  border-right: 2px solid ${color('grayscale.500')};
  border-bottom: 2px solid ${color('grayscale.500')};
  transform: rotate(${p => (p.$open ? '-135deg' : '45deg')});
  transition: transform 0.2s ease;
`;
const Body = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${color('grayscale.200')};
`;
