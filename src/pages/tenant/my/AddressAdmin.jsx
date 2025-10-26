// src/pages/tenant/my/AddressAdmin.jsx
import React, { useEffect, useState, useCallback } from 'react';
import AddressAdminTemplate from '../../../templates/tenant/my/AddressAdminTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { apiGetHouseList } from '../../../api/house-service';

// 템플릿이 기대하는 형태로 응답을 매핑
// API 응답 예시:
// { address, number, houseTags, alias, type, state, isCurrent }
function mapHouseItem(raw, idx) {
  const {
    address = '',
    number = '',
    houseTags = [],
    alias = '',
    type = 'ETC', // HOME | WORK | ETC
    state = '',
    isCurrent = false,
  } = raw || {};

  return {
    // ✅ 템플릿에서 쓰는 필드들
    id: `${type}-${address}-${number}-${idx}`, // 고유키 생성 (API에 id 없어서 합성)
    alias, // 상단 타이틀
    address1: address, // 본문 주소(멀티라인 말줄임)
    address2: number, // 필요시 서브라인에서 사용 가능
    placeType: type, // 아이콘 매핑용 (HOME/WORK/ETC)
    verified: state === 'MATCHED', // '인증 완료' 뱃지 여부
    isCurrent: !!isCurrent, // 선택 시 테두리 강조

    // ✅ 메모 태그들: 아이콘 태그(neighborNotes)와 텍스트 칩(extraNotes)
    // 현재 API에는 houseTags(문자)만 있으므로 텍스트 칩에 매핑
    neighborNotes: [], // (아이콘 태그가 생기면 여기에 키로 넣으면 됨)
    extraNotes: Array.isArray(houseTags) ? houseTags : [],
  };
}

export default function AddressAdmin() {
  const accessToken = useAuthStore(s => s.accessToken);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!accessToken) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await apiGetHouseList(accessToken);
      if (!res.success) throw new Error(res.message || '주소 목록을 불러오지 못했습니다.');

      // 1) state === 'NONE' 은 apiGetHouseList에서 이미 제외됨
      // 2) 대표주소(isCurrent) 우선 정렬도 apiGetHouseList에서 적용됨
      // 3) 템플릿 호환 매핑
      const mapped = (res.data || []).map(mapHouseItem);
      setItems(mapped);
    } catch (e) {
      setError(e?.message || '주소 목록 조회 중 오류가 발생했습니다.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AddressAdminTemplate
      items={items} // ✅ 템플릿은 이 데이터만 그대로 렌더링
      loading={loading}
      error={error}
      onRefresh={load}
    />
  );
}
