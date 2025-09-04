import React from 'react';
import TopBar from '../components/common/TopBar';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import TextField from '../components/common/TextField';
import { Column, Row, Spacer } from '../styles/flex';
import ButtonSmall from '../components/common/ButtonSmall';
import Button from '../components/common/Button';

export default function SignUp() {
  return (
    <>
      <Container>
        <TopBar title={'회원가입'} />
        <FormWrapper>
          <Column $gap={4}>
            <TextFieldTitle>이름</TextFieldTitle>
            <TextField placeholder={'이름 입력'} />
          </Column>
          <Column $gap={4}>
            <TextFieldTitle>휴대폰 번호</TextFieldTitle>
            <Row $gap={6}>
              <TextField placeholder={'휴대폰 번호 입력'} />
              <ButtonSmall active={false} text="인증하기" width={100} />
            </Row>
          </Column>
          <Column $gap={4}>
            <TextFieldTitle>아이디</TextFieldTitle>
            <TextField placeholder={'아이디 입력'} />
            <Infotext>6~20자 이내로 입력해 주세요.</Infotext>
          </Column>
          <Column $gap={4}>
            <TextFieldTitle>비밀번호</TextFieldTitle>
            <TextField placeholder={'비밀번호'} />
            <TextField placeholder={'비밀번호 재확인'} />
            <Infotext>
              영문 대소문자와 특수문자를 조합하여 9~16자리까지 가능하며,
              <br />
              특수문자는 ~,@,$,^,*,(,),_,+ 만 사용이 가능해요.
            </Infotext>
          </Column>
        </FormWrapper>
        <Spacer />
        <div style={{ padding: '30px 24px' }}>
          <Button text="가입하기" />
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 24px;
  gap: 30px;
`;

const TextFieldTitle = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;

const Infotext = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
`;
