import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CONTAINER_WIDTH } from '../../styles/layout';

const Z_INDEX_BACKDROP = 9998;
const Z_INDEX_SHEET = 9999;

/**
 * @function BottomSheet : 공통 바텀시트 컴포넌트
 * @param {boolean} isOpen : 열림/닫힘 상태
 * @param {function} onClose : 바텀시트 닫기 함수
 * @param {string} height - ex) '300px', '50dvh' (default: '422px')
 * @param {node} children - 바텀시트 내부에 렌더링할 컴포넌트
 * @returns {JSX.Element}
 */
function BottomSheet({
  isOpen,
  onClose,
  height = '422px', // 기본 높이
  children,
}) {
  const [mounted, setMounted] = useState(isOpen);
  const [opening, setOpening] = useState(isOpen);
  const timerRef = useRef(null);

  // 애니메이션 정의
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => setOpening(true));
    } else if (mounted) {
      setOpening(false);
      timerRef.current = setTimeout(() => setMounted(false), 240);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, mounted]);

  // body 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opening]);

  if (!mounted) return null;

  const handleBackdropClick = () => {
    onClose?.();
  };

  const stop = e => e.stopPropagation();

  return createPortal(
    <>
      <Backdrop
        className={opening ? 'open' : ''}
        onClick={handleBackdropClick}
        $CONTAINER_WIDTH={CONTAINER_WIDTH}
      />
      <Sheet
        className={opening ? 'open' : ''}
        onClick={stop}
        $height={height}
        role="dialog"
        aria-modal="true"
        $CONTAINER_WIDTH={CONTAINER_WIDTH}
      >
        {children}
      </Sheet>
    </>,
    document.body
  );
}

export default BottomSheet;

/* ⬇️ 기존 inset:0 제거 → 중앙 정렬 + 고정 너비 + 전체 높이 */
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: ${({ $CONTAINER_WIDTH }) => $CONTAINER_WIDTH};
  height: 100dvh;

  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 180ms ease;
  z-index: ${Z_INDEX_BACKDROP};
  &.open {
    opacity: 1;
  }
`;

const Sheet = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 100%); /* 초기: 화면 아래 */
  width: ${CONTAINER_WIDTH};
  height: ${({ $height }) => $height || 'auto'};
  max-height: 95dvh;
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
  padding-bottom: env(safe-area-inset-bottom);
  transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: ${Z_INDEX_SHEET};
  will-change: transform;

  &.open {
    transform: translate(-50%, 0);
  }
`;
