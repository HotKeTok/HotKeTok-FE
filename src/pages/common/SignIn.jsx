// src/pages/common/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInTemplate from '../../templates/common/SignInTemplate';
import Toast from '../../components/common/Toast';
import { apiLogin } from '../../api/auth';
import { setTokens, setRole } from '../../utils/auth';

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '' });

  const openToast = message => setToast({ open: true, message });
  const closeToast = () => setToast({ open: false, message: '' });

  const handleSubmit = async ({ logInId, password, role }) => {
    try {
      setLoading(true);
      const res = await apiLogin({ logInId, password, role });
      const { jwtToken, role: serverRole, onBoardingStage } = res.data;

      setTokens({
        accessToken: jwtToken.accessToken,
        refreshToken: jwtToken.refreshToken,
      });

      switch (serverRole) {
        case 'OWNER':
          setRole('landlord');
          navigate('/');
          break;
        case 'TENANT':
          setRole('tenant');
          navigate('/');
          break;
        case 'NONE':
          setRole('tenant');
          if (onBoardingStage) navigate('/welcome'); // onBoardingStage가 true면 초기등록 한 상태
          else navigate('/init-process'); // onBoardingStage가 false면 초기등록 안 한 상태
          break;
        default:
          openToast('알 수 없는 사용자 유형이에요.');
          break;
      }
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) {
        openToast('존재하지 않는 계정이에요.');
      } else if (status === 400) {
        openToast('비밀번호가 일치하지 않아요.');
      } else {
        openToast('로그인에 실패했어요.');
      }
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
        icon={'warning'} // ✅ 아이콘 전달
        duration={1000}
      />
    </>
  );
}
