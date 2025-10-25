// src/components/repair/repair-progress/RequestAccordion.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import RequestSummary from '../RequestSummary';

export default function RequestAccordion({ request, mode }) {
  const [open, setOpen] = useState(true);

  return (
    <Accordion>
      <AccordionHeader onClick={() => setOpen(o => !o)}>
        <AccordionTitle>요청서</AccordionTitle>
        <Chevron $open={open} />
      </AccordionHeader>

      <Collapsible isOpen={open}>
        <AccordionBody>
          <RequestSummary
            context={{
              typeKey: 'etc',
              fullDateLabel: request?.hopeAt, // 완성된 문자열 그대로
              payer: mode === 'SELF' ? 'me' : 'landlord',
              images: request?.images || [],
              desc: request?.description || '',
              useAI: false,
            }}
            address={request?.address || ''}
            repairTypes={[{ key: 'etc', label: request?.categoryLabel || '기타' }]}
          />
        </AccordionBody>
      </Collapsible>
    </Accordion>
  );
}

/* ===== Collapsible (원래처럼 부드럽게 열리고 닫히는 아코디언) ===== */
function Collapsible({ isOpen, children, className }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  // isOpen 변경 시 높이 계산
  useEffect(() => {
    if (!ref.current) return;
    const next = isOpen ? ref.current.scrollHeight : 0;
    setHeight(next);
  }, [isOpen, children]);

  // 내부 콘텐츠 리사이즈에도 대응 (이미지 로딩 등)
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => {
      if (isOpen) setHeight(ref.current.scrollHeight);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [isOpen]);

  return (
    <CollapsibleOuter
      className={className}
      style={{
        height,
        opacity: isOpen ? 1 : 0,
        transform: `translateY(${isOpen ? 0 : -4}px)`,
      }}
      aria-hidden={!isOpen}
    >
      <div ref={ref}>{children}</div>
    </CollapsibleOuter>
  );
}

/* ===== styles: 컴포넌트화 이전 스타일과 동일하게 복구 ===== */
const Accordion = styled.div`
  margin-top: 10px;
  background: #fff;
  overflow: hidden; /* 모서리/애니메이션 시 내용 튀어나옴 방지 */
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  cursor: pointer;
`;

const AccordionTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
`;

const Chevron = styled.div`
  width: 6px;
  height: 6px;
  display: inline-block;
  border-right: 2px solid ${color('grayscale.500')};
  border-bottom: 2px solid ${color('grayscale.500')};
  transform: rotate(${p => (p.$open ? '-135deg' : '45deg')});
  transition: transform 0.2s ease;
`;

const AccordionBody = styled.div`
  padding: 16px 24px;
  background: #fff; /* 상하단 모두 흰 배경, 헤더와 바디 사이 보더 없음(기존과 동일) */
`;

const CollapsibleOuter = styled.div`
  overflow: hidden;
  transition: height 240ms ease, opacity 200ms ease, transform 200ms ease;
`;
