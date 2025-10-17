// src/pages/tenant/my/MyPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import MyPageTemplate from '../../../templates/tenant/my/MyPageTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  fetchMyInfo,
  fetchCurrentAddress,
  updateMyInfo,
  changeCurrentAddress,
} from '../../../api/myPage';

// ✅ 전화번호 하이픈 포맷터
function formatPhone(p) {
  if (!p) return '';
  const only = String(p).replace(/\D/g, '');
  if (only.length === 11) return `${only.slice(0, 3)}-${only.slice(3, 7)}-${only.slice(7)}`;
  if (only.length === 10) return `${only.slice(0, 3)}-${only.slice(3, 6)}-${only.slice(6)}`;
  return p;
}

export default function MyPage() {
  const accessToken = useAuthStore(s => s.accessToken);

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    logInId: '',
    address: '',
  });

  // ✅ 최초 마운트 시 내 정보 + 현재 주소 조회
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
        // 1️⃣ 내 정보 조회
        const infoRes = await fetchMyInfo(accessToken);
        const info = infoRes?.data?.data || {};
        const nextUser = {
          name: info.name || '',
          phoneNumber: formatPhone(info.phoneNumber || ''),
          logInId: info.logInId || '',
          address: info.address || '',
        };

        // 2️⃣ 현재 주소 조회
        try {
          const addrRes = await fetchCurrentAddress(accessToken);
          const addr = addrRes?.data?.data || {};
          const displayAddress =
            addr.currentAddress || addr.address || addr.fullAddress || nextUser.address || '';
          if (mounted) setUser({ ...nextUser, address: displayAddress });
        } catch {
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

  // ✅ 이름 + 이미지 업데이트 (multipart)
  const handleSaveProfile = useCallback(
    async (nextName, imageFile) => {
      if (!accessToken) return;
      setSaving(true);
      try {
        await updateMyInfo(accessToken, { name: nextName }, imageFile);
        setUser(prev => ({ ...prev, name: nextName }));
      } catch (e) {
        setError(e);
      } finally {
        setSaving(false);
      }
    },
    [accessToken]
  );

  return (
    <MyPageTemplate
      user={user}
      loading={loading}
      error={error}
      saving={saving}
      onSaveProfile={handleSaveProfile}
    />
  );
}
