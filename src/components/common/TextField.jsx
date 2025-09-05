import styled, { css } from 'styled-components';
import { color, typo } from '../../styles/tokens';

export default function TextField({
  placeholder,
  value,
  onChange,
  state,
  width,
  type = 'text',
  maxLength,
  inputMode,
  // Password 확인 관련 props
  rightIcon,
  onRightIconClick,
  rightIconAriaLabel = 'toggle visibility',
  disabled,
}) {
  return (
    <FieldWrapper $width={width}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        state={state}
        type={type}
        maxLength={maxLength}
        inputMode={inputMode}
        disabled={disabled}
        // 아이콘 공간 확보
        $hasRightIcon={!!rightIcon}
      />
      {rightIcon && (
        <IconButton
          type="button"
          onClick={onRightIconClick}
          aria-label={rightIconAriaLabel}
          tabIndex={0}
        >
          <img src={rightIcon} alt="" />
        </IconButton>
      )}
    </FieldWrapper>
  );
}

const FieldWrapper = styled.div`
  position: relative;
  width: ${(p) => p.$width || '100%'};
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding: 13px 15px;
  /* 우측 아이콘이 있으면 오른쪽 패딩 늘림 */
  padding-right: ${(p) => (p.$hasRightIcon ? '44px' : '15px')};

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

const IconButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
