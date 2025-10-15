import React, { useEffect, useMemo, useState } from 'react';
import TopBar from '../../components/common/TopBar';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import TextField from '../../components/common/TextField';
import { Column, Row, Spacer } from '../../styles/flex';
import ButtonSmall from '../../components/common/ButtonSmall';
import Button from '../../components/common/Button';
import CheckPasswordIcon from '../../assets/common/icon-check-password.svg';
import HidePasswordIcon from '../../assets/common/icon-hide-password.svg';
import ActionGuideModal from '../../components/common/ActionGuideModal';

/** --------------------------- 유틸 --------------------------- */
function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
const getPhoneDigits = formatted => formatted.replace(/\D/g, '');

const ALLOWED_SPECIALS = '!,~,@,$,^,*,(,),_,+';
const allowedSpecialsClass = ALLOWED_SPECIALS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PW_ALLOWED_REGEX = new RegExp(`^[A-Za-z0-9${allowedSpecialsClass}]{9,16}$`);
const PW_HAS_LETTER = /[A-Za-z]/;
const PW_HAS_SPECIAL = new RegExp(`[${allowedSpecialsClass}]`);
function validatePassword(pw) {
  if (!PW_ALLOWED_REGEX.test(pw)) return false;
  if (!PW_HAS_LETTER.test(pw)) return false;
  if (!PW_HAS_SPECIAL.test(pw)) return false;
  return true;
}

