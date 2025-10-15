// src/pages/common/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpTemplate from '../../templates/common/SignUpTemplate';
import ActionGuideModal from '../../components/common/ActionGuideModal';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { apiSignUp, apiPhoneSend, apiPhoneVerify, apiIdVerify } from '../../api/auth';

export default function SignUp() {
  const navigate = useNavigate();

  // 로딩 상태
  const [submitting, setSubmitting] = useState(false);
  const [requestingPhone, setRequestingPhone] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyingUserId, setVerifyingUserId] = useState(false);

  // 가입 성공 모달 상태
  const [successOpen, setSuccessOpen] = useState(false);
  const [welcomeName, setWelcomeName] = useState('하케톡');

  // 가입 실패 모달
  const [signUpErrorOpen, setSignUpErrorOpen] = useState(false);

  // 휴대폰 인증번호 전송
  const onRequestPhone = async ({ phoneNumber }) => {
    try {
      setRequestingPhone(true);
      const res = await apiPhoneSend({ phoneNumber });
      return { success: !!res?.success };
    } catch (e) {
      return { success: false, message: e?.response?.data?.message };
    } finally {
      setRequestingPhone(false);
    }
  };

  // 인증번호 검증
  const onVerifyCode = async ({ phoneNumber, code }) => {
    try {
      setVerifyingCode(true);
      const res = await apiPhoneVerify({ phoneNumber, code });
      if (res?.success) {
        return { success: true, message: res?.data?.result };
      }
      return { success: false, message: '인증번호가 일치하지 않아요.' };
    } catch (e) {
      const msg = e?.response?.data?.data?.message || e?.response?.data?.message || e.message;
      return { success: false, message: msg };
    } finally {
      setVerifyingCode(false);
    }
  };

  // 아이디 중복확인
  const onCheckUserId = async ({ logInId }) => {
    try {
      setVerifyingUserId(true);
      const res = await apiIdVerify({ logInId });
      return { success: !!res?.success };
    } catch {
      return { success: false };
    } finally {
      setVerifyingUserId(false);
    }
  };

  // 최종 회원가입
  const onSubmit = async ({ name, logInId, password, phoneNumber }) => {
    try {
      setSubmitting(true);
      const res = await apiSignUp({ name, logInId, password, phoneNumber });
      if (res?.success) {
        setWelcomeName(res?.data?.name || '하케톡');
        setSuccessOpen(true);
      } else {
        setSignUpErrorOpen(true);
      }
    } catch {
      setSignUpErrorOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const goSignIn = () => {
    setSuccessOpen(false);
    navigate('/sign-in');
  };

  return (
    <>
      <SignUpTemplate
        onRequestPhone={onRequestPhone}
        onVerifyCode={onVerifyCode}
        onCheckUserId={onCheckUserId}
        onSubmit={onSubmit}
        submitting={submitting}
        requestingPhone={requestingPhone}
        verifyingCode={verifyingCode}
        verifyingUserId={verifyingUserId}
      />

      {/* 가입 성공 모달 */}
      <ActionGuideModal
        isOpen={successOpen}
        titleComponent={
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <CustomTitle>{`환영합니다 ${welcomeName}님!\n회원가입이 완료되었어요`}</CustomTitle>
          </div>
        }
        description={
          <div style={{ textAlign: 'center' }}>회원가입 정보로 바로 로그인 하시겠어요?</div>
        }
        onConfirm={goSignIn}
        confirmText="로그인"
        showClose={false}
      />

      {/* 가입 실패 모달 */}
      <ActionGuideModal
        isOpen={signUpErrorOpen}
        titleComponent={
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <CustomTitle>{'동일한 전화번호로\n이미 가입한 계정이 있어요'}</CustomTitle>
          </div>
        }
        description={<div style={{ textAlign: 'center' }}>다른 전화번호로 인증해 주세요</div>}
        onClose={() => setSignUpErrorOpen(false)}
        onConfirm={() => setSignUpErrorOpen(false)}
        confirmText="닫기"
        showClose={false}
      />
    </>
  );
}

const CustomTitle = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.800')};
  white-space: pre-wrap;
`;
