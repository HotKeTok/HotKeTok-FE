import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TopBar from '../../../components/common/TopBar';
import RepairProgressTemplate from '../../../templates/tenant/repair/RepairProgressTemplate';
import { apiGetRepairDetail } from '../../../api/requestform-service';
import { getAccessToken } from '../../../utils/auth';
import { formatYMDWithKoreanTime } from '../../../utils/dateFormat';

// 서버 status → 스텝 매핑
const STATUS_TO_STEP = {
  SEARCHING: 1, // 업체 찾는 중
  CHOOSING: 2, // 견적서 선택
  MATCHED: 3, // 업체 매칭
  COMPLETED: 4, // 처리 완료
};

// 서버 payType → 비용모드 매핑
function mapPayTypeToMode(payType) {
  if (payType === 'LANDLORD' || payType === 'PROPRIETORSHIP') return 'LANDLORD';
  return 'SELF'; // 기본: 본인부담
}

export default function RepairProgress() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const token = getAccessToken();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await apiGetRepairDetail(token, id);
        if (res.success && res.data) {
          const d = res.data;

          // ✅ status 기반으로 초기 스텝 결정
          const initialStep = STATUS_TO_STEP[d.status] ?? 1;

          // ✅ 비용 모드 매핑 (RESIDENT → SELF, LANDLORD/PROPRIETORSHIP → LANDLORD)
          const initialMode = mapPayTypeToMode(d.payType);

          const mapped = {
            initialStep,
            initialMode,
            initialSelectedQuoteId: d.selectedQuoteId ?? null,
            initialRequest: {
              categoryLabel: d.category,
              requestedAt: formatYMDWithKoreanTime(d.requestSchedule),
              hopeAt: formatYMDWithKoreanTime(d.requestSchedule),
              address: `${d.currentAddress} ${d.currentNumber || ''}`.trim(),
              description: d.description,
              images: d.imagesUrl || [],
            },
            initialQuotes: d.quotes || [],
          };

          setData(mapped);
        } else {
          setData(null);
        }
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  if (loading)
    return (
      <>
        <TopBar title="수리 상세" />
        <div style={{ padding: 24 }}>불러오는 중...</div>
      </>
    );

  if (!data)
    return (
      <>
        <TopBar title="수리 상세" />
        <div style={{ padding: 24 }}>
          존재하지 않는 수리 내역입니다.
          <div style={{ height: 12 }} />
          <button onClick={() => navigate(-1)}>뒤로가기</button>
        </div>
      </>
    );

  return <RepairProgressTemplate {...data} />;
}
