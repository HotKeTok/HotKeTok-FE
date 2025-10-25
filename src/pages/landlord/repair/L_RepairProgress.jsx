import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import L_RepairProgressTemplate from '../../../templates/landlord/repair/L_RepairProgressTemplate';
import { getAccessToken } from '../../../utils/auth';
import { apiGetRepairDetail } from '../../../api/requestform-service';

export default function L_RepairProgress() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const token = useMemo(() => getAccessToken(), []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repairDetail, setRepairDetail] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError('');

        // ✅ 입주민과 동일한 단일 수리건 조회 API 사용
        const res = await apiGetRepairDetail(token, id);
        if (res?.success && res?.data) {
          setRepairDetail(res.data);
        } else {
          throw new Error(res?.message || '데이터를 불러올 수 없습니다.');
        }
      } catch (e) {
        console.error('수리건 상세 조회 실패:', e);
        setError('수리건 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  // ✅ 상태별 렌더링
  if (loading) return <div style={{ padding: 24 }}>불러오는 중...</div>;
  if (error) return <div style={{ padding: 24 }}>{error}</div>;
  if (!repairDetail) return <div style={{ padding: 24 }}>잘못된 접근입니다.</div>;

  // ✅ 입주민과 동일한 데이터 구조 전달, 단 mode만 LANDLORD로 고정
  return (
    <L_RepairProgressTemplate
      request={repairDetail.request}
      quotes={repairDetail.quotes}
      initialStep={repairDetail.step}
      initialSelectedQuoteId={repairDetail.selectedQuoteId}
      mode="LANDLORD"
    />
  );
}
