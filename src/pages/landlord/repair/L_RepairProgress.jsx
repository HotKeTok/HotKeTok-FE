import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import L_RepairProgressTemplate from '../../../templates/landlord/repair/L_RepairProgressTemplate';
import { getAccessToken } from '../../../utils/auth';
import { apiGetRepairDetail } from '../../../api/requestform-service';
import { formatYMDWithKoreanTime } from '../../../utils/dateFormat';

export default function L_RepairProgress() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const token = useMemo(() => getAccessToken(), []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapped, setMapped] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError('');

        // ✅ 입주민과 동일한 단일 수리건 조회 API 사용
        const res = await apiGetRepairDetail(token, id);
        if (res?.success && res?.data) {
          const d = res.data;
          // ⬇️ 템플릿이 기대하는 구조로 매핑
          const request = {
            categoryLabel: d.category, // "수도_보일러" 등 그대로 라벨로 사용
            requestedAt: formatYMDWithKoreanTime(d.requestSchedule),
            hopeAt: formatYMDWithKoreanTime(d.requestSchedule),
            address: `${d.currentAddress} ${d.currentNumber || ''}`.trim(),
            description: d.description,
            images: d.imagesUrl || [],
          };
          setMapped({
            request,
            quotes: [], // 현재 명세에 없음 → 빈 배열
            initialStep: 1, // 서버 값 생기면 교체
            initialSelectedQuoteId: null,
          });
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
  if (!mapped) return <div style={{ padding: 24 }}>잘못된 접근입니다.</div>;

  // ✅ 입주민과 동일한 데이터 구조 전달, 단 mode만 LANDLORD로 고정
  return (
    <L_RepairProgressTemplate
      request={mapped.request}
      quotes={mapped.quotes}
      initialStep={mapped.initialStep}
      initialSelectedQuoteId={mapped.initialSelectedQuoteId}
      mode="LANDLORD"
    />
  );
}
