import React from 'react';
import styled, { css } from 'styled-components';
import { color, typo } from '../../styles/tokens';

/**
 * VerificationBadge
 * 상태 표기용 뱃지 컴포넌트
 *
 * Props
 * - status: 'pending' | 'verified'  (필수)
 * - label?: string                  (텍스트 오버라이드)
 * - height?: string | number        (뱃지 높이, 기본 20px)
 * - typoKey?: string                (디자인 토큰 typo key, 기본 'button3')
 * - className?: string
 * - style?: React.CSSProperties
 */
export default function VerificationBadge({
  status,
  label,
  height = 20,
  typoKey = 'button3',
  className,
  style,
}) {
  const isVerified = status === 'verified';
  const text = label ?? (isVerified ? '인증 완료' : '인증 전');

  return (
    <Badge
      $verified={isVerified}
      $height={height}
      $typoKey={typoKey}
      className={className}
      style={style}
    >
      {text}
    </Badge>
  );
}

/* =========================
 * Styled
 * ======================= */
const Badge = styled.div`
  display: flex;
  width: 55px;
  padding: 0 6px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 30px;

  /* ✅ height props 반영 */
  height: ${p => (typeof p.$height === 'number' ? `${p.$height}px` : p.$height)};

  /* ✅ typo props 반영 */
  ${p => typo(p.$typoKey || 'button3')}

  /* 상태별 스타일 */
  ${p =>
    p.$verified
      ? css`
          border: 1px solid ${color('grayscale.800')};
          background: ${color('grayscale.700')};
          color: var(--Basic-White, #fff);
        `
      : css`
          border: 1px solid ${color('grayscale.400')};
          background: transparent;
          color: ${color('grayscale.500')};
        `}
`;
