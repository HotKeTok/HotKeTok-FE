import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import WhiteMainLogo from '../../../assets/common/BrandLogoWhite.png';
import ArrowDownIcon from '../../../assets/common/icon-arrow-down.svg?react';
import { Row } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';

/**
 * @param {object[]} addresses
 * @param {(id: string | number) => void} onSelectAddress - 주소 선택 시 호출될 콜백 함수
 */
export default function SelectHome({ addresses = [], onSelectAddress }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedHome = addresses.find(home => home.isCurrent === true);
  const displayTitle = selectedHome ? selectedHome.alias : '주소를 선택하세요';

  // 드롭다운 열기/닫기 토글
  const handleToggle = () => setIsOpen(!isOpen);

  // 드롭다운 아이템 선택
  const handleSelect = id => {
    onSelectAddress(id); // 부모 컴포넌트에 알림
    setIsOpen(false); // 드롭다운 닫기
  };

  useEffect(() => {
    // 문서 전체에 클릭 이벤트 리스너 추가
    function handleClickOutside(event) {
      // 클릭된 위치가 dropdownRef(컴포넌트)의 바깥쪽인지 확인
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // 바깥쪽이면 드롭다운 닫기
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]); // ref가 변경될 때만 실행

  return (
    <Row $gap={10} $align={'center'}>
      <img src={WhiteMainLogo} alt="Main Logo" style={{ width: 32, height: 27 }} />

      <DropdownWrapper ref={dropdownRef}>
        <TriggerRow $gap={6} $align={'center'} onClick={handleToggle}>
          <Subtitle1>{displayTitle}</Subtitle1>
          <ArrowDown $isOpen={isOpen} stroke={'#FFF'} />
        </TriggerRow>

        {isOpen && (
          <DropdownList>
            {addresses.map(address => (
              <DropdownItem
                key={address.address}
                onClick={() => handleSelect(address)}
                $isSelected={address.isCurrent}
              >
                {address.alias}
              </DropdownItem>
            ))}
          </DropdownList>
        )}
      </DropdownWrapper>
    </Row>
  );
}

const Subtitle1 = styled.span`
  ${typo('subtitle1')}
  color: #fff;
`;

const DropdownWrapper = styled.div`
  position: relative;
  user-select: none;
`;

const TriggerRow = styled(Row)`
  cursor: pointer;
`;

const ArrowDown = styled(ArrowDownIcon)`
  transition: transform 0.2s ease-in-out;
  transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});

  path {
    stroke: ${({ stroke }) => stroke || '#000'};
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 200px;
  background-color: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.300')};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px;
  margin: 0;
  list-style: none;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`;

const DropdownItem = styled.li`
  padding: 10px 12px;
  ${typo('body1')}
  background-color: ${({ $isSelected }) => ($isSelected ? color('grayscale.200') : '#fff')};
  font-weight: ${({ $isSelected }) => ($isSelected ? '600' : '400')};
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${color('grayscale.300')};
  }
`;
