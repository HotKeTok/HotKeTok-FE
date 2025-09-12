import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import TopBar from '../../components/common/TopBar';
import ButtonRound from '../../components/common/ButtonRound';

import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import { getHistoryItems } from '../../mocks';
import { useNavigate } from 'react-router-dom';

export default function RepairHistorTemplate() {
  const navigate = useNavigate();
  const items = useMemo(() => getHistoryItems(), []);

  // 1) 연도 목록 만들기 (내림차순)
  const years = useMemo(() => {
    const ys = Array.from(
      new Set(
        items
          .map(it => extractYear(it.schedule)) // "2024" 같은 문자열
          .filter(Boolean)
      )
    ).sort((a, b) => Number(b) - Number(a));
    return ys;
  }, [items]);

  // 2) 기본 선택 연도: 가장 최신 연도
  const [selectedYear, setSelectedYear] = useState(years[0] || String(new Date().getFullYear()));
  const [open, setOpen] = useState(false);

  // 3) 선택된 연도만 필터링
  const filtered = useMemo(
    () => items.filter(it => extractYear(it.schedule) === selectedYear),
    [items, selectedYear]
  );

  const goDetail = id => navigate(`/repair-progress?id=${encodeURIComponent(id)}`);

  return (
    <>
      <TopBar />

      {/* 헤더 + 연도 필터 */}
      <Header>
        <TitleH1>지난 수리 내역</TitleH1>
        <YearFilter tabIndex={0} onBlur={() => setOpen(false)}>
          <YearTrigger onClick={() => setOpen(v => !v)}>
            {selectedYear}년
            <Caret $open={open} />
          </YearTrigger>
          {open && (
            <Menu>
              {years.map(y => (
                <MenuItem
                  key={y}
                  onMouseDown={e => e.preventDefault()} // blur 방지
                  onClick={() => {
                    setSelectedYear(y);
                    setOpen(false);
                  }}
                  $active={y === selectedYear}
                >
                  {y}
                </MenuItem>
              ))}
            </Menu>
          )}
        </YearFilter>
      </Header>

      <ListWrap>
        <Column $gap={10}>
          {filtered.map(item => (
            <Card key={item.id} onClick={() => goDetail(item.id)}>
              <Row $justify="space-between" style={{ alignItems: 'flex-start' }}>
                <div>
                  <Title>{item.categoryLabel}</Title>
                  <Meta>{item.schedule}</Meta>
                  <Price>{comma(item.price)}원</Price>
                </div>
                <ButtonRound text="처리완료" />
              </Row>
            </Card>
          ))}
          {filtered.length === 0 && <Empty>해당 연도의 내역이 없어요.</Empty>}
        </Column>
      </ListWrap>
    </>
  );
}

/* utils */
function extractYear(schedule) {
  // "2024.11.20 / 오전 12:30" 형태에서 앞 4자리 연도 추출
  const m = /^(\d{4})/.exec(schedule?.trim() || '');
  return m ? m[1] : null;
}
function comma(n) {
  try {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch {
    return n;
  }
}

/* styles */
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px 20px 24px;
`;
const TitleH1 = styled.div`
  ${typo('h2')};
  color: black;
`;

const YearFilter = styled.div`
  position: relative;
  outline: none; /* onBlur용 focus 컨테이너 */
`;
const YearTrigger = styled.button`
  ${typo('button2')};
  color: ${color('grayscale.600')};
  background: transparent;
  border: none;
  padding: 6px 2px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;
const Caret = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-right: 2px solid ${color('grayscale.600')};
  border-bottom: 2px solid ${color('grayscale.600')};
  transform: rotate(${p => (p.$open ? '-135deg' : '45deg')});
  transition: transform 0.15s ease;
`;

const Menu = styled.div`
  position: absolute;
  right: 0;
  margin-top: 8px;
  width: 90px;
  background: ${color('grayscale.100')};
  border-radius: 10px;
  border: 1px solid ${color('grayscale.200')};
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 10;
`;
const MenuItem = styled.div`
  ${typo('body1')};
  padding: 6px 12px;
  border-radius: 10px;
  text-align: center;
  color: ${p => (p.$active ? color('grayscale.800') : color('grayscale.800'))};
  background: ${p => (p.$active ? color('grayscale.100') : 'transparent')};
  cursor: pointer;

  &:hover {
    background: ${color('grayscale.200')};
  }
`;

const ListWrap = styled.div`
  padding: 0px 24px;
`;
const Card = styled.div`
  border-radius: 14px;
  border: 1px solid ${color('grayscale.300')};
  padding: 18px 24px;
  cursor: pointer;
`;
const Title = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;
const Meta = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
  margin-top: 4px;
`;
const Price = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
  margin-top: 8px;
`;
const Empty = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
  padding: 24px 6px;
  text-align: center;
`;
