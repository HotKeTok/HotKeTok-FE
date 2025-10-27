import React, { useEffect, useState, useCallback } from 'react';
import L_AddressAdminTemplate from '../../../templates/landlord/my/L_AddressAdminTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { apiGetHouseList } from '../../../api/house-service';
import { apiChangeCurrentAddress } from '../../../api/user-service';

/**
 * 집주인 주소 데이터 매핑
 * state: NONE | REGISTERED | MATCHED
 */
function mapLandlordItem(raw, idx) {
  const { address = '', number = '', state = 'NONE', isCurrent = false } = raw || {};

  const isCertDone = state === 'REGISTERED' || state === 'MATCHED';

  return {
    id: `${address}-${number}-${idx}`,
    roadAddress: address,
    buildingName: number,
    state, // 그대로 전달
    verified: isCertDone,
    isCurrent: !!isCurrent,
    _raw: raw,
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

      // ✅ state가 NONE이더라도 전부 렌더링 (필터 X)
      const mapped = (res.data || []).map(mapLandlordItem);
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

  // ✅ 주소 변경 API
  const handleChangeCurrent = useCallback(
    async ({ currentAddress, currentNumber }) => {
      if (!accessToken) throw new Error('로그인이 필요합니다.');
      const res = await apiChangeCurrentAddress(accessToken, { currentAddress, currentNumber });
      if (!res.success) {
        const err = new Error(res.message || '현재 주소 변경에 실패했습니다.');
        err.code = res.code || res.status;
        throw err;
      }
      return res;
    },
    [accessToken]
  );

  return (
    <L_AddressAdminTemplate
      items={items}
      loading={loading}
      error={error}
      onRefresh={load}
      onChangeCurrent={handleChangeCurrent}
    />
  );
}
