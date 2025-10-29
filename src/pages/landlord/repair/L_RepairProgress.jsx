import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import L_RepairProgressTemplate from '../../../templates/landlord/repair/L_RepairProgressTemplate';
import { getAccessToken } from '../../../utils/auth';
import { apiGetRepairDetail } from '../../../api/requestform-service';
import { apiGetEstimateList, apiGetEstimateInfo } from '../../../api/estimate-service';
import { formatYMDWithKoreanTime } from '../../../utils/dateFormat';
// (선택) JWT에서 사용자/역할을 읽어 권한 판단 강화하려면 주석 해제
// import { decodeJwt } from '../../../utils/jwt';

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
    roomId: e.roomId,
  };
}

// 단건 응답 → 화면 모델 (id는 문자열로 통일)
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
    roomId: r.roomId,
  };
}

// (선택) 집주인 선택 권한 계산 보조
function computeLandlordCanSelect(d /*, token */) {
  // 최소 조건: payType 이 집주인 부담 계열
  const isLandlordPay = d?.payType === 'LANDLORD' || d?.payType === 'PROPRIETORSHIP';

  // 토큰/역할/집주인ID까지 체크하려면 아래 주석 해제해서 강화 가능
  // const claims = decodeJwt(token || '');
  // const roles = Array.isArray(claims?.roles)
  //   ? claims.roles
  //   : typeof claims?.role === 'string'
  //   ? [claims.role]
  //   : [];
  // const roleSaysLandlord =
  //   roles.includes('LANDLORD') || roles.includes('OWNER') || roles.includes('PROPRIETOR');
  // const currentUserId = String(claims?.sub ?? claims?.userId ?? '');
  // const requestLandlordId = d.landlordUserId ?? d.ownerUserId ?? d.proprietorUserId ?? null;
  // const idMatches = requestLandlordId ? String(requestLandlordId) === currentUserId : true;

  // return isLandlordPay && roleSaysLandlord && idMatches;
  return !!isLandlordPay;
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

        // 2) 견적서 목록
        const listRes = await apiGetEstimateList(token, id);
        let quotes = (listRes?.data ?? []).map(mapEstimateToQuote);

        // 3) 서버 보관 "선택된 견적 ID" 복구 (여러 필드 대비) → 문자열 통일
        const selectedIdRaw =
          d.selectedEstimateId ?? d.matchedEstimateId ?? d.selectedQuoteId ?? d.estimateId ?? null;
        let selectedId = selectedIdRaw != null ? String(selectedIdRaw) : null;

        // ✅ Fallback: MATCHING/COMPLETED인데 서버가 선택 ID를 안 줄 때,
        //             목록이 1건이면 그걸 선택된 견적으로 간주
        if (
          !selectedId &&
          (d.status === 'MATCHING' || d.status === 'COMPLETED') &&
          Array.isArray(quotes) &&
          quotes.length === 1
        ) {
          selectedId = quotes[0]?.id ?? null;
        }

        // 4) 선택된 견적 단건 조회 후 목록에 병합/프리펜드
        if (selectedId) {
          const infoRes = await apiGetEstimateInfo(token, selectedId);
          if (infoRes.success && infoRes.data) {
            const selectedQuote = mapEstimateInfoToQuote(infoRes.data);
            const idx = quotes.findIndex(q => q.id === selectedId);
            if (idx === -1) quotes = [selectedQuote, ...quotes];
            else quotes[idx] = { ...quotes[idx], ...selectedQuote };
          }
        }

        // 5) 초기 스텝
        const initialStep = STATUS_TO_STEP[d.status] ?? 1;

        // 6) 요청서 매핑
        const request = {
          categoryLabel: d.category,
          requestedAt: formatYMDWithKoreanTime(d.requestSchedule),
          hopeAt: formatYMDWithKoreanTime(d.requestSchedule),
          address: `${d.currentAddress} ${d.currentNumber || ''}`.trim(),
          description: d.description,
          images: d.imagesUrl || [],
          roomId: d.roomId,
        };

        // 7) 집주인 선택 권한 (서버 정책과 맞춰 계산)
        const landlordCanSelect = computeLandlordCanSelect(d /*, token */);

        setMapped({
          request,
          quotes,
          initialStep,
          initialSelectedQuoteId: selectedId, // ✅ 새로고침/재진입 시에도 선택 반영
          landlordCanSelect,
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

  // 집주인 뷰: mode는 LANDLORD 고정 + 권한 플래그 전달
  return (
    <L_RepairProgressTemplate
      request={mapped.request}
      quotes={mapped.quotes}
      initialStep={mapped.initialStep}
      initialSelectedQuoteId={mapped.initialSelectedQuoteId}
      mode="LANDLORD"
      landlordCanSelect={mapped.landlordCanSelect}
    />
  );
}
