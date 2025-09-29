import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import ArrowDown from '../../assets/common/icon-arrow-down.svg?react';
import ArrowRight from '../../assets/common/icon-arrow-right.svg?react';
import { typo, color } from '../../styles/tokens';
import { useNavigate } from 'react-router-dom';

/**
 * @function BoxToggle
 * @description 특정 층에 대해 입주민 호수 선택 토글 박스 컴포넌트
 * @param {[]} floorTenantsInfo - 층수별 입주민 정보
 * @returns
 */
export default function BoxToggleTenant({ floorTenantsInfo }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const contentRef = useRef(null);

  const toggleHandler = () => {
    setIsOpen(prev => !prev);
  };

  const handleTenantClick = id => {
    navigate(`/admin/tenants/detail/${id}`);
  };

  // TODO: api에서 받아온 호수 데이터 매핑, tag 여러개 처리

  return (
    <ToggleContainer>
      <ToggleHeader onClick={toggleHandler}>
        <Subtitle1>{floorTenantsInfo.floor}</Subtitle1>
        <Arrow isOpen={isOpen} src={ArrowDown} style={{ width: 10, objectFit: 'cover' }}>
          <ArrowDown />
        </Arrow>
      </ToggleHeader>

      <ToggleContentContainer
        ref={contentRef}
        isOpen={isOpen}
        maxHeight={contentRef.current?.scrollHeight}
      >
        {floorTenantsInfo.residents.map(tenant => (
          <ToggleContent
            key={tenant.id}
            onClick={() => handleTenantClick(tenant.id)}
            state={tenant.state === 'APPROVED'}
          >
            <Body2>{tenant.unit}</Body2>
            <ArrowRightStyled />
          </ToggleContent>
        ))}
      </ToggleContentContainer>
    </ToggleContainer>
  );
}

const ToggleContainer = styled.div`
  width: 100%;
  padding: 16px 14px;

  border: 1px solid #efefef;
  border-radius: 10px;
  background: #fafafb;
  overflow: hidden;
`;

const ToggleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: #f9f9f9;
  font-weight: bold;
  font-size: 18px;

  color: #1f1f1f;
`;

const Arrow = styled.div`
  transition: transform 0.3s ease;
  transform: rotate(${props => (props.isOpen ? '180deg' : '0deg')});
  width: 10px;
  object-fit: cover;
`;

const ArrowRightStyled = styled(ArrowRight)`
  width: 10px;
  height: 10px;

  path {
    stroke: ${color('grayscale.500')};
  }
`;

const ToggleContentContainer = styled.div`
  overflow: hidden;
  padding: ${props => (props.isOpen ? '16px 0px' : '0px 0px')};

  max-height: ${props => (props.isOpen ? `400px` : '0px')};
  transition: max-height 0.3s ease, padding 0.5s ease;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const ToggleContent = styled.div`
  height: 60px;
  padding: 0px 15px;
  background-color: #fff;
  border-radius: 10px;
  border: 1.5px solid #dedede;
  width: 100%;
  color: black;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  cursor: pointer;

  ${props =>
    props.state
      ? css`
          border: 1.5px solid var(--Color-Primary, #01d281);
        `
      : css``}
`;

const Subtitle1 = styled.div`
  ${typo('subtitle1')};
`;

const Body2 = styled.div`
  ${typo('body2')};
`;
