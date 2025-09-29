import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import IcnClose from '../../assets/common/icon-close.svg?react';

/**
 * @function BaseModal
 * @description 공통 모달 컴포넌트(내부 컨텐츠는 children으로 전달)
 * @param {boolean} isOpen - 모달이 열려있는지 여부
 * @param {() => void} onClose - 모달을 닫는 함수
 * @param {React.ReactNode} children - 모달 내부에 표시될 컨텐츠
 * @param {boolean} [showCloseIcon=true] - 우측 상단 닫기 아이콘 표시 여부
 */
export default function Modal({ isOpen, onClose, children, showCloseIcon = true }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Container role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        {showCloseIcon && <CloseButton onClick={onClose} aria-label="Close modal" />}
        {children}
      </Container>
    </Overlay>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pop = keyframes`
  from {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 390px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 150ms ease-out;
`;

const Container = styled.div`
  position: relative;
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 85%;
  max-width: 400px;
  box-sizing: border-box;
  animation: ${pop} 200ms ease-out;
`;

const CloseButton = styled(IcnClose)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  path {
    stroke: #888;
  }
`;
