import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import PencilIcn from '../../assets/communication/message/pencil-icon.svg?react';
import { Row } from '../../styles/flex';

export default function ButtonFixed({ text, isIcn = true, onClick }) {
  return (
    <Btn onClick={onClick}>
      {isIcn && <Pencil />}
      {text}
    </Btn>
  );
}

const Btn = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;

  position: fixed;
  right: calc((100vw - var(--container-w, 390px)) / 2 + 20px);
  bottom: calc(env(safe-area-inset-bottom, 0) + 16px); // 바텀바 없는 화면 기준
  z-index: 1000;

  white-space: nowrap;
  ${typo('button1')}
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 24px;
  border-radius: 50px;
  background: ${color('brand.primary')};
  color: #fff;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const Pencil = styled(PencilIcn)`
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  path {
    stroke: #fff;
  }
`;
