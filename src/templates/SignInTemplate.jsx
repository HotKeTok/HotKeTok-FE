import React from 'react';
import Logo from '../assets/common/BrandLogo.png';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import { Column, FlexItem, Row } from '../styles/flex';
import TextField from '../components/common/TextField';

export default function SignInTemplate() {
  return (
    <div style={{ height: '100vh' }}>
      <div style={{ height: '15%' }} />
      <Column $gap={18} $align="center">
        <LogoImg src={Logo} alt="핫케톡로고" />
        <Title>로그인</Title>
      </Column>
      <div style={{ height: '90px' }} />
      <Column $gap={14}>
        <Column $gap={4}>
          <TextFieldTitle>아이디</TextFieldTitle>
          <TextField placeholder={'아이디를 입력해 주세요.'} />
        </Column>
        <Column $gap={4}>
          <TextFieldTitle>비밀번호</TextFieldTitle>
          <TextField placeholder={'비밀번호를 입력해 주세요.'} />
        </Column>
      </Column>
    </div>
  );
}

const LogoImg = styled.img`
  width: 14.5%;
`;

const Title = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.700')};
`;

const TextFieldTitle = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;
