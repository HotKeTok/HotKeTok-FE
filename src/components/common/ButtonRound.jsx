import styled from "styled-components"
import { resolveWidth } from "./Button"
import { typo, color } from "../../styles/tokens"

/**
 * @function ButtonRound
 * @param {boolean} filled - 채워진 상태 여부 (기본 true)
 * @param {string} text - 버튼 텍스트
 * @param {'full'|number|string} width - 미지정: 100%, 'full': 100%, 숫자: px, 그 외 문자열 그대로(기본값: 'auto')
 * @param {function} onClick - 클릭 핸들러 (비워진 상태라면 핸들러 실행되지 않음)
 */

export default function ButtonRound ({ filled=true, text, width='auto', onClick }) {
    return (
        <StyledButton
            type="button"
            $filled={filled}
            $width={width}
            onClick={filled ? onClick : undefined}
            disabled={!filled}
        >
            <div>{text}</div>
        </StyledButton>
    )
}

const StyledButton = styled.button`
  height: 24px;
  width: ${({ $width }) => resolveWidth($width)};
  padding: 0 12px;
  border-radius: 30px;
  ${typo('button3')};

  background-color: ${({ $filled }) =>
    $filled ? color('brand.primary') : 'white'};
  border: 1.5px solid rgba(1, 210, 129, 0.30);
  background-clip: padding-box;
  /* 배경이 보더 영역까지 칠하지 않도록 추가 */
  color: ${({ $filled }) => ($filled ? 'white' : 'rgba(1, 210, 129, 0.50)')};

  pointer-events: ${({ $filled }) => ($filled ? 'auto' : 'none')};
  cursor: ${({ $filled }) => ($filled ? 'pointer' : 'default')};

  transition: background-color 0.15s ease, transform 0.02s ease;
`;

