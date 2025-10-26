import React, { useEffect, useMemo, useState } from 'react';
import RepairHistoryTemplate from '../../../templates/tenant/repair/RepairHistoryTemplate';
import { getAccessToken } from '../../../utils/auth';
import { apiGetCompletedRepairs } from '../../../api/requestform-service';
import { formatYMDWithKoreanTime } from '../../../utils/dateFormat';

export default function RepairHistory() {
  const token = useMemo(() => getAccessToken(), []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const year = new Date().getFullYear();

        // ✅ 토큰 전달 유지
        const res = await apiGetCompletedRepairs(token, year);
        if (!res.success) throw new Error(res.message || '완료된 내역을 불러오지 못했습니다.');

        const mapped = (res.data || []).map(r => ({
          id: r.requestFormId,
          categoryLabel: r.category,
          schedule: formatYMDWithKoreanTime(r.requestSchedule),
          price: r.estimatePrice ?? 0,
          room: r.number || '',
          decisionLater: r.decisionLater === true,
        }));

        setItems(mapped);
      } catch (e) {
        console.error('RepairHistory fetch error:', e);
        setError('지난 수리 내역을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <div style={{ padding: 24 }}>불러오는 중...</div>;
  if (error) return <div style={{ padding: 24 }}>{error}</div>;

  return <RepairHistoryTemplate items={items} />;
}
