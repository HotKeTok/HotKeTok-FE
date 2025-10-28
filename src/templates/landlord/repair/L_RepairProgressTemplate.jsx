// src/templates/landlord/repair/L_RepairProgressTemplate.jsx
import React from 'react';
import RepairProgressTemplate from '../../../templates/tenant/repair/RepairProgressTemplate';

/**
 * L_RepairProgressTemplate
 * - 집주인 UI용 상세 페이지
 * - 입주민용 RepairProgressTemplate 재사용
 * - isLandlordView=true 로 권한/로직 전환
 */
export default function L_RepairProgressTemplate({
  request,
  quotes,
  initialStep,
  initialSelectedQuoteId,
  mode = 'LANDLORD',
  landlordCanSelect = false,
}) {
  return (
    <RepairProgressTemplate
      initialStep={initialStep}
      initialMode={mode} // LANDLORD 고정
      initialSelectedQuoteId={initialSelectedQuoteId}
      initialRequest={request}
      initialQuotes={quotes}
      isLandlordView={true} //  집주인 권한 열기 (핵심)
      landlordCanSelect={landlordCanSelect}
    />
  );
}
