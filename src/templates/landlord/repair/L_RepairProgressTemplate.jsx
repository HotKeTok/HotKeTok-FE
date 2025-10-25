import React from 'react';
import RepairProgressTemplate from '../../../templates/tenant/repair/RepairProgressTemplate';
import styled from 'styled-components';
/**
 * L_RepairProgressTemplate
 * - 집주인 UI용 상세 페이지
 * - 입주민용 RepairProgressTemplate 재사용
 * - mode='LANDLORD' 로 고정하여 견적 선택 가능
 */
export default function L_RepairProgressTemplate({
  request,
  quotes,
  initialStep,
  initialSelectedQuoteId,
  mode = 'LANDLORD',
}) {
  return (
    <RepairProgressTemplate
      initialStep={initialStep}
      initialMode={mode} // LANDLORD 고정 → 견적 선택 가능
      initialSelectedQuoteId={initialSelectedQuoteId}
      initialRequest={request}
      initialQuotes={quotes}
      isLandlordView={true}
    />
  );
}
