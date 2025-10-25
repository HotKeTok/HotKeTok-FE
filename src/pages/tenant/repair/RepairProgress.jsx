import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TopBar from '../../../components/common/TopBar';
import RepairProgressTemplate from '../../../templates/tenant/repair/RepairProgressTemplate';
import { apiGetRepairDetail } from '../../../api/requestform-service';
import { getAccessToken } from '../../../utils/auth';
import { formatYMDWithKoreanTime } from '../../../utils/dateFormat';

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

          const mapped = {
            // ✅ 실제 데이터 기반 변환
            initialStep: d.statusStep || 1, // 서버에서 단계 값 있으면 반영
            initialMode: d.payType === 'PROPRIETORSHIP' ? 'LANDLORD' : 'SELF',
            initialRequest: {
              categoryLabel: d.category,
              requestedAt: formatYMDWithKoreanTime(d.requestSchedule),
              hopeAt: formatYMDWithKoreanTime(d.requestSchedule),
              address: `${d.currentAddress} ${d.currentNumber || ''}`,
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
