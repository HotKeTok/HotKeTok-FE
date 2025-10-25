// src/pages/tenant/repair/RepairHome.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getAccessToken } from '../../../utils/auth';
import RepairHomeTemplate from '../../../templates/tenant/repair/RepairHomeTemplate';
import { apiGetInProgressRepairs } from '../../../api/requestform-service';

function formatSchedule(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${MM}.${DD} (${w}) ${HH}:${mm}`;
}

const STATUS_MAP = {
  SEARCHING: '업체 찾는 중',
  CHOOSING: '견적서 선택',
  MATCHING: '업체 매칭',
  COMPLETED: '처리 완료',
};
export default function RepairHome() {
  const accessToken = useMemo(() => getAccessToken(), []);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiGetInProgressRepairs(accessToken);
        if (!mounted) return;

        if (res.success && Array.isArray(res.data?.list)) {
          const mapped = res.data.list.map(item => {
            const categoryLabel = String(item.category || '').replace('_', '/'); // "문_창문" → "문/창문"
            const payerLabel = item.payType === 'RESIDENT' ? '본인 부담' : '집주인 부담';
            const statusLabel = STATUS_MAP[item.status] || '진행 중';

            return {
              id: item.requestFormId,
              categoryLabel,
              schedule: formatSchedule(item.requestSchedule),
              payerLabel,
              statusLabel,
            };
          });
          setList(mapped);
        } else {
          setList([]);
        }
      } catch (e) {
        console.error(e);
        setList([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  return <RepairHomeTemplate list={list} loading={loading} />;
}
