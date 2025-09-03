// ModeItem.jsx
import styled, { css } from 'styled-components';
import { color } from '../../styles/tokens';

export default function ModeItem({ children, selected, onClick, width, height, padding }) {
  return (
    <ItemBox selected={selected} onClick={onClick} width={width} height={height} padding={padding}>
      {children}
    </ItemBox>
  );
}

const ItemBox = styled.div`
  box-sizing: border-box;
  display: flex;
  border-radius: 15px;
  border: 1px solid ${color('grayscale.300')};
  cursor: pointer;
  transition: border 0.2s ease;

  /* ✅ 기본값 + props override */
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '100px'};
  padding: ${(props) => props.padding || '22px 25px'};

  ${(props) =>
    props.selected &&
    css`
      border: 1px solid ${color('brand.primary')};
    `}
`;
