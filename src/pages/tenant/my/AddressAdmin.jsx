// src/pages/tenant/my/AddressAdmin.jsx
import React, { useEffect, useState, useCallback } from 'react';
import AddressAdminTemplate from '../../../templates/tenant/my/AddressAdminTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { apiGetHouseList } from '../../../api/house-service';
import { apiChangeCurrentAddress } from '../../../api/user-service';

// 템플릿이 기대하는 형태로 응답을 매핑
function mapHouseItem(raw, idx) {
  const {
    address = '',
    number = '',
    houseTags = [],
    alias = '',
    type = 'ETC', // HOME | COMPANY | ETC
    state = '',
    isCurrent = false,
  } = raw || {};

  return {
    id: `${type}-${address}-${number}-${idx}`, // API에 id 없어서 합성키
    alias,
    address1: address,
    address2: number,
    placeType: type, // HOME/COMPANY/ETC
    verified: state === 'MATCHED', // 인증 완료 여부
    isCurrent: !!isCurrent,
    neighborNotes: [],
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

  // ✅ 현재주소 변경 API 호출 핸들러 (템플릿에 주입)
  const handleChangeCurrent = useCallback(
    async ({ currentAddress, currentNumber }) => {
      if (!accessToken) throw new Error('로그인이 필요합니다.');
      const res = await apiChangeCurrentAddress(accessToken, { currentAddress, currentNumber });
      if (!res.success) {
        const err = new Error(res.message || '현재 주소 변경에 실패했습니다.');
        err.code = res.code || res.status;
        throw err;
      }
      // 성공 시 페이지 레벨에서는 재조회만 선택적으로 수행 (필수는 아님)
      // await load();
      return res;
    },
    [accessToken]
  );

  return (
    <AddressAdminTemplate
      items={items}
      loading={loading}
      error={error}
      onRefresh={load}
      onChangeCurrent={handleChangeCurrent} // ⬅️ 주입
    />
  );
}
