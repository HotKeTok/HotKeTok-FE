// src/components/common/Toast.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { typo } from '../../styles/tokens';

const ENTER_MS = 200;
const EXIT_MS = 200;

/**
 * Toast
 * - message: 표시할 문구
 * - height: 토스트 높이 (high / low (default: low))
 * - icon: 아이콘 경로 (기본 체크)
 * - show: 표시 여부 (true면 등장 애니메이션)
 * - duration: 자동 닫힘 시간(ms). 기본 1000
 * - onClose: 닫힌 뒤 콜백 (exit 애니메이션 완료 후 호출)
 */
export default function Toast({ message, height = 'low', icon, show, duration = 1000, onClose }) {
  const [mounted, setMounted] = useState(show);
  const [phase, setPhase] = useState(show ? 'enter' : 'exit'); // 'enter' | 'exit'
  const hideTimerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const closedRef = useRef(false);

  const iconCheckFilled = '/icon-check-filled.svg';
  const iconWarning = '/icon-warning.svg';

  if (icon == 'warning') {
    // icon에 warning 전달하면 빨간색 느낌표 아이콘 렌더링
    icon = iconWarning;
  } else icon = iconCheckFilled;

  // 바텀 고정 버튼이 있는 경우 토스트를 높이 표시
  const toastHeight = height === 'high' ? '64px' : '18px';

  // show 변경 반영
  useEffect(() => {
    if (show) {
      closedRef.current = false;
      setMounted(true);
      setPhase('enter');
      // 자동 닫힘 타이머
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setPhase('exit');
      }, Math.max(0, duration));
    } else if (mounted) {
      // 외부에서 show=false로 바뀌면 즉시 exit
      setPhase('exit');
    }
    return () => clearTimeout(hideTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, duration]);

  // exit 애니메이션이 끝나면 언마운트 + onClose
  useEffect(() => {
    if (phase !== 'exit') return;
    clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      setMounted(false);
      if (!closedRef.current) {
        closedRef.current = true;
        onClose?.();
      }
    }, EXIT_MS);
    return () => clearTimeout(exitTimerRef.current);
  }, [phase, onClose]);

  if (!mounted) return null;

  return (
    <ToastWrap $phase={phase} $height={toastHeight}>
      {icon && <Icon src={icon} alt="toast-icon" />}
      {message}
    </ToastWrap>
  );
}

/* === Animations === */
const toastIn = keyframes`
  from { transform: translate(-50%, 12px); opacity: 0; }
  to   { transform: translate(-50%, 0);    opacity: 1; }
`;

const toastOut = keyframes`
  from { transform: translate(-50%, 0);    opacity: 1; }
  to   { transform: translate(-50%, 12px); opacity: 0; }
`;

/* === Styles === */
const ToastWrap = styled.div`
  position: fixed;
  left: 50%;
  bottom: ${props => props.$height || '18px'};
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  ${typo('body2')};
  z-index: 2000; // 다른 모달들 위에 표시

  ${({ $phase }) =>
    $phase === 'enter'
      ? css`
          animation: ${toastIn} ${ENTER_MS}ms ease both;
        `
      : css`
          animation: ${toastOut} ${EXIT_MS}ms ease both;
        `}
`;

const Icon = styled.img`
  width: 16px;
`;
