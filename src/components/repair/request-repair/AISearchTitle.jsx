import React from 'react';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import animationData from '../../../assets/lottie/animation-search.json';
import { typo, color } from '../../../styles/tokens';

export default function AISearchTitle() {
  return (
    <Wrap>
      <Title>증상 사진을 꼼꼼히 분석 중이에요..</Title>
      <Lottie animationData={animationData} loop autoplay style={{ width: 140, height: 140 }} />
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
`;
