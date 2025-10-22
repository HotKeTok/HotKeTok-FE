import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { typo, color } from '../../styles/tokens';
import IcnClose from '../../assets/common/icon-close.svg?react';
import Button from './Button';

/**
 * 공통 확인 모달 컴포넌트
 * @param {object} props
 * @param {boolean} props.isOpen - 모달의 표시 여부
 * @param {boolean} props.isXbutton - X버튼 표시 여부
 * @param {string} props.title - 모달 제목
 * @param {string} props.description - 모달 설명
 * @param {function} props.onClose - 취소/닫기 버튼 클릭 핸들러
 * @param {function} props.onConfirm - 확인 버튼 클릭 핸들러
 * @param {string} [props.cancelText='아니요'] - 취소 버튼 텍스트
 * @param {string} [props.confirmText='확인'] - 확인 버튼 텍스트
 */
export default function ConfirmModal({
  isOpen,
  isXbutton = true,
  title,
  description,
  onClose,
  onConfirm,
  cancelText = '아니오',
  confirmText = '확인',
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dim onClick={onClose}>
      <Modal role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        {isXbutton ? <CloseIcon onClick={onClose} aria-label="Close modal" /> : null}
        <div>
          <ModalTitle>{title}</ModalTitle>
          <ModalDesc>{description}</ModalDesc>
        </div>

        <ButtonRow>
          <Button active={true} dismiss={true} text={cancelText} onClick={onClose} />
          <Button text={confirmText} onClick={onConfirm} />
        </ButtonRow>
      </Modal>
    </Dim>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

// --- Styled Components ---
const CloseIcon = styled(IcnClose)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 16px;
  height: 16px;
  cursor: pointer;
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
  z-index: 1000000;
`;

const ModalBase = css`
  position: relative;
  width: 80%;
  border-radius: 15px;
  background: #fff;
  padding: 24px;
  animation: ${pop} 160ms ease;
`;

const Modal = styled.div`
  ${ModalBase}
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 30px;

  position: relative;
`;

const ModalTitle = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
  margin-top: 10px;
`;

const ModalDesc = styled.div`
  ${typo('body1')}
  color: ${color('grayscale.800')};
  white-space: pre-wrap;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const ModalButton = styled.button`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 48px;
  border-radius: 10px;
  ${typo('button2')}
  cursor: pointer;

  ${({ $variant }) =>
    $variant === 'ghost'
      ? css`
          color: ${color('grayscale.600')};
          background: #fff;
          border: 1px solid ${color('grayscale.300')};
        `
      : css`
          color: white;
          background: ${color('brand.primary')};
          border: none;
        `}
`;
