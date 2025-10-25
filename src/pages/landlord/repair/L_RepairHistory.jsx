// src/pages/landlord/repair/L_RepairHistory.jsx
import React, { useEffect, useMemo, useState } from 'react';
import L_RepairHistoryTemplate from '../../../templates/landlord/repair/L_RepairHistoryTemplate';
import { getAccessToken } from '../../../utils/auth';
import { apiGetCompletedRepairs } from '../../../api/requestform-service';
import { formatYMDWithKoreanTime } from '../../../utils/dateFormat';

export default function RepairHistory() {
  const token = useMemo(() => getAccessToken(), []);
  const [items, setItems] = useState([]); // 템플릿에 내려줄 리스트
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');

        const year = new Date().getFullYear(); // 기본: 올해
        const res = await apiGetCompletedRepairs(token, year);
        if (!res.success) throw new Error(res.message || '지난 수리 내역을 불러올 수 없습니다.');

        // 템플릿이 사용하는 필드로 매핑
        const mapped = (res.data || []).map(r => ({
          id: r.requestFormId,
          categoryLabel: r.category,
          schedule: formatYMDWithKoreanTime(r.requestSchedule), // "YYYY.MM.DD / 오전 HH:MM"
          price: r.estimatePrice ?? 0,
          room: r.number || '',
        }));

        setItems(mapped);
      } catch (e) {
        console.error('L_RepairHistory fetch error:', e);
        setError('지난 수리 내역을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <div style={{ padding: 24 }}>불러오는 중...</div>;
  if (error) return <div style={{ padding: 24 }}>{error}</div>;

  return <L_RepairHistoryTemplate items={items} />;
}
