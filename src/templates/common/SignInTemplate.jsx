import React, { useState } from 'react';
import Logo from '../../assets/common/BrandLogo.svg';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

import IconChecked from '../../assets/common/icon-check-filled.svg';
import IconNotChecked from '../../assets/common/icon-check-not-filled.svg';

export default function SignInTemplate({ onSubmit = () => {}, loading = false }) {
  const nav = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null); // ✅ 역할 상태 추가 (TENANT or OWNER)

  const canSubmit = userId && password && role && !loading;
  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ logInId: userId, password, role });
  };
  const moveSignUp = () => {
    nav('/sign-up');
  };

  // ✅ 역할 클릭 시 변경 함수
  const handleRoleSelect = selectedRole => {
    setRole(selectedRole);
  };

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ height: '15%' }} />
      <Column $gap={6} $align="center">
        <LogoImg src={Logo} alt="핫케톡로고" />
        <Title>로그인</Title>
      </Column>
      <div style={{ height: '90px' }} />
      <div style={{ padding: '0px 24px' }}>
        <Column $gap={40}>
          <Column $gap={14}>
            {/* 회원 유형 선택 */}
            <Column $gap={4}>
              <TextFieldTitle>회원 유형</TextFieldTitle>
              <Row $gap={30} style={{ margin: '10px 0px' }}>
                <RadioWrapper $gap={10} onClick={() => handleRoleSelect('TENANT')}>
                  <IconCheck
                    src={role === 'TENANT' ? IconChecked : IconNotChecked}
                    alt="입주민 선택"
                  />
                  <RoleText>입주민</RoleText>
                </RadioWrapper>

                <RadioWrapper $gap={10} onClick={() => handleRoleSelect('OWNER')}>
                  <IconCheck
                    src={role === 'OWNER' ? IconChecked : IconNotChecked}
                    alt="집주인 선택"
                  />
                  <RoleText>집주인</RoleText>
                </RadioWrapper>
              </Row>
            </Column>

            {/* 아이디 입력 */}
            <Column $gap={4}>
              <TextFieldTitle>아이디</TextFieldTitle>
              <TextField
                placeholder={'아이디를 입력해 주세요.'}
                value={userId}
                onChange={e => setUserId(e.target.value)}
              />
            </Column>

            {/* 비밀번호 입력 */}
            <Column $gap={4}>
              <TextFieldTitle>비밀번호</TextFieldTitle>
              <TextField
                type="password"
                placeholder={'비밀번호를 입력해 주세요.'}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Column>
          </Column>

          {/* 로그인/회원가입 버튼 */}
          <Column $gap={30} $align="center">
            <Button
              text={loading ? '로그인 중...' : '로그인'}
              onClick={handleSubmit}
              disabled={!canSubmit}
            />
            <SignUpButtonText onClick={moveSignUp}>회원가입</SignUpButtonText>
          </Column>
        </Column>
      </div>
    </div>
  );
}

/* =============================
 * Styled Components
 * ============================= */

const LogoImg = styled.img``;

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

const RoleText = styled.div`
  ${typo('button2')}
  color : ${color('grayscale.700')};
`;

const IconCheck = styled.img`
  width: 22px;
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
`;
