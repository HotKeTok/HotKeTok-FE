import React, { useMemo } from 'react';
import styled from 'styled-components';
import TopBar from '../../components/common/TopBar';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import { getHistoryItems } from '../../mocks';
import { useNavigate } from 'react-router-dom';

export default function RepairHistorTemplate() {
  const navigate = useNavigate();
  const items = useMemo(() => getHistoryItems(), []);

  const goDetail = id => navigate(`/repair-progress?id=${encodeURIComponent(id)}`);

  return (
    <>
      <TopBar title="지난 수리 내역" />
      <ListWrap>
        <Column $gap={10}>
          {items.map(item => (
            <Card key={item.id} onClick={() => goDetail(item.id)}>
              <Row $justify="space-between" style={{ alignItems: 'flex-start' }}>
                <div>
                  <Title>{item.categoryLabel}</Title> {/* 업종 */}
                  <Meta>{item.schedule}</Meta> {/* 수리 예정 날짜 */}
                  <Price>{comma(item.price)}원</Price> {/* 선택 견적 금액 */}
                </div>
                <BadgeDone>처리완료</BadgeDone>
              </Row>
            </Card>
          ))}
        </Column>
      </ListWrap>
    </>
  );
}

/* styles */
const ListWrap = styled.div`
  padding: 12px 16px 24px;
`;
const Card = styled.div`
  border-radius: 14px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  padding: 16px 18px;
  cursor: pointer;
  &:active {
    outline: 2px solid ${color('grayscale.800')};
  }
`;
const Title = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;
const Meta = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
  margin-top: 6px;
`;
const Price = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
  margin-top: 2px;
`;
const BadgeDone = styled.div`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${color('brand.primary')};
  color: #fff;
  ${typo('caption1')};
`;
function comma(n) {
  try {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch {
    return n;
  }
}
