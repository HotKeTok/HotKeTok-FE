import React, { useEffect, useMemo, useState } from 'react';
import TopBar from '../components/common/TopBar';
import styled from 'styled-components';
import { color, typo } from '../styles/tokens';
import TextField from '../components/common/TextField';
import { Column, Row, Spacer } from '../styles/flex';
import ButtonSmall from '../components/common/ButtonSmall';
import Button from '../components/common/Button';
import CheckPasswordIcon from '../assets/common/icon-check-password.svg';
import HidePasswordIcon from '../assets/common/icon-hide-password.svg';

/** ---------------------------
 * 유틸: 휴대폰 번호 포맷터 (010-1234-5678)
 * - 숫자 외 제거 → 11자리까지 제한 → 하이픈 삽입
 * -------------------------- */
function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11); // 숫자만 + 11자리 제한
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
const getPhoneDigits = (formatted) => formatted.replace(/\D/g, '');

/** ---------------------------
 * 비밀번호 규칙
 * - 길이: 9~16
 * - 허용문자: 영문 대/소문자 + 숫자 + ~,@,$,^,*,(,),_,+
 * - 최소 하나의 영문자, 최소 하나의 특수문자 포함
 * -------------------------- */
const ALLOWED_SPECIALS = '!,~,@,$,^,*,(,),_,+';
const allowedSpecialsClass = ALLOWED_SPECIALS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// 전체 허용 문자 세트: 영문 + 숫자 + 특수문자
const PW_ALLOWED_REGEX = new RegExp(`^[A-Za-z0-9${allowedSpecialsClass}]{9,16}$`);
const PW_HAS_LETTER = /[A-Za-z]/;
const PW_HAS_SPECIAL = new RegExp(`[${allowedSpecialsClass}]`);

