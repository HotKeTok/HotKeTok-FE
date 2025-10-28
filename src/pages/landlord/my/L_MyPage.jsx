import React, { useEffect, useState, useCallback } from 'react';
import L_MyPageTemplate from '../../../templates/landlord/my/L_MyPageTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { fetchMyInfo, updateMyInfo } from '../../../api/user-service';

function formatPhone(p) {
  if (!p) return '';
  const only = String(p).replace(/\D/g, '');
  if (only.length === 11) return `${only.slice(0, 3)}-${only.slice(3, 7)}-${only.slice(7)}`;
  if (only.length === 10) return `${only.slice(0, 3)}-${only.slice(3, 6)}-${only.slice(6)}`;
  return p;
}

// URL 안전 처리 (공백/한글/특수문자 포함 경로 안전화)
function sanitizeUrl(url) {
  if (!url) return '';
  try {
    return new URL(url).href; // 절대 URL이면 그대로
  } catch {
    return encodeURI(String(url)); // encode로 보정
  }
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
    profileImage: '',
  });

  // 최초 마운트 시 내 정보 조회 (address는 info 응답값 사용)
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
          profileImage: sanitizeUrl(info.profileImage || ''),
        };
        if (mounted) setUser(nextUser);
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

  // 이름/이미지 저장 (낙관적 업데이트로 즉시 반영)
  const handleSaveProfile = useCallback(
    async (nextName, imageFile) => {
      if (!accessToken) return;
      setSaving(true);
      try {
        await updateMyInfo(accessToken, { name: nextName }, imageFile);
        const nextProfileImage = imageFile ? URL.createObjectURL(imageFile) : user.profileImage;
        setUser(prev => ({ ...prev, name: nextName, profileImage: nextProfileImage }));
      } catch (e) {
        setError(e);
      } finally {
        setSaving(false);
      }
    },
    [accessToken, user.profileImage]
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
