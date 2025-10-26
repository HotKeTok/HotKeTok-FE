import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TopBar from '../../../components/common/TopBar';
import RepairProgressTemplate from '../../../templates/tenant/repair/RepairProgressTemplate';
import { apiGetRepairDetail } from '../../../api/requestform-service';
import { apiGetEstimateList, apiGetEstimateInfo } from '../../../api/estimate-service';
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
  return 'SELF';
}

// 목록 응답 → 화면 모델 (id 문자열 통일)
function mapEstimateToQuote(e) {
  return {
    id: String(e.estimateId),
    vendorId: e.vendorId,
    companyName: e.vendorName,
    avatar: e.vendorProfileImage,
    phone: e.vendorNumber,
    content: e.content,
    price: e.price,
    schedule: e.estimateTime,
    decisionLater: e.decisionLater ?? e.discisionLater ?? false,
  };
}

// 단건 응답 → 화면 모델 (id 문자열 통일)
function mapEstimateInfoToQuote(r) {
  if (!r) return null;
  return {
    id: String(r.estimateId),
    vendorId: r.vendorId,
    companyName: r.vendorName,
    avatar: r.vendorProfileImage,
    phone: r.phoneNumber,
    content: r.content,
    price: r.estimatePrice,
    schedule: r.estimateTime,
    decisionLater: false,
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

        // 2) 견적서 목록
        const listRes = await apiGetEstimateList(token, requestFormId);
        let quotes = (listRes?.data ?? []).map(mapEstimateToQuote);

        // 3) 서버가 보관 중인 "선택된 견적 id" (여러 필드 대비) → 문자열 통일
        const selectedIdRaw =
          d.selectedEstimateId ?? d.matchedEstimateId ?? d.selectedQuoteId ?? d.estimateId ?? null;
        let selectedId = selectedIdRaw != null ? String(selectedIdRaw) : null;

        // ✅ Fallback: MATCHING/COMPLETED 상태인데 서버가 선택 ID를 안 줄 때
        //    목록이 1건이면 그걸 선택된 견적으로 간주
        if (
          !selectedId &&
          (d.status === 'MATCHING' || d.status === 'COMPLETED') &&
          Array.isArray(quotes) &&
          quotes.length === 1
        ) {
          selectedId = quotes[0]?.id ?? null;
        }
        // 4) 선택된 견적 단건을 조회해 목록에 반영 (없으면 prepend, 있으면 merge)
        if (selectedId) {
          const infoRes = await apiGetEstimateInfo(token, selectedId);
          if (infoRes.success && infoRes.data) {
            const selectedQuote = mapEstimateInfoToQuote(infoRes.data);
            const idx = quotes.findIndex(q => q.id === selectedId);
            if (idx === -1) quotes = [selectedQuote, ...quotes];
            else quotes[idx] = { ...quotes[idx], ...selectedQuote };
          }
        }

        // 5) 초기 스텝/모드
        const initialStep = STATUS_TO_STEP[d.status] ?? 1;
        const initialMode = mapPayTypeToMode(d.payType);

        setData({
          initialStep,
          initialMode,
          initialSelectedQuoteId: selectedId, // ✅ 반드시 세팅: MATCHING에서 렌더 트리거
          initialRequest: {
            categoryLabel: d.category,
            requestedAt: formatYMDWithKoreanTime(d.requestSchedule),
            hopeAt: formatYMDWithKoreanTime(d.requestSchedule),
            address: `${d.currentAddress} ${d.currentNumber || ''}`.trim(),
            description: d.description,
            images: d.imagesUrl || [],
          },
          initialQuotes: quotes,
        });
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
