// src/templates/landlord/repair/L_RepairProgressTemplate.jsx
import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// ✅ 입주민용 상세 화면을 그대로 재사용
//    프로젝트 구조에 맞게 경로만 확인해 주세요.
import RepairProgressTemplate from '../../../templates/tenant/repair/RepairProgressTemplate';

// ✅ 같은 mocks를 그대로 사용
import { getProgressInitialProps, getRepairById } from '../../../mocks';

export default function L_RepairProgressTemplate() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const id = params.get('id') || '';

  // 원본 레코드 (mode 확인용)
  const raw = useMemo(() => (id ? getRepairById(id) : null), [id]);

  // 집주인 부담(LANDLORD)인 건만 통과
  const isLandlordCase =
    raw && (raw.mode === 'LANDLORD' || raw.request?.payerLabel === '집주인 부담');

  // 입주민 템플릿이 요구하는 초기값들
  const init = useMemo(() => (id ? getProgressInitialProps(id) : null), [id]);

  if (!id || !raw) {
    // 잘못된 접근: id 없음/존재하지 않는 건
    return (
      <div style={{ padding: 24 }}>
        잘못된 접근입니다. 목록으로 돌아갑니다.
        <br />
        <button onClick={() => nav(-1)} style={{ marginTop: 12 }}>
          뒤로가기
        </button>
      </div>
    );
  }

  if (!isLandlordCase) {
    // 집주인 부담이 아닌 건은 열람 제한
    return (
      <div style={{ padding: 24 }}>
        집주인 부담으로 요청된 수리 건만 확인할 수 있어요.
        <br />
        <button onClick={() => nav(-1)} style={{ marginTop: 12 }}>
          뒤로가기
        </button>
      </div>
    );
  }

  // ✅ 동일 UI 재사용: 입주민 템플릿에 초기값 주입
  return (
    <RepairProgressTemplate
      initialStep={init?.initialStep}
      initialMode={init?.initialMode}
      initialSelectedQuoteId={init?.initialSelectedQuoteId}
      initialRequest={init?.initialRequest}
      initialQuotes={init?.initialQuotes}
    />
  );
}
