// src/pages/common/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInTemplate from '../../templates/common/SignInTemplate';
import Toast from '../../components/common/Toast';
import { apiLogin } from '../../api/auth';
import { useAuthStore } from '../../store/useAuthStore';

export default function SignIn() {
  const navigate = useNavigate();
  const setRole = useAuthStore(s => s.setRole);
  const setTokens = useAuthStore(s => s.setTokens);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '' });

  const openToast = message => setToast({ open: true, message });
  const closeToast = () => setToast({ open: false, message: '' });

  const handleSubmit = async ({ logInId, password, role }) => {
    try {
      setLoading(true);
      const res = await apiLogin({ logInId, password, role });
      const { jwtToken, role: serverRole, onBoardingStageFlag } = res.data;

      setTokens({
        accessToken: jwtToken.accessToken,
        refreshToken: jwtToken.refreshToken,
      });

      if (serverRole === 'OWNER') {
        setRole('landlord');
        navigate('/', { replace: true }); // ✅ 경로 그대로 사용
        return;
      }
      if (serverRole === 'TENANT') {
        setRole('tenant');
        navigate('/', { replace: true }); // ✅ 경로 그대로 사용
        return;
      }
      if (serverRole === 'NONE') {
        setRole('tenant');
        if (onBoardingStageFlag) navigate('/welcome', { replace: true }); // ✅ 기존 '/welcome' 유지
        else navigate('/init-process', { replace: true });
        return;
      }

      openToast('알 수 없는 사용자 유형이에요.');
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) openToast('존재하지 않는 계정이에요.');
      else if (status === 400) openToast('비밀번호가 일치하지 않아요.');
      else openToast('로그인에 실패했어요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignInTemplate onSubmit={handleSubmit} loading={loading} />
      <Toast
        show={toast.open}
        onClose={closeToast}
        message={toast.message}
        icon="warning"
        duration={1000}
      />
    </>
  );
}