function validatePassword(pw) {
  if (!PW_ALLOWED_REGEX.test(pw)) return false;
  if (!PW_HAS_LETTER.test(pw)) return false;
  if (!PW_HAS_SPECIAL.test(pw)) return false;
  return true;
}
export default function SignUpTemplate() {
  // 폼 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(''); // 화면에 보여줄 포맷된 값
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRe, setPasswordRe] = useState('');

  const [showVerify, setShowVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  // 가시성 토글 상태
  const [showPw, setShowPw] = useState(false);
  const [showPwRe, setShowPwRe] = useState(false);

  // 파생 상태
  const phoneDigits = useMemo(() => getPhoneDigits(phone), [phone]);
  const isPhoneComplete = phoneDigits.length === 11;

  const isPasswordValid = useMemo(() => validatePassword(password), [password]);
  // 재확인 성공 기준: “위 비밀번호와 값이 일치” + (현실적으로 유효 비번과 일치해야 success가 의미 있어)
  const isPasswordReSuccess = useMemo(
    () => password.length > 0 && password === passwordRe && isPasswordValid,
    [password, passwordRe, isPasswordValid]
  );

  // ✅ 인증번호 숫자만 입력
  const onChangeVerifyCode = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6); // 보통 6자리 제한 예시
    setVerifyCode(digits);
  };

  // ✅ 휴대폰 번호가 불완전해지면 인증 UI/값 리셋
  useEffect(() => {
    if (!isPhoneComplete) {
      setShowVerify(false);
      setVerifyCode('');
    }
  }, [isPhoneComplete]);

  // 핸들러
  const onChangePhone = (e) => {
    const next = formatPhone(e.target.value);
    setPhone(next);
  };

  const onChangePassword = (e) => {
    const next = e.target.value;
    const filtered = next.replace(new RegExp(`[^A-Za-z0-9${allowedSpecialsClass}]`, 'g'), '');
    setPassword(filtered);
  };

  const onChangePasswordRe = (e) => {
    const next = e.target.value;
    const filtered = next.replace(new RegExp(`[^A-Za-z0-9${allowedSpecialsClass}]`, 'g'), '');
    setPasswordRe(filtered);
  };
  return (
    <>
      <Container>
        <TopBar title={'회원가입'} />
        <FormWrapper>
          <Column $gap={4}>
            <TextFieldTitle>이름</TextFieldTitle>
            <TextField
              placeholder={'이름 입력'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Column>

          <Column $gap={4}>
            <TextFieldTitle>휴대폰 번호</TextFieldTitle>
            <Row $gap={6}>
              <TextField
                placeholder={'휴대폰 번호 입력'}
                value={phone}
                onChange={onChangePhone}
                inputMode="numeric"
                // 하이픈 포함 최대 13자(010-1234-5678)
                maxLength={13}
                // 시각적 상태: 11자리면 success로 보여주고 싶다면 아래 주석 해제
                state={isPhoneComplete ? 'success' : undefined}
              />
              <ButtonSmall
                active={isPhoneComplete} // 2) 11자리면 활성화
                text="인증하기"
                width={100}
                onClick={() => setShowVerify(true)} // ✅ 누르면 인증 UI 등장
              />
            </Row>
            {showVerify && (
              <Row $gap={6}>
                <TextField
                  placeholder={'인증번호 입력'}
                  value={verifyCode} // ✅ 별도 상태 사용
                  onChange={onChangeVerifyCode} // ✅ 숫자만 필터
                  inputMode="numeric"
                  maxLength={6}
                  state={verifyCode.length > 0 ? 'success' : undefined}
                />
                <ButtonSmall
                  active={verifyCode.length > 0} // ✅ 값이 있으면 활성화(원하면 길이 조건 넣어도 됨)
                  text="확인"
                  width={100}
                  onClick={() => {
                    // TODO: 인증번호 검증 로직
                    // ex) verifyCode 서버 전송 → 성공 시 다음 단계로
                  }}
                />
              </Row>
            )}
          </Column>

          <Column $gap={4}>
            <TextFieldTitle>아이디</TextFieldTitle>
            <TextField
              placeholder={'아이디 입력'}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Infotext>6~20자 이내로 입력해 주세요.</Infotext>
          </Column>

          <Column $gap={4}>
            <TextFieldTitle>비밀번호</TextFieldTitle>
            <TextField
              placeholder={'비밀번호'}
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={onChangePassword}
              state={password.length === 0 ? undefined : isPasswordValid ? 'success' : 'error'}
              maxLength={16}
              // 우측 아이콘 + 클릭으로 토글
              rightIcon={showPw ? HidePasswordIcon : CheckPasswordIcon}
              onRightIconClick={() => setShowPw((v) => !v)}
              rightIconAriaLabel={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
            />
            {/* ✅ helper 텍스트 */}
            {password.length > 0 &&
              (isPasswordValid ? (
                <HelperText $status="success">사용 가능한 비밀번호예요.</HelperText>
              ) : (
                <HelperText $status="error">
                  특수문자는 !,~,@,$,^,*,(,),_,+ 만 사용이 가능해요.
                </HelperText>
              ))}
            <TextField
              placeholder={'비밀번호 재확인'}
              type={showPwRe ? 'text' : 'password'}
              value={passwordRe}
              onChange={onChangePasswordRe}
              state={
                passwordRe.length === 0 ? undefined : isPasswordReSuccess ? 'success' : 'error'
              }
              maxLength={16}
              rightIcon={showPwRe ? HidePasswordIcon : CheckPasswordIcon}
              onRightIconClick={() => setShowPwRe((v) => !v)}
              rightIconAriaLabel={showPwRe ? '비밀번호 숨기기' : '비밀번호 보기'}
            />
            {passwordRe.length > 0 &&
              (isPasswordReSuccess ? (
                <HelperText $status="success">비밀번호가 일치해요.</HelperText>
              ) : (
                <HelperText $status="error">비밀번호가 일치하지 않아요.</HelperText>
              ))}
            <Infotext>
              영문 대소문자와 특수문자를 조합하여 9~16자리까지 가능하며,
              <br />
              특수문자는 !,~,@,$,^,*,(,),_,+ 만 사용이 가능해요.
            </Infotext>
          </Column>
        </FormWrapper>

        <Spacer />

        <div style={{ padding: '30px 24px' }}>
          <Button
            text="가입하기"
            onClick={() => {
              // 최종 제출 시 서버 검증과 함께 한 번 더 체크 권장
              // console.log({ name, phoneDigits, userId, password });
            }}
          />
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

const HelperText = styled.div`
  ${typo('caption2')};
  color: ${(p) =>
    p.$status === 'error'
      ? '#ff3f3f'
      : p.$status === 'success'
      ? color('brand.primary')
      : color('grayscale.400')};
`;
