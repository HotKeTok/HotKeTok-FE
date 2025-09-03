import styled, { css } from 'styled-components';
import { color, typo } from '../../styles/tokens';

export default function TextField({ placeholder, value, onChange, state, width }) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      state={state}
      width={width}
    />
  );
}

const Input = styled.input`
  box-sizing: border-box;
  width: ${(props) => props.width || '100%'};
  height: 44px;
  padding: 13px 15px;
  border-radius: 6px;
  border: 1px solid var(--Basic-GrayScale-Gray-200, #efefef);
  background: var(--Basic-GrayScale-Gray-100, #fafafb);

  outline: none;
  transition: border-color 0.2s ease;
  ${typo('body2')};
  color: ${color('grayscale.800')};
  &::placeholder {
    color: ${color('grayscale.400')};
  }

  ${(props) =>
    props.state === 'error' &&
    css`
      border-color: rgba(255, 63, 63, 0.5);
    `}

  ${(props) =>
    props.state === 'success' &&
    css`
      border-color: rgba(1, 210, 129, 0.5);
    `}
`;
