// src/pages/landlord/my/L_MyPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import L_MyPageTemplate from '../../../templates/landlord/my/L_MyPageTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  fetchMyInfo,
  fetchCurrentAddress,
  updateMyInfo,
  changeCurrentAddress,
} from '../../../api/myPage';

// 전화번호 하이픈
function formatPhone(p) {
  if (!p) return '';
  const only = String(p).replace(/\D/g, '');
  if (only.length === 11) return `${only.slice(0, 3)}-${only.slice(3, 7)}-${only.slice(7)}`;
  if (only.length === 10) return `${only.slice(0, 3)}-${only.slice(3, 6)}-${only.slice(6)}`;
  return p;
}

export default function MyPage() {
  const accessToken = useAuthStore(s => s.accessToken);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    logInId: '',
    address: '',
  });

  // 최초/토큰 변경 시 데이터 조회
  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        // 1) 기본 정보
        const infoRes = await fetchMyInfo(accessToken);
        const info = infoRes?.data?.data || {};
        const nextUser = {
          name: info.name || '',
          phoneNumber: formatPhone(info.phoneNumber || ''),
          logInId: info.logInId || '',
          address: info.address || '', // 비어 있을 수 있음
        };

        // 2) 현재 주소/세대번호 (명세상 POST body 존재 → 기본은 빈 객체)
        try {
          const addrRes = await fetchCurrentAddress(accessToken, {});
          const addr = addrRes?.data?.result || addrRes?.data?.data || {};
          // 서버 응답 구조가 명확치 않아 안전하게 처리
          // 대표 주소 문자열 후보: addr.address || addr.fullAddress || addr.addressName ...
          const displayAddress =
            addr.address || addr.fullAddress || addr.addressName || nextUser.address || '';

          if (mounted) {
            setUser({ ...nextUser, address: displayAddress });
          }
        } catch {
          // 주소 조회 실패해도 마이페이지는 표시 가능해야 하므로 단순 병합
          if (mounted) setUser(nextUser);
        }
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  // 이름 저장
  const handleSaveProfile = useCallback(
    async nextName => {
      if (!accessToken) return;
      setSaving(true);
      try {
        await updateMyInfo(accessToken, { name: nextName });
        setUser(prev => ({ ...prev, name: nextName }));
      } catch (e) {
        setError(e);
      } finally {
        setSaving(false);
      }
    },
    [accessToken]
  );

  // (선택) 현재 주소 변경 — 주소관리 화면에서 주소 선택 후 여기 핸들러 호출하면 됨
  const handleChangeCurrentAddress = useCallback(
    async (payload /* 예: { addressId: 123 } */) => {
      if (!accessToken) return;
      await changeCurrentAddress(accessToken, payload);
      // 성공 후 현재 주소 재조회
      try {
        const addrRes = await fetchCurrentAddress(accessToken, {});
        const addr = addrRes?.data?.result || addrRes?.data?.data || {};
        const displayAddress = addr.address || addr.fullAddress || addr.addressName || '';
        setUser(prev => ({ ...prev, address: displayAddress }));
      } catch {
        // 실패해도 조용히 넘어감 (필요시 토스트 처리)
      }
    },
    [accessToken]
  );

  return (
    <L_MyPageTemplate
      user={user}
      loading={loading}
      error={error}
      saving={saving}
      onSaveProfile={handleSaveProfile}
      // 아래는 당장 UI에 연결하진 않지만, 주소관리에서 사용 가능하도록 props로 내려둠
      onChangeCurrentAddress={handleChangeCurrentAddress}
      addressManagePath="/address-admin"
    />
  );
}
