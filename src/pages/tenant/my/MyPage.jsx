// src/pages/tenant/my/MyPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import MyPageTemplate from '../../../templates/tenant/my/MyPageTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { fetchMyInfo, updateMyInfo } from '../../../api/user-service';

// ✅ 전화번호 하이픈 포맷터
function formatPhone(p) {
  if (!p) return '';
  const only = String(p).replace(/\D/g, '');
  if (only.length === 11) return `${only.slice(0, 3)}-${only.slice(3, 7)}-${only.slice(7)}`;
  if (only.length === 10) return `${only.slice(0, 3)}-${only.slice(3, 6)}-${only.slice(6)}`;
  return p;
}

// ✅ URL 안전 처리 (공백/한글/특수문자 포함 경로 안전화)
function sanitizeUrl(url) {
  if (!url) return '';
  try {
    // 이미 유효한 절대 URL이면 그대로 사용
    return new URL(url).href;
  } catch {
    // 절대 URL이 아니거나 문자가 섞여 실패하면 encodeURI로 보정
    return encodeURI(String(url));
  }
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
    profileImage: '',
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
          profileImage: sanitizeUrl(info.profileImage || ''),
        };

        // 2️⃣ 현재 주소 조회
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

  // ✅ 이름 + 이미지 업데이트 (multipart)
  const handleSaveProfile = useCallback(
    async (nextName, imageFile) => {
      if (!accessToken) return;
      setSaving(true);
      try {
        await updateMyInfo(accessToken, { name: nextName }, imageFile);
        // 업로드 후 서버가 새 이미지 URL을 바로 돌려주지 않는다면, 이름만 즉시 반영
        // 이미지의 경우, 성공 후 fetchMyInfo를 다시 불러오거나 아래처럼 낙관적 반영 가능
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
    <MyPageTemplate
      user={user}
      loading={loading}
      error={error}
      saving={saving}
      onSaveProfile={handleSaveProfile}
    />
  );
}
