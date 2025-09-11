// src/components/repair/RequestSummary.jsx
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Row, Column } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';

/**
 * RequestSummary
 * - 수리 요청서 요약을 카드 형태로 표시하는 공용 컴포넌트
 *
 * props:
 * - context: {
 *     typeKey?: string,
 *     dateKey?: string (YYYY-MM-DD),
 *     time?: string,
 *     payer?: 'me' | 'landlord' | null,
 *     images?: string[],
 *     desc?: string,
 *     useAI?: boolean
 *   }
 * - address: string (요약에 표시할 주소)
 * - repairTypes: Array<{ key: string, label: string }>
 * - headingTitle?: string (상단 타이틀)
 * - headingSub?: string (상단 서브텍스트)
 * - showEdit?: boolean (우측 상단 '수정하기' 노출 여부)
 * - onEdit?: () => void
 */
export default function RequestSummary({
  context,
  address,
  repairTypes = [],
  headingTitle = '수리요청서 작성을 완료했어요!',
  headingSub = '작성한 요청서를 바탕으로 견적서를 받아볼 수 있어요.',
  showEdit = true,
  onEdit,
}) {
  const typeLabel = useMemo(() => {
    if (context?.typeKey) {
      const found = repairTypes.find(t => t.key === context.typeKey);
      return found ? found.label : context.typeKey;
    }
    return context?.useAI ? 'AI로 분석 예정' : '미선택';
  }, [context?.typeKey, context?.useAI, repairTypes]);

  const dateTimeLabel = useMemo(() => {
    if (context?.dateKey && context?.time) {
      const d = new Date(context.dateKey);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const day = d.getDate();
      return `${y}.${m}.${day} / ${context.time}`;
    }
    return '-';
  }, [context?.dateKey, context?.time]);

  const payerLabel = useMemo(() => {
    if (context?.payer === 'me') return '본인 부담';
    if (context?.payer === 'landlord') return '집주인 부담';
    return '-';
  }, [context?.payer]);

  const images = context?.images || [];
  const desc = context?.desc || '';

  return (
    <SummarySection>
      <Row $justify="space-between" style={{ marginBottom: '30px' }}>
        <Column>
          <SectionTitle>{headingTitle}</SectionTitle>
          <Caption1_600>{headingSub}</Caption1_600>
        </Column>

        {showEdit && (
          <EditLink
            role="button"
            tabIndex={0}
            onClick={onEdit}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onEdit && onEdit()}
            aria-label="수정하기"
          >
            수정하기
          </EditLink>
        )}
      </Row>

      <Column $gap={24}>
        <Row $justify="space-between">
          <ItemLabel>수리 분야</ItemLabel>
          <ItemValue>{typeLabel}</ItemValue>
        </Row>

        <Row $justify="space-between">
          <ItemLabel>수리 희망 날짜</ItemLabel>
          <ItemValue>{dateTimeLabel}</ItemValue>
        </Row>

        <Row $justify="space-between">
          <ItemLabel>비용 부담</ItemLabel>
          <ItemValue>{payerLabel}</ItemValue>
        </Row>

        <Row $justify="space-between">
          <ItemLabel>주소</ItemLabel>
          <ItemValue>{address || '-'}</ItemValue>
        </Row>

        {!!images.length && (
          <Column $gap={6}>
            <ItemLabel style={{ marginTop: 12 }}>증상 사진</ItemLabel>
            <ThumbRow>
              {images.map((url, idx) => (
                <Thumb key={`${url}-${idx}`} style={{ backgroundImage: `url(${url})` }} />
              ))}
            </ThumbRow>
          </Column>
        )}

        <Column $gap={8}>
          <ItemLabel>증상 설명</ItemLabel>
          <DescBox>
            {desc
              ? desc
              : context?.useAI
              ? 'AI가 작성한 설명이 여기에 표시됩니다.'
              : '작성된 설명이 없습니다.'}
          </DescBox>
        </Column>
      </Column>
    </SummarySection>
  );
}

/* ===================== 스타일 ===================== */
const SummarySection = styled.div`
  padding: 30px 24px;
`;

const SectionTitle = styled.h3`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
  margin: 0;
`;

const Caption1_600 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;

const EditLink = styled.div`
  ${typo('button2')};
  color: #3c66ff;
  cursor: pointer;
  user-select: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ItemLabel = styled.div`
  ${typo('button2')};
  color: ${color('grayscale.800')};
`;

const ItemValue = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  text-align: right;
`;

const DescBox = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  background: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 6px;
  padding: 13px 15px;
  white-space: pre-wrap;
`;

const ThumbRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: wrap;
`;

const Thumb = styled.div`
  width: 80px;
  height: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  border: 1px solid ${color('grayscale.200')};
`;
