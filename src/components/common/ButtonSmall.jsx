import styled from "styled-components"
import { resolveWidth } from "./Button"
import { typo, color } from "../../styles/tokens"

/**
 * @function ButtonSmall
 * @param {boolean} active - 활성/비활성 (기본 true)
 * @param {string} text - 버튼 텍스트
 * @param {'full'|number|string} width - 미지정: 100%, 'full': 100%, 숫자: px, 그 외 문자열 그대로
 * @param {function} onClick - 클릭 핸들러
 */

export default function ButtonSmall ({ active=true, text, width, onClick }) {
    return (
        <StyledButton
            type="button"
            $active={active}
            $width={width}
            onClick={active ? onClick : undefined}
            disabled={!active}
        >
            <div>{text}</div>
        </StyledButton>
    )
}

const StyledButton = styled.button`
    height: 42px;
    width: ${({ $width }) => resolveWidth($width)};
    border-radius: 8px;
    ${typo('button2')};

    background-color:  white;
    opacity: ${({ $active }) =>
        $active ? 1 : 0.3};
    border: 1px solid ${color('brand.primary')};
    color: ${color('brand.primary')};

    pointer-events: ${({ $active }) => ($active ? 'auto' : 'none')};
    cursor: ${({ $active }) => ($active ? 'pointer' : 'default')};

    /* 기본 인터랙션 */
    transition: background-color 0.15s ease, transform 0.02s ease;
`
