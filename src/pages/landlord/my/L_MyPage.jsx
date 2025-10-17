// src/pages/landlord/my/L_MyPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import L_MyPageTemplate from '../../../templates/landlord/my/L_MyPageTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { fetchMyInfo, fetchCurrentAddress, updateMyInfo } from '../../../api/user-service';

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
        const infoRes = await fetchMyInfo(accessToken);
        const info = infoRes?.data?.data || {};
        const nextUser = {
          name: info.name || '',
          phoneNumber: formatPhone(info.phoneNumber || ''),
          logInId: info.logInId || '',
          address: info.address || '',
        };
        try {
          const addrRes = await fetchCurrentAddress(accessToken);
          const addr = addrRes?.data?.result || addrRes?.data?.data || {};
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

  // ✅ 이름/이미지 저장
  const handleSaveProfile = useCallback(
    async (nextName, imageFile) => {
      if (!accessToken) return;
      setSaving(true);
      try {
        await updateMyInfo(accessToken, { name: nextName }, imageFile);
        // 성공 시 로컬 상태 반영
        setUser(prev => ({ ...prev, name: nextName }));
        // (선택) 서버 재조회로 확정 반영
        // const infoRes = await fetchMyInfo(accessToken);
        // const info = infoRes?.data?.data || {};
        // setUser(prev => ({ ...prev, name: info.name || nextName }));
      } catch (e) {
        setError(e);
      } finally {
        setSaving(false);
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
      addressManagePath="/address-admin"
    />
  );
}
