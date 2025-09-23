import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import ArrowUp from '../../assets/common/icon-arrow-up.svg?react';

/**
 * @function Dropdown
 * @param {boolean} isOpen
 * @param {()=>void} toggleDropdown
 * @param {()=>void} closeDropdown 닫기
 * @param {string} selected 컨테이너 텍스트
 * @param {(value: string) => void} setSelected 선택된 아이템 설정 함수
 * @param {string[]} items 버튼 list
 * @returns
 */
const Dropdown = ({ isOpen, toggleDropdown, closeDropdown, selected, setSelected, items }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    // 외부 클릭 시 closeDropdown 함수 호출
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  const handleItemClick = value => {
    setSelected(value); // 부모의 상태 업데이트
    closeDropdown(); // 메뉴 닫기
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        <div>{selected}</div>
        <StyledArrowUp isOpen={isOpen} />
      </DropdownButton>

      <Menu isOpen={isOpen}>
        {items.map((item, index) => (
          <MenuItem key={index} onClick={() => handleItemClick(item.label)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </DropdownContainer>
  );
};

export default Dropdown;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  color: ${color('grayscale.600')};
  padding: 12px 3px;

  ${typo('button1')}
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${color('grayscale.200')};
  }
`;

const StyledArrowUp = styled(ArrowUp)`
  transform: rotate(180deg);
  ${props => (props.isOpen ? 'transform: rotate(0deg);' : '')}
  transition: transform 0.2s ease;
`;

const Menu = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')}; // isOpen prop에 따라 보임/숨김
  padding: 10px;

  position: absolute;
  background-color: ${color('grayscale.100')};
  min-width: 200px;
  max-width: 300px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  z-index: 1;
  overflow: hidden;
`;

const MenuItem = styled.a`
  color: black;
  padding: 8px 12px;
  text-decoration: none;
  display: block;
  transition: background-color 0.2s ease;
  border-radius: 10px;
  ${typo('body1')}
  word-break: keep-all;

  &:hover {
    background-color: ${color('grayscale.200')};
  }
`;
