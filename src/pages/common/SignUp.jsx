import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpTemplate from '../../templates/common/SignUpTemplate';
import Toast from '../../components/common/Toast';
import { apiSignUp, apiPhoneSend, apiPhoneVerify, apiIdVerify } from '../../api/auth';

export default function SignUp() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ open: false, message: '' });

  // 로딩 스피너 상태
  const [submitting, setSubmitting] = useState(false);
  const [requestingPhone, setRequestingPhone] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyingUserId, setVerifyingUserId] = useState(false);

  const openToast = message => setToast({ open: true, message });
  const closeToast = () => setToast({ open: false, message: '' });

  // 1) 인증번호 요청
  const onRequestPhone = async ({ phoneNumber }) => {
    try {
      setRequestingPhone(true);
      const res = await apiPhoneSend({ phoneNumber });
      if (res?.success) openToast('인증번호를 전송했어요.');
      else openToast('인증번호 전송에 실패했어요.');
    } catch (e) {
      openToast(e.message || '인증번호 전송 중 오류가 발생했어요.');
    } finally {
      setRequestingPhone(false);
    }
  };

  // 2) 인증번호 검증
  const onVerifyCode = async ({ phoneNumber, code }) => {
    try {
      setVerifyingCode(true);
      const res = await apiPhoneVerify({ phoneNumber, code });
      if (res?.success) openToast(res?.data?.result || '인증이 완료되었어요.');
      else openToast('인증번호가 일치하지 않아요.');
    } catch (e) {
      openToast(e.message || '인증 확인 중 오류가 발생했어요.');
    } finally {
      setVerifyingCode(false);
    }
  };

  // 3) 아이디 중복확인
  const onCheckUserId = async ({ logInId }) => {
    try {
      setVerifyingUserId(true);
      const res = await apiIdVerify({ logInId });
      // 명세 응답 예시: data.result에 문자열 반환 (예: "jerrymin")
      // 서버 쪽 정책에 따라 "중복" / "사용가능" 등 메시지가 다를 수 있어 그대로 노출
      if (res?.success) openToast(res?.data?.result || '확인되었어요.');
      else openToast('아이디 확인에 실패했어요.');
    } catch (e) {
      openToast(e.message || '아이디 확인 중 오류가 발생했어요.');
    } finally {
      setVerifyingUserId(false);
    }
  };

  // 4) 최종 회원가입
  const onSubmit = async ({ name, logInId, password, phoneNumber }) => {
    try {
      setSubmitting(true);
      const res = await apiSignUp({ name, logInId, password, phoneNumber });
      if (res?.success) {
        openToast(`${res?.data?.name || '회원'}님, 가입이 완료되었어요.`);
        // 온보딩 or 로그인 페이지로 이동 (선호에 맞게)
        setTimeout(() => navigate('/sign-in'), 300); // UX상 짧게 대기
      } else {
        openToast('회원가입에 실패했어요.');
      }
    } catch (e) {
      openToast(e.message || '회원가입 중 오류가 발생했어요.');
    } finally {
      setSubmitting(false);
    }
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
      <Toast isOpen={toast.open} onClose={closeToast} message={toast.message} duration={2000} />
    </>
  );
}
