// src/pages/common/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpTemplate from '../../templates/common/SignUpTemplate';
import Toast from '../../components/common/Toast';
import ActionGuideModal from '../../components/common/ActionGuideModal';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { apiSignUp, apiPhoneSend, apiPhoneVerify, apiIdVerify } from '../../api/auth';

export default function SignUp() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ open: false, message: '' });

  // 로딩 상태
  const [submitting, setSubmitting] = useState(false);
  const [requestingPhone, setRequestingPhone] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyingUserId, setVerifyingUserId] = useState(false);

  // 가입 성공 모달 상태
  const [successOpen, setSuccessOpen] = useState(false);
  const [welcomeName, setWelcomeName] = useState('하케톡');

  const openToast = message => setToast({ open: true, message });
  const closeToast = () => setToast({ open: false, message: '' });

  // 휴대폰 인증번호 전송
  const onRequestPhone = async ({ phoneNumber }) => {
    try {
      setRequestingPhone(true);
      const res = await apiPhoneSend({ phoneNumber });
      if (res?.success) openToast('인증번호를 전송했어요.');
      else openToast('인증번호 전송에 실패했어요.');
      return { success: !!res?.success };
    } catch (e) {
      openToast(e?.response?.data?.message || e.message || '인증번호 전송 중 오류가 발생했어요.');
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
        openToast(res?.data?.result || '인증이 완료되었어요.');
        return { success: true, message: res?.data?.result };
      } else {
        openToast('인증번호가 일치하지 않아요.');
        return { success: false, message: '인증번호가 일치하지 않아요.' };
      }
    } catch (e) {
      const msg = e?.response?.data?.data?.message || e?.response?.data?.message || e.message;
      openToast(msg || '인증 확인 중 오류가 발생했어요.');
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
      if (res?.success) {
        openToast('사용 가능한 아이디예요.');
        return { success: true };
      } else {
        openToast('이미 존재하는 아이디예요.');
        return { success: false };
      }
    } catch (e) {
      const msg =
        e?.response?.data?.data?.message ||
        e?.response?.data?.message ||
        '이미 존재하는 아이디예요.';
      openToast(msg);
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
        // 토스트 대신 축하 모달로
        setWelcomeName(res?.data?.name || '하케톡');
        setSuccessOpen(true);
      } else {
        openToast('회원가입에 실패했어요.');
      }
    } catch (e) {
      openToast(e?.response?.data?.message || e.message || '회원가입 중 오류가 발생했어요.');
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
          <div style={{ textAlign: 'center' }}>{'회원가입 정보로 바로 로그인 하시겠어요?'}</div>
        }
        onConfirm={goSignIn} // 버튼 클릭 시 로그인 화면으로
        confirmText="로그인"
        showClose={false}
      />

      <Toast isOpen={toast.open} onClose={closeToast} message={toast.message} duration={2000} />
    </>
  );
}

const CustomTitle = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.800')};
  white-space: pre-wrap;
`;
