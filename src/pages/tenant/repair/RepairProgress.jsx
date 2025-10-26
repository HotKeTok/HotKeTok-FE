import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TopBar from '../../../components/common/TopBar';
import RepairProgressTemplate from '../../../templates/tenant/repair/RepairProgressTemplate';
import { apiGetRepairDetail } from '../../../api/requestform-service';
import { apiGetEstimateList } from '../../../api/estimate-service';
import { getAccessToken } from '../../../utils/auth';
import { formatYMDWithKoreanTime } from '../../../utils/dateFormat';

// 서버 status → 스텝 매핑
const STATUS_TO_STEP = {
  SEARCHING: 1, // 업체 찾는 중
  CHOOSING: 2, // 견적서 선택
  MATCHING: 3, // 업체 매칭
  COMPLETED: 4, // 처리 완료
};

// 서버 payType → 비용모드 매핑
function mapPayTypeToMode(payType) {
  if (payType === 'LANDLORD' || payType === 'PROPRIETORSHIP') return 'LANDLORD';
  return 'SELF'; // 기본: 본인부담
}

// 견적서 API 응답 → 화면 모델로 매핑
function mapEstimateToQuote(e) {
  return {
    id: e.estimateId,
    vendorId: e.vendorId,
    companyName: e.vendorName,
    avatar: e.vendorProfileImage,
    phone: e.vendorNumber,
    content: e.content,
    price: e.price, // number | null
    schedule: e.estimateTime, // "2025.10.05 / 오후 08:45"
    decisionLater: e.decisionLater ?? e.discisionLater ?? false, // ✅ 추가(오타 대비)
  };
}

export default function RepairProgress() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const requestFormId = params.get('id');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const token = getAccessToken();

  useEffect(() => {
    if (!requestFormId) return;
    (async () => {
      try {
        setLoading(true);

        // 1) 개별 수리 건 상세
        const res = await apiGetRepairDetail(token, requestFormId);
        if (!res.success || !res.data) {
          setData(null);
          return;
        }
        const d = res.data;

        // 2) 견적서 목록 조회
        const listRes = await apiGetEstimateList(token, requestFormId);
        const quotes = (listRes?.data ?? []).map(mapEstimateToQuote);

        // 초기 스텝/모드 매핑
        const initialStep = STATUS_TO_STEP[d.status] ?? 1;
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
          initialQuotes: quotes,
        };

        setData(mapped);
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [requestFormId, token]);

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
