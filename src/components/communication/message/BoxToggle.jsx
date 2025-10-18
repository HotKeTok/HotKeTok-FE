import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import ArrowDown from '../../../assets/common/icon-arrow-down.svg?react';
import { typo } from '../../../styles/tokens';
import { color } from '../../../styles/tokens';

export default function BoxToggle({ floor, units = [], handleSelectReceiver, selectedId }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggleHandler = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <ToggleContainer>
      <ToggleHeader onClick={toggleHandler}>
        <Subtitle1>{floor}</Subtitle1>
        <Arrow isOpen={isOpen}>
          <ArrowDown />
        </Arrow>
      </ToggleHeader>

      <ToggleContentContainer
        ref={contentRef}
        isOpen={isOpen}
        maxHeight={contentRef.current?.scrollHeight}
      >
        {units.map(unit => (
          <ToggleContent
            key={unit.unitNumber}
            onClick={!unit.isCurrentUser ? () => handleSelectReceiver(unit.userId) : undefined}
            state={selectedId === unit.userId}
            disabled={unit.isCurrentUser}
          >
            <UnitInfoWrapper>
              <Body2>{unit.unitNumber}</Body2>
              {unit.tags.map((message, index) => (
                <TagMessage key={index}>{message}</TagMessage>
              ))}
            </UnitInfoWrapper>
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

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
    `}

  cursor: pointer;

  ${props =>
    props.state && !props.disabled
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

const UnitInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px; /* 호수와 태그 메시지 사이의 간격 */
`;

const TagMessage = styled.div`
  ${typo('caption1')}; /* 작은 글씨체 적용 */
  color: ${color('grayscale.700')}; /* 약간 연한 검은색 */
  background-color: ${color('grayscale.100')};
  padding: 4px 8px;
  border-radius: 4px;
`;
