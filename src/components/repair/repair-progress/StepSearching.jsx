// src/components/repair/repair-progress/StepSearching.jsx
import React from 'react';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';

export default function StepSearching() {
  return (
    <>
      <div style={{ height: '10px', backgroundColor: '#F5F6F6' }} />
      <Box>
        <Title>받은 견적</Title>
        <Desc>아직 견적서가 도착하지 않았어요.</Desc>
      </Box>
    </>
  );
}

const Box = styled.div`
  background: #fff;
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
