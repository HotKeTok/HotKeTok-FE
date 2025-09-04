import React from 'react';
import Logo from '../assets/common/BrandLogo.png';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import { Column, FlexItem, Row } from '../styles/flex';

export default function SignInTemplate() {
  return (
    <>
      <div style={{ height: '144px' }} />
      <Column $gap={18} $align="center">
        <LogoImg src={Logo} alt="핫케톡로고" />
        <Title>로그인</Title>
      </Column>
    </>
  );
}

const LogoImg = styled.img`
  width: 14.5%;
`;

const Title = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.700')};
`;
