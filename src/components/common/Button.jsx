import styled from 'styled-components'
import { typo, color } from '../../styles/tokens'

/**
 * @function Button
 * @param {boolean} active - 활성/비활성 (기본 true)
 * @param {string} text - 버튼 텍스트
 * @param {'full'|number|string} width - 미지정: 100%, 'full': 100%, 숫자: px, 그 외 문자열 그대로
 * @param {boolean} dismiss - 닫기/보조 액션 스타일 (기본 false)
 * @param {function} onClick - 클릭 핸들러
 */
export default function Button({
  active = true,
  text,
  width,           // undefined면 100%
  dismiss = false,
  onClick,
  ...rest
}) {
  return (
    <StyledButton
      type="button"
      $active={active}
      $width={width}
      $dismiss={dismiss}
      onClick={active ? onClick : undefined}
      disabled={!active}
      {...rest}
    >
      <div>{text}</div>
    </StyledButton>
  )
}

/**
 * @function resolveWidth
 * 버튼의 너비를 동적으로 결정하는 함수
 */
export const resolveWidth = (w) => {
  if (w === undefined || w === null) return '100%';      // 기본값: 100%
  if (w === 'full') return '100%';                       // 명시적 full 
  if (typeof w === 'number') return `${w}px`;            // 숫자(px)
  if (typeof w === 'string') return w;                   // '320px', '80%', 등
  return '100%';
};

const StyledButton = styled.button`
  height: 50px;
  width: ${({ $width }) => resolveWidth($width)};
  border-radius: 10px;
  ${typo('button1')};

  /* 상태별 색상 (기본/dismiss) */
  background-color: ${({ $dismiss }) =>
    $dismiss ? 'white' : color('brand.primary')};
  color: ${({ $dismiss }) =>
    $dismiss ? color('grayscale.600') : 'white'};
  border: ${({ $dismiss }) =>
    $dismiss ? `1px solid #DEDEDE` : 'none'};

  /* active=false 시 시각/포인터 비활성 */
  opacity: ${({ $active }) => ($active ? 1 : 0.3)};
  pointer-events: ${({ $active }) => ($active ? 'auto' : 'none')};
  cursor: ${({ $active }) => ($active ? 'pointer' : 'default')};

  /* 기본 인터랙션 */
  transition: background-color 0.15s ease, opacity 0.15s ease, transform 0.02s ease;
`
