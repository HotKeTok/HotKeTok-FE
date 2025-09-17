import React from 'react';
import styled, { keyframes} from 'styled-components';
import { typo, color } from '../../styles/tokens';
import Button from './Button';

/**
 * 버튼이 하나인 안내 모달 컴포넌트
 * @param {object} props
 * @param {boolean} isOpen - 모달의 표시 여부
 * @param {React.ReactNode} titleComponent - 제목으로 표시될 리액트 컴포넌트
 * @param {string} description - 모달 설명
 * @param {function} onClose - 닫기 버튼 클릭 핸들러
 * @param {function} onConfirm - 확인 버튼 클릭 핸들러
 * @param {string} [confirmText='확인'] - 확인 버튼 텍스트
 */
export default function ActionGuideModal({
  isOpen,
  titleComponent,
  description,
  onClose,
  onConfirm,
  confirmText = '확인',
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dim onClick={onClose}>
      <Modal role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CloseButton>
        <TitleWrapper>{titleComponent}</TitleWrapper>
        <ModalDesc>{description}</ModalDesc>
        <Button text="네, 보낼게요" onClick={onConfirm} >{confirmText}</Button>
      </Modal>
    </Dim>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pop = keyframes`
  from {
    transform: scale(0.9) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
`;


const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 390px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 120ms ease;
  z-index: 1000;
`;

const Modal = styled.div`
  position: relative;
  width: 85%;
  border-radius: 15px;
  background: #fff;
  padding: 18px;
  animation: ${pop} 160ms ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 22px;
  right: 22px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  line-height: 1;
  color: ${color('grayscale.500')};
`;

const TitleWrapper = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
  margin-top: 32px;

  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalDesc = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
  white-space: pre-wrap;
  text-align: left;
`;