/** --------------------------- 템플릿 --------------------------- */
export default function SignUpTemplate({
  onRequestPhone = async () => {},
  onVerifyCode = async () => {},
  onCheckUserId = async () => {},
  onSubmit = async () => {},
  submitting = false,
  requestingPhone = false,
  verifyingCode = false,
  verifyingUserId = false,
}) {
  // 폼 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRe, setPasswordRe] = useState('');

  // 인증/중복확인 관련 UI 상태
  const [isVerifyGuideOpen, setIsVerifyGuideOpen] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  const [phoneRequested, setPhoneRequested] = useState(false); // 전송(재전송) 버튼 라벨 제어
  const [phoneVerified, setPhoneVerified] = useState(null); // null | true | false
  const [verifyMsg, setVerifyMsg] = useState(''); // 인증 성공/실패 문구

  const [idCheckResult, setIdCheckResult] = useState(null); // null | true(가용) | false(중복)

  // 가시성 토글
  const [showPw, setShowPw] = useState(false);
  const [showPwRe, setShowPwRe] = useState(false);

  // 파생 상태
  const phoneDigits = useMemo(() => getPhoneDigits(phone), [phone]);
  const isPhoneComplete = phoneDigits.length === 11;
  const isPasswordValid = useMemo(() => validatePassword(password), [password]);
  const isPasswordReSuccess = useMemo(
    () => password.length > 0 && password === passwordRe && isPasswordValid,
    [password, passwordRe, isPasswordValid]
  );

  // 인증코드 숫자만
  const onChangeVerifyCode = e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerifyCode(digits);
  };

  // 입력 변경 시 결과 초기화
  useEffect(() => {
    // 휴대폰 번호 바뀌면 모든 인증 관련 초기화
    setPhoneRequested(false);
    setPhoneVerified(null);
    setVerifyMsg('');
    if (!isPhoneComplete) {
      setShowVerify(false);
      setVerifyCode('');
    }
  }, [phoneDigits, isPhoneComplete]);

  useEffect(() => {
    // 아이디 변경 시 중복확인 결과 초기화
    setIdCheckResult(null);
  }, [userId]);

  const onChangePhone = e => setPhone(formatPhone(e.target.value));
  const onChangePassword = e => {
    const filtered = e.target.value.replace(
      new RegExp(`[^A-Za-z0-9${allowedSpecialsClass}]`, 'g'),
      ''
    );
    setPassword(filtered);
  };
  const onChangePasswordRe = e => {
    const filtered = e.target.value.replace(
      new RegExp(`[^A-Za-z0-9${allowedSpecialsClass}]`, 'g'),
      ''
    );
    setPasswordRe(filtered);
  };

  // 버튼 클릭 → 페이지 콜백 호출
  const handleRequestPhone = async () => {
    if (!isPhoneComplete) return;
    // 인증 요청 성공/실패와 상관없이 UI는 인증창 열어주고 라벨은 '재전송'으로
    await onRequestPhone({ phoneNumber: phoneDigits });
    setPhoneRequested(true);
    setShowVerify(true);
    setIsVerifyGuideOpen(true);
  };

  const handleVerifyCode = async () => {
    if (!verifyCode) return;
    const res = await onVerifyCode({ phoneNumber: phoneDigits, code: verifyCode });
    // 페이지 콜백이 { success: boolean, message?: string } 리턴한다고 가정
    if (res?.success) {
      setPhoneVerified(true);
      setVerifyMsg('인증번호가 일치해요.');
    } else {
      setPhoneVerified(false);
      // 서버 예시 메시지: "인증번호가 일치하지 않아요"
      setVerifyMsg(res?.message || '인증번호가 일치하지 않아요.');
    }
  };

  const handleCheckUserId = async () => {
    if (!userId) return;
    const res = await onCheckUserId({ logInId: userId });
    if (res?.success) setIdCheckResult(true);
    else setIdCheckResult(false);
  };

  const handleSubmit = async () => {
    if (!name || !isPhoneComplete || !userId || !isPasswordValid || !isPasswordReSuccess) return;
    await onSubmit({
      name,
      logInId: userId,
      password,
      phoneNumber: phoneDigits,
    });
  };

  // 휴대폰 버튼 라벨/비활성 계산
  const phoneBtnText = phoneRequested ? '재전송' : '인증하기';
  const phoneBtnDisabled = requestingPhone || phoneVerified === true; // 인증 완료되면 비활성

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
              onChange={e => setName(e.target.value)}
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
                maxLength={13}
                disabled={phoneVerified === true} // 인증 성공 시 입력창 잠금
              />
              <ButtonSmall
                active={isPhoneComplete && !phoneBtnDisabled}
                text={requestingPhone ? '전송중...' : phoneBtnText}
                width={100}
                onClick={handleRequestPhone}
                disabled={phoneBtnDisabled}
              />
            </Row>

            <ActionGuideModal
              isOpen={isVerifyGuideOpen}
              titleComponent={
                <CustomTitle>{`${phone}으로 \n인증코드가 전송되었어요!`}</CustomTitle>
              }
              description={
                <div style={{ textAlign: 'center' }}>
                  인증코드를 확인하고 휴대폰 번호 인증을 완료해주세요.
                </div>
              }
              onClose={() => setIsVerifyGuideOpen(false)}
              onConfirm={() => setIsVerifyGuideOpen(false)}
              confirmText="닫기"
              showClose={false}
            />

            {showVerify && (
              <>
                <Row $gap={6}>
                  <TextField
                    placeholder={'인증번호 입력'}
                    value={verifyCode}
                    onChange={onChangeVerifyCode}
                    inputMode="numeric"
                    maxLength={6}
                    disabled={phoneVerified === true} // 인증 성공 시 입력창 잠금 (선호에 따라 유지/해제)
                  />
                  <ButtonSmall
                    active={verifyCode.length > 0 && phoneVerified !== true}
                    text={verifyingCode ? '확인중...' : '확인'}
                    width={100}
                    onClick={handleVerifyCode}
                    disabled={verifyingCode || phoneVerified === true} // 인증 성공 시 비활성화
                  />
                </Row>

                {/* 인증 결과 메시지 */}
                {phoneVerified === true && (
                  <Infotext style={{ color: '#01D281' }}>인증번호가 일치해요.</Infotext>
                )}
                {phoneVerified === false && (
                  <Infotext style={{ color: '#FF3F3F' }}>
                    {verifyMsg || '인증번호가 일치하지 않아요.'}
                  </Infotext>
                )}
              </>
            )}
          </Column>

          <Column $gap={4}>
            <TextFieldTitle>아이디</TextFieldTitle>
            <Row $gap={6}>
              <TextField
                placeholder={'아이디 입력'}
                value={userId}
                onChange={e => setUserId(e.target.value)}
              />
              <ButtonSmall
                active={userId.length > 0 && idCheckResult !== true}
                text={verifyingUserId ? '확인중...' : '중복확인'}
                width={100}
                onClick={handleCheckUserId}
                disabled={verifyingUserId || idCheckResult === true} // 사용 가능으로 확정되면 비활성
              />
            </Row>
            {/* 아이디 중복확인 결과 문구 */}
            {idCheckResult === true && (
              <Infotext style={{ color: '#01D281' }}>사용 가능한 아이디예요.</Infotext>
            )}
            {idCheckResult === false && (
              <Infotext style={{ color: '#FF3F3F' }}>이미 존재하는 아이디예요.</Infotext>
            )}
            {idCheckResult === null && <Infotext>6~20자 이내로 입력해 주세요.</Infotext>}
          </Column>

          <Column $gap={4}>
            <TextFieldTitle>비밀번호</TextFieldTitle>
            <TextField
              placeholder={'비밀번호'}
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={onChangePassword}
              maxLength={16}
              rightIcon={showPw ? HidePasswordIcon : CheckPasswordIcon}
              onRightIconClick={() => setShowPw(v => !v)}
              rightIconAriaLabel={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
            />
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
              maxLength={16}
              rightIcon={showPwRe ? HidePasswordIcon : CheckPasswordIcon}
              onRightIconClick={() => setShowPwRe(v => !v)}
              rightIconAriaLabel={showPwRe ? '비밀번호 숨기기' : '비밀번호 보기'}
            />
            {passwordRe.length > 0 &&
              (isPasswordReSuccess ? (
                <HelperText $status="success">비밀번호가 일치해요.</HelperText>
              ) : (
                <HelperText $status="error">비밀번호가 일치하지 않아요.</HelperText>
              ))}
            {isPasswordValid ? null : (
              <Infotext>
                영문 대소문자와 특수문자를 조합하여 9~16자리까지 가능하며,
                <br />
                특수문자는 !,~,@,$,^,*,(,),_,+ 만 사용이 가능해요.
              </Infotext>
            )}
          </Column>
        </FormWrapper>

        <Spacer />

        <div style={{ padding: '30px 24px' }}>
          <Button
            text={submitting ? '가입 중...' : '가입하기'}
            onClick={handleSubmit}
            disabled={submitting}
            active={name && phoneVerified && idCheckResult && isPasswordReSuccess}
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
  color: ${p =>
    p.$status === 'error'
      ? '#ff3f3f'
      : p.$status === 'success'
      ? color('brand.primary')
      : color('grayscale.400')};
`;
const CustomTitle = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.800')};
  white-space: pre-wrap;
`;
