import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Row, Column } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';

import TopBar from '../../../components/common/TopBar';

// 분리 컴포넌트
import RequestAccordion from '../../../components/repair/repair-progress/RequestAccordion';
import StepSearching from '../../../components/repair/repair-progress/StepSearching';
import StepChoosing from '../../../components/repair/repair-progress/StepChoosing';
import StepMatching from '../../../components/repair/repair-progress/StepMatching';
import StepCompleted from '../../../components/repair/repair-progress/StepCompleted';

import { formatCategoryName } from '../../../utils/format';
import { apiSelectEstimate } from '../../../api/estimate-service';
import { getAccessToken } from '../../../utils/auth';

const COST_MODE = { SELF: 'SELF', LANDLORD: 'LANDLORD' };
const STEP = { FINDING: 1, CHOOSE: 2, MATCHED: 3, DONE: 4 };

export default function RepairProgressTemplate({
  initialStep,
  initialMode,
  initialSelectedQuoteId,
  initialRequest,
  initialQuotes,
  isLandlordView = false, // ✅ 집주인 화면 여부
  landlordCanSelect = false,
} = {}) {
  console.log(initialRequest);
  const [mode] = useState(initialMode ?? COST_MODE.SELF);
  const [step, setStep] = useState(initialStep ?? STEP.FINDING);
  const [selectedQuoteId, setSelectedQuoteId] = useState(initialSelectedQuoteId ?? null);

  const request = useMemo(() => initialRequest, [initialRequest]);
  const quotes = useMemo(() => initialQuotes ?? [], [initialQuotes]);
  const selectedQuote = quotes.find(q => q.id === selectedQuoteId) || null;

  const isDone = step === STEP.DONE;

  const canProceed =
    !!selectedQuoteId &&
    ((isLandlordView && landlordCanSelect) || (!isLandlordView && mode !== COST_MODE.LANDLORD));

  // ✅ 권한 있으면 항상 선택 API 호출
  const handleProceed = async () => {
    if (!canProceed) {
      // 선택 권한 없음 안내(선택)
      if (isLandlordView && !landlordCanSelect) {
        alert('집주인 부담 건이 아닙니다. 견적서 선택 권한이 없습니다.');
      }
      return;
    }
    const token = getAccessToken();
    const res = await apiSelectEstimate(token, selectedQuoteId);
    if (!res.success) {
      alert(res.message || '견적서 선택에 실패했습니다.');
      return;
    }
    setStep(STEP.MATCHED);
  };

  return (
    <PageWithoutBottomBar>
      <TopBar title={isDone ? '완료된 수리' : '진행중인 수리'} />
      <ScrollableNoBottomBarContent style={{ backgroundColor: '#fff' }}>
        {/* 상단 상태 + 스텝 인디케이터 */}
        <WhiteSection>
          <Row $justify="space-between" style={{ marginBottom: '15px' }}>
            <StatusBadge>{isDone ? '처리 완료' : '진행중'}</StatusBadge>
          </Row>

          <Column $gap={20}>
            {/* 카테고리/요청일 */}
            <Column $gap={6}>
              <Category>{formatCategoryName(request?.categoryLabel || '-')}</Category>
              <RequestDate>{request?.requestedAt || ''}</RequestDate>
            </Column>

            {/* 스텝바 */}
            <StepBar>
              <StepDot $active={step === STEP.FINDING}>업체{'\n'}찾는 중</StepDot>
              <StepDivider />
              <StepDot $active={step === STEP.CHOOSE}>견적서{'\n'}선택</StepDot>
              <StepDivider />
              <StepDot $active={step === STEP.MATCHED}>업체{'\n'}매칭</StepDot>
              <StepDivider />
              <StepDot $active={step === STEP.DONE}>처리{'\n'}완료</StepDot>
            </StepBar>

            {/* 가이드 버블 */}
            {!isDone && (
              <GuideBubble>
                {step === STEP.FINDING && '수리업체에서 요청서를 확인하고 있어요.'}
                {step === STEP.CHOOSE &&
                  (isLandlordView
                    ? '도착한 견적서 중 수리를 진행할 업체를 선택하세요.'
                    : mode === COST_MODE.SELF
                    ? '마음에 드는 견적서를 선택해주세요!'
                    : '집주인이 견적서를 선택하는 중이에요.')}
                {step === STEP.MATCHED && '업체가 매칭되었어요!'}
              </GuideBubble>
            )}
          </Column>
        </WhiteSection>

        {/* 요청서 아코디언 */}
        <RequestAccordion request={request} mode={isLandlordView ? COST_MODE.LANDLORD : mode} />

        {/* 단계별 섹션 */}
        {step === STEP.FINDING && <StepSearching />}

        {step === STEP.CHOOSE && (
          <StepChoosing
            mode={isLandlordView ? COST_MODE.LANDLORD : mode}
            isLandlordView={isLandlordView}
            landlordCanSelect={landlordCanSelect}
            quotes={quotes}
            selectedQuoteId={selectedQuoteId}
            setSelectedQuoteId={setSelectedQuoteId}
            canProceed={canProceed}
            onProceed={handleProceed}
          />
        )}

        {step === STEP.MATCHED && (
          <StepMatching
            mode={isLandlordView ? COST_MODE.LANDLORD : mode}
            selectedQuote={selectedQuote}
            hopeAt={request?.hopeAt}
            onCancel={() => setStep(STEP.CHOOSE)}
          />
        )}

        {step === STEP.DONE && (
          <StepCompleted
            selectedQuote={selectedQuote}
            hopeAt={request?.hopeAt}
            onWriteReview={() => alert('후기 작성')}
          />
        )}
      </ScrollableNoBottomBarContent>
    </PageWithoutBottomBar>
  );
}

/* ===== styles ===== */
const WhiteSection = styled.div`
  box-sizing: border-box;
  padding: 20px 24px;
  width: 100%;
  background-color: white;
`;
const StatusBadge = styled.div`
  ${typo('button3')}
  color: ${color('white')};
  display: flex;
  height: 24px;
  padding: 0 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 30px;
  border: 1.5px solid rgba(1, 210, 129, 0.3);
  background: ${color('brand.primary')};
`;
const Category = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.600')};
`;
const RequestDate = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.500')};
`;
const StepBar = styled.div`
  display: grid;
  grid-template-columns:
    max-content minmax(16px, 1fr)
    max-content minmax(16px, 1fr)
    max-content minmax(16px, 1fr)
    max-content;
  align-items: center;
`;
const StepDot = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 56px;
  height: 56px;
  ${typo('button3')}
  white-space: pre-line;
  text-align: center;
  justify-content: center;
  align-items: center;
  color: ${color('grayscale.800')};
  background: ${color('grayscale.100')};
  border: 1px ${({ $active }) => ($active ? 'solid' : 'dashed')} ${color('brand.primary')};
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  padding: 10px;
  border-radius: 50%;
`;
const StepDivider = styled.div`
  height: 1px;
  margin: 0 8px;
  background: ${color('brand.primary')};
  opacity: 0.4;
`;
const GuideBubble = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  ${typo('body2')}
  height: 46px;
  text-align: center;
  padding: 10px 12px;
  border: 1px solid ${color('grayscale.300')};
  border-radius: 10px;
  color: ${color('grayscale.600')};
`;
