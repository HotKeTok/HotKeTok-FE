import styled from 'styled-components';
import { resolveWidth } from './Button';
import { typo, color } from '../../styles/tokens';

/**
 * @function ButtonRound
 * @param {boolean} filled - 채워진 상태 여부 (기본 true)
 * @param {boolean} disabled - 비활성화 여부 (기본 false)
 * @param {string} text - 버튼 텍스트
 * @param {'full'|number|string} width - 미지정: auto, 'full': 100%, 숫자: px, 그 외 문자열 그대로(기본값: 'auto')
 * @param {'full'|number} height - 미지정: 24, 숫자: px, 'full': 100% (기본값: 24)
 * @param {function} onClick - 클릭 핸들러
 */

export default function ButtonRound({
  filled = true,
  disabled = false,
  text,
  width = 'auto',
  height = 24,
  onClick,
}) {
  return (
    <StyledButton
      type="button"
      $filled={filled}
      $width={width}
      $height={height}
      onClick={onClick && onClick}
      $disabled={disabled}
    >
      <div>{text}</div>
    </StyledButton>
  );
}

const StyledButton = styled.button`
  width: ${({ $width }) => resolveWidth($width)};
  height: ${({ $height }) => ($height === 'full' ? '100%' : `${$height}px`)};
  padding: 0 12px;
  border-radius: 30px;
  ${typo('button1')};

  background-color: ${({ $filled }) => ($filled ? color('brand.primary') : 'white')};
  border: 1.5px solid rgba(1, 210, 129, 0.3);
  background-clip: padding-box;
  /* 배경이 보더 영역까지 칠하지 않도록 추가 */
  color: ${({ $filled }) => ($filled ? 'white' : 'rgba(1, 210, 129, 0.50)')};

  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};

  transition: background-color 0.15s ease, transform 0.02s ease;
`;
