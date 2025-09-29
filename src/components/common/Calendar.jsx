import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import ArrowRight from '../../assets/common/icon-arrow-right.svg?react';
import { formatDateToYMD } from '../../utils/dateFormat';

/**
 * @param {string} selectedDate - YYYY-MM-DD 형식의 선택된 날짜
 * @param {() => void} onClose - 취소 버튼 클릭 시 실행될 함수
 * @param {(date: string) => void} onConfirm - 선택 버튼 클릭 시 실행될 함수
 */
export default function Calendar({ selectedDate, onClose, onConfirm }) {
  const initialDate =
    selectedDate && !isNaN(new Date(selectedDate)) ? new Date(selectedDate) : new Date();
  const [displayDate, setDisplayDate] = useState(initialDate);
  const [tempSelectedDate, setTempSelectedDate] = useState(initialDate);

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const handlePrevMonth = () => {
    setDisplayDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = day => {
    setTempSelectedDate(new Date(year, month, day));
  };

  const renderCalendar = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<DateCell key={`empty-${i}`} />);
    }

    for (let day = 1; day <= lastDate; day++) {
      const currentDayDate = new Date(year, month, day);
      const isNewlySelected = formatDateToYMD(tempSelectedDate) === formatDateToYMD(currentDayDate);
      const isOriginallySelected = formatDateToYMD(initialDate) === formatDateToYMD(currentDayDate);
      const dayOfWeek = currentDayDate.getDay(); // 0: Sunday, 6: Saturday

      days.push(
        <DateCell
          key={day}
          $isNewlySelected={isNewlySelected}
          $isOriginallySelected={isOriginallySelected}
          $dayOfWeek={dayOfWeek}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </DateCell>
      );
    }
    return days;
  };

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <Column $gap={20}>
      <Header>
        <YearMonth>{`${year}년 ${month + 1}월`}</YearMonth>
        <Row $gap={34}>
          <ArrowBtn onClick={handlePrevMonth}>
            <ArrowStyled width={8} height={14} style={{ transform: 'rotate(180deg)' }} />
          </ArrowBtn>
          <ArrowBtn onClick={handleNextMonth}>
            <ArrowStyled width={8} height={14} />
          </ArrowBtn>
        </Row>
      </Header>
      <Body>
        <DayGrid>
          {dayNames.map((day, index) => (
            <DayName key={day} $dayOfWeek={index}>
              {day}
            </DayName>
          ))}
        </DayGrid>
        <DateGrid>{renderCalendar()}</DateGrid>
      </Body>
      <Footer $gap={10} $justify="flex-end">
        <Btn dismiss onClick={onClose}>
          취소
        </Btn>
        <Btn onClick={() => onConfirm(formatDateToYMD(tempSelectedDate))}>선택</Btn>
      </Footer>
    </Column>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;

const YearMonth = styled.span`
  ${typo('h3')};
`;

const ArrowBtn = styled.div`
  cursor: pointer;
`;

const ArrowStyled = styled(ArrowRight)`
  path {
    stroke: ${color('grayscale.800')};
  }
`;

const Body = styled.div``;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 10px;
`;

const DayName = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};

  ${({ $dayOfWeek }) =>
    $dayOfWeek === 0 &&
    css`
      color: #e53e3e;
    `}
  ${({ $dayOfWeek }) =>
    $dayOfWeek === 6 &&
    css`
      color: #3182ce;
    `}
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DateCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-radius: 11px;
  cursor: pointer;
  position: relative;

  ${typo('body1')};
  color: ${color('grayscale.500')};
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${color('grayscale.100')};
  }

  ${({ $dayOfWeek }) =>
    $dayOfWeek === 0 &&
    css`
      color: #e53e3e;
    `}
  ${({ $dayOfWeek }) =>
    $dayOfWeek === 6 &&
    css`
      color: #3182ce;
    `}
  
  ${({ $isOriginallySelected, $isNewlySelected }) =>
    $isOriginallySelected &&
    !$isNewlySelected &&
    css`
      color: ${color('brand.primary')};
    `}

  ${({ $isNewlySelected }) =>
    $isNewlySelected &&
    css`
      background-color: ${color('brand.primary')};
      color: white !important;
      &:hover {
        background-color: ${color('brand.primary')};
      }
    `}
`;

const Btn = styled.button`
  width: auto;
  min-width: 71px;
  height: 44px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${typo('button2')}

  ${props =>
    props.dismiss
      ? css`
          background-color: ${color('grayscale.200')};
          color: ${color('grayscale.700')};
          border: none;
        `
      : css`
          background-color: ${color('brand.primary')};
          color: white;
          border: none;
        `}
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:active {
    transform: translateY(1px);
    opacity: 0.9;
  }
`;

const Footer = styled(Row)`
  margin-top: 26px;
`;
