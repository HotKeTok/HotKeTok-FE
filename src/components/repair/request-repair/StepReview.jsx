import React from 'react';
import TopBar from '../../../components/common/TopBar';
import Button from '../../../components/common/Button';
import RequestSummary from '../../../components/repair/RequestSummary';
import { Row, Column } from '../../../styles/flex';
import { SummarySection, EditLink, SectionTitle, Caption1_600 } from './styles';
import { REPAIR_TYPES } from './constants';
import { Page, ScrollableNoBottomBarContent } from '../../../styles/layout';

export default function StepReview({
  context,
  onEdit,
  onSubmit,
  onBack,
  currentAddress,
  onSubmitRequest,
}) {
  const displayAddress = (() => {
    const a = currentAddress?.address?.trim();
    const n = currentAddress?.number?.trim();
    if (a && n) return `${a} ${n}`;
    if (a) return a;
    if (n) return n;
    return '';
  })();

  return (
    <Page>
      <TopBar title="수리요청서 작성" onBack={onBack} />
      <ScrollableNoBottomBarContent>
        <SummarySection>
          <Row $justify="space-between">
            <Column>
              <SectionTitle>수리요청서 작성을 완료했어요!</SectionTitle>
              <Caption1_600>작성한 요청서를 바탕으로 견적서를 받아볼 수 있어요.</Caption1_600>
            </Column>
            <EditLink onClick={onEdit}>수정하기</EditLink>
          </Row>

          <RequestSummary context={context} address={displayAddress} repairTypes={REPAIR_TYPES} />
        </SummarySection>
        <div style={{ height: '50px' }} />
        <div
          style={{
            padding: '10px 25px',
            position: 'fixed',
            bottom: '0',
            width: '100%',
            backgroundColor: '#fff',
          }}
        >
          <Button
            text="제출하기"
            active
            onClick={async () => {
              if (typeof onSubmitRequest === 'function') {
                const result = await onSubmitRequest(context);
                // ✅ 성공 시에만 Done 스텝으로
                if (result?.ok) onSubmit();
              } else {
                onSubmit(); // 안전장치: 콜백 없으면 기존 동작 유지
              }
            }}
          />
        </div>
      </ScrollableNoBottomBarContent>
    </Page>
  );
}
