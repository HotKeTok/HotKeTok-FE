import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import L_RepairProgressTemplate from '../../../templates/landlord/repair/L_RepairProgressTemplate';
import { getAccessToken } from '../../../utils/auth';
import { apiGetRepairDetail } from '../../../api/requestform-service';
import { apiGetEstimateList } from '../../../api/estimate-service';
import { formatYMDWithKoreanTime } from '../../../utils/dateFormat';

// 서버 status → 스텝 매핑 (입주민과 동일)
const STATUS_TO_STEP = {
  SEARCHING: 1, // 업체 찾는 중
  CHOOSING: 2, // 견적서 선택
  MATCHING: 3, // 업체 매칭
  COMPLETED: 4, // 처리 완료
};

// 견적 목록 응답 → 화면 모델 (id는 문자열로 통일)
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

// 서버 payType → 비용모드 매핑 (참고: 템플릿에서는 LANDLORD로 고정 전달)
function mapPayTypeToMode(payType) {
  if (payType === 'LANDLORD' || payType === 'PROPRIETORSHIP') return 'LANDLORD';
  return 'SELF';
}

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

        // 1) 수리건 상세
        const res = await apiGetRepairDetail(token, id);
        if (!(res?.success && res?.data)) {
          throw new Error(res?.message || '데이터를 불러올 수 없습니다.');
        }
        const d = res.data;

        // 2) 견적서 목록 (집주인 화면도 목록 필요)
        const listRes = await apiGetEstimateList(token, id);
        const quotes = (listRes?.data ?? []).map(mapEstimateToQuote);

        // 3) 초기 스텝: 서버 status 기준
        const initialStep = STATUS_TO_STEP[d.status] ?? 1;

        // 4) 선택된 견적 id (있다면 문자열 통일)
        const selectedIdRaw =
          d.selectedEstimateId ?? d.matchedEstimateId ?? d.selectedQuoteId ?? d.estimateId ?? null;
        const initialSelectedQuoteId = selectedIdRaw != null ? String(selectedIdRaw) : null;

        // 5) 요청서 매핑
        const request = {
          categoryLabel: d.category,
          requestedAt: formatYMDWithKoreanTime(d.requestSchedule),
          hopeAt: formatYMDWithKoreanTime(d.requestSchedule),
          address: `${d.currentAddress} ${d.currentNumber || ''}`.trim(),
          description: d.description,
          images: d.imagesUrl || [],
        };

        setMapped({
          request,
          quotes,
          initialStep,
          initialSelectedQuoteId,
        });
      } catch (e) {
        console.error('수리건 상세 조회 실패:', e);
        setError('수리건 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  if (loading) return <div style={{ padding: 24 }}>불러오는 중...</div>;
  if (error) return <div style={{ padding: 24 }}>{error}</div>;
  if (!mapped) return <div style={{ padding: 24 }}>잘못된 접근입니다.</div>;

  // 집주인 뷰: mode는 LANDLORD 고정
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
