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

      // 토큰 저장
      setTokens({
        accessToken: jwtToken.accessToken,
        refreshToken: jwtToken.refreshToken,
      });

      // 🔹 라우팅 분기
      switch (serverRole) {
        case 'OWNER':
          setRole('landlord');
          navigate('/'); // 집주인 메인
          break;

        case 'TENANT':
          setRole('tenant');
          navigate('/'); // 입주민 메인
          break;

        case 'NONE':
          setRole('tenant'); // NONE도 입주민 플로우 사용
          if (onBoardingStage) {
            // ✅ 이미 초기정보등록 + 인증요청 완료
            navigate('/welcome'); // 인증 전 입주민 전용 UI
          } else {
            // ✅ 첫 로그인 (아직 초기정보등록 전)
            navigate('/init-process');
          }
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
      <Toast show={toast.open} onClose={closeToast} message={toast.message} duration={2000} />
    </>
  );
}
