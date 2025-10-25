// src/templates/tenant/repair/RepairProgressTemplate.jsx
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Row, Column, Spacer } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';

import TopBar from '../../../components/common/TopBar';
import ButtonSmall from '../../../components/common/ButtonSmall';

// ✅ 분리된 컴포넌트들
import RequestAccordion from '../../../components/repair/repair-progress/RequestAccordion';
import StepFinding from '../../../components/repair/repair-progress/StepFinding';
import StepChoose from '../../../components/repair/repair-progress/StepChoose';
import StepMatched from '../../../components/repair/repair-progress/StepMatched';
import StepDone from '../../../components/repair/repair-progress/StepDone';

import { formatCategoryName } from '../../../utils/format';

const COST_MODE = { SELF: 'SELF', LANDLORD: 'LANDLORD' };
const STEP = { FINDING: 1, CHOOSE: 2, MATCHED: 3, DONE: 4 };

export default function RepairProgressTemplate({
  initialStep,
  initialMode,
  initialSelectedQuoteId,
  initialRequest,
  initialQuotes,
} = {}) {
  const [mode, setMode] = useState(initialMode ?? COST_MODE.SELF);
  const [step, setStep] = useState(initialStep ?? STEP.FINDING);
  const [selectedQuoteId, setSelectedQuoteId] = useState(initialSelectedQuoteId ?? null);

  const request = useMemo(() => initialRequest, [initialRequest]);
  const quotes = useMemo(() => initialQuotes ?? [], [initialQuotes]);
  const selectedQuote = quotes.find(q => q.id === selectedQuoteId) || null;

  const isDone = step === STEP.DONE;
  const canProceed = mode !== COST_MODE.LANDLORD && !!selectedQuoteId;

  // 데모 전환용 UI(유지)
  const DemoSwitch = () => (
    <Row $gap={8} style={{ padding: '10px 16px' }}>
      <ButtonSmall active text="본인부담 모드" onClick={() => setMode(COST_MODE.SELF)} />
      <ButtonSmall active text="집주인부담 모드" onClick={() => setMode(COST_MODE.LANDLORD)} />
      <Spacer x={8} />
      <ButtonSmall active text="STEP1" onClick={() => setStep(STEP.FINDING)} />
      <ButtonSmall active text="STEP2" onClick={() => setStep(STEP.CHOOSE)} />
      <ButtonSmall active text="STEP3" onClick={() => setStep(STEP.MATCHED)} />
      <ButtonSmall active text="STEP4" onClick={() => setStep(STEP.DONE)} />
    </Row>
  );

  return (
    <PageWithoutBottomBar>
      <TopBar title={isDone ? '완료된 수리' : '진행중인 수리'} />
      <ScrollableNoBottomBarContent>
        {/* ===== 상단 상태 + 스텝 인디케이터 (복구) ===== */}
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
                  (mode === COST_MODE.SELF
                    ? '마음에 드는 견적서를 선택해주세요!'
                    : '집주인이 견적서를 선택하는 중이에요.')}
                {step === STEP.MATCHED && '업체가 매칭되었어요!'}
              </GuideBubble>
            )}
          </Column>
        </WhiteSection>

        {/* ===== 요청서 요약 아코디언 ===== */}
        <RequestAccordion request={request} mode={mode} />

        {/* ===== 단계별 섹션 ===== */}
        {step === STEP.FINDING && <StepFinding />}

        {step === STEP.CHOOSE && (
          <StepChoose
            mode={mode}
            quotes={quotes}
            selectedQuoteId={selectedQuoteId}
            setSelectedQuoteId={setSelectedQuoteId}
            canProceed={canProceed}
            onProceed={() => setStep(STEP.MATCHED)}
          />
        )}

        {step === STEP.MATCHED && (
          <StepMatched
            mode={mode}
            selectedQuote={selectedQuote}
            onCancel={() => setStep(STEP.CHOOSE)}
          />
        )}

        {step === STEP.DONE && (
          <StepDone selectedQuote={selectedQuote} onWriteReview={() => alert('후기 작성')} />
        )}

        {/* 데모 전환용 UI 유지 */}
        <DemoSwitch />
      </ScrollableNoBottomBarContent>
    </PageWithoutBottomBar>
  );
}

/* ===== styles (복구된 상단 UI용) ===== */
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
