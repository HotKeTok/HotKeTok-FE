import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MenuIcn from '../../assets/common/icon-menu.svg?react';
import { color, typo } from '../../styles/tokens';

/**
 * @function OptionsMenu
 * @description 메뉴 아이콘을 클릭하면 옵션 리스트가 표시되는 컴포넌트
 *
 * @param {object[]} options - 메뉴에 표시될 옵션 배열
 * @param {string} options[].label - 옵션의 텍스트
 * @param {function} options[].onClick - 옵션을 클릭했을 때 실행될 함수
 *
 * @example
 * const menuOptions = [
 * { label: '신고하기', onClick: () => console.log('Report') },
 * { label: '수정하기', onClick: () => console.log('Edit') },
 * ];
 *
 * <OptionsMenu options={menuOptions} />
 */
export default function OptionsMenu({ options = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleMenuClick = () => {
    setIsOpen(prev => !prev);
  };

  const handleItemClick = onClick => {
    onClick();
    setIsOpen(false);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <IconWrapper onClick={handleMenuClick}>
        <MenuIcn />
      </IconWrapper>

      {isOpen && (
        <MenuContainer>
          {options.map((option, index) => (
            <MenuItem key={index} onClick={() => handleItemClick(option.onClick)}>
              {option.label}
            </MenuItem>
          ))}
        </MenuContainer>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 30%;
  background-color: ${color('grayscale.100')};
  border-radius: 10px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  z-index: 10;
  overflow: hidden;
`;

const MenuItem = styled.div`
  padding: 16px 22px;
  cursor: pointer;
  white-space: nowrap;
  ${typo('body1')};
  color: ${color('grayscale.800')};

  &:hover {
    background-color: ${color('grayscale.200')};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${color('grayscale.300')};
  }
`;
