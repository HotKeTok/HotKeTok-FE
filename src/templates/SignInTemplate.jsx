import React from 'react';
import Logo from '../assets/common/BrandLogo.png';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import { Column } from '../styles/flex';
import TextField from '../components/common/TextField';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function SignInTemplate() {
  const nav = useNavigate();

  const moveSignUp = () => {
    nav('/signUp');
  };
  return (
    <div style={{ height: '100vh' }}>
      <div style={{ height: '15%' }} />
      <Column $gap={18} $align="center">
        <LogoImg src={Logo} alt="핫케톡로고" />
        <Title>로그인</Title>
      </Column>
      <div style={{ height: '90px' }} />
      <div style={{ padding: '0px 24px' }}>
        <Column $gap={40}>
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
          <Column $gap={30} $align="center">
            <Button text="로그인" />
            <SignUpButtonText onClick={moveSignUp}>회원가입</SignUpButtonText>
          </Column>
        </Column>
      </div>
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

const SignUpButtonText = styled.div`
  ${typo('button2')}
  color : ${color('grayscale.600')};
  cursor: pointer;
`;
