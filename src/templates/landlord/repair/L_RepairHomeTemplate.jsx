import React from 'react';
import styled from 'styled-components';
import { Page, ScrollableContent } from '../../../styles/layout';
import { Row, Column } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';

import PageHeader from '../../../components/common/PageHeader';
import iconChevron from '../../../assets/repair/icon-chevron.svg';
import iconDrill from '../../../assets/landlord/repair/one-drill.png';

import { formatCategoryName } from '../../../utils/format';

/**
 * props
 * - loading: boolean
 * - activeList: Array<{ id, category, scheduleLabel, currentNumber, statusLabel }>
 * - historyList: Array<any>  // 현재는 미사용(추후 API 연동시 사용)
 * - onClickProgress: (id) => void
 * - onClickHistoryMore: () => void
 */
export default function L_RepairHomeTemplate({
  loading = false,
  activeList = [],
  historyList = [],
  onClickProgress,
  onClickHistoryMore,
}) {
  const hasActive = activeList.length > 0;

  return (
    <Page>
      <PageHeader leftComponent="뚝딱" background="#fff" />
      <ScrollableContent>
        <div style={{ padding: '0 24px' }}>
          {/* ===== 진행중 영역 ===== */}
          <TopSurface>
            <RowBetween>
              <Title>진행 중인 수리 확인하기</Title>
              <Drill src={iconDrill} alt="" />
            </RowBetween>

            {loading ? (
              <NoActive>불러오는 중...</NoActive>
            ) : hasActive ? (
              <>
                <div style={{ padding: '0px 24px', marginTop: '4px', marginBottom: '20px' }}>
                  <ActiveStatus>{activeList.length}건 진행중</ActiveStatus>
                </div>
                <Column $gap={10} style={{ padding: '0px 16px' }}>
                  {activeList.map(item => (
                    <ActiveCard key={item.id} onClick={() => onClickProgress?.(item.id)}>
                      <Row $justify="space-between" style={{ alignItems: 'flex-start' }}>
                        <div>
                          <CardTitle>{formatCategoryName(item.category)}</CardTitle>
                          <CardMeta>{item.scheduleLabel}</CardMeta>
                        </div>
                        <RightCol>
                          <RoomNo>{item.currentNumber || '-'}</RoomNo>
                          <StatusCTA>
                            {item.statusLabel}
                            <Chevron src={iconChevron} alt="" />
                          </StatusCTA>
                        </RightCol>
                      </Row>
                    </ActiveCard>
                  ))}
                </Column>
              </>
            ) : (
              <NoActive>진행 중인 수리가 없어요.</NoActive>
            )}
          </TopSurface>

          {/* ===== 지난 수리 내역 (API 준비 전: 빈 리스트 표시/스켈레톤) ===== */}
          <HistoryWrap>
            <RowBetween>
              <HistoryHeading>지난 수리 내역</HistoryHeading>
              <HistoryMore onClick={onClickHistoryMore}>
                더보기 <Chevron src={iconChevron} alt="" />
              </HistoryMore>
            </RowBetween>

            {historyList.length === 0 ? (
              <NoActive style={{ padding: '8px 0 0 0' }}>지난 내역이 없어요.</NoActive>
            ) : (
              <Column $gap={12}>
                {historyList.slice(0, 3).map(item => (
                  <HistoryCard key={item.id}>
                    <Column $gap={4}>
                      <HistoryItemTitle>{item.category || '기타'}</HistoryItemTitle>
                      <HistoryMeta>{item.dateLabel || ''}</HistoryMeta>
                    </Column>
                    <RoomPrice>
                      <div>{item.currentNumber || '-'}</div>
                      <div>{item.priceLabel || ''}</div>
                    </RoomPrice>
                  </HistoryCard>
                ))}
              </Column>
            )}
          </HistoryWrap>
        </div>
      </ScrollableContent>
    </Page>
  );
}

/* ===== styles (기존 유지) ===== */
const TopSurface = styled.div`
  background: #f5f6f6;
  border-radius: 20px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.02);
  padding: 16px 0 16px;
`;

const RowBetween = styled(Row)`
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
`;

const Title = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;

const Drill = styled.img`
  position: absolute;
  width: 60px;
  right: 20px;
  top: 1px;
`;

const ActiveStatus = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.600')};
`;

const ActiveCard = styled.div`
  border-radius: 16px;
  border: 1px solid ${color('brand.primary')};
  background: #fff;
  padding: 16px 18px;
  cursor: pointer;
`;

const CardTitle = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
`;

const CardMeta = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
  margin-top: 8px;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const RoomNo = styled.div`
  ${typo('subtitle1')}
  color: ${color('brand.primary')};
`;

const StatusCTA = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Chevron = styled.img`
  width: 4px;
`;

const NoActive = styled.div`
  ${typo('cbody2')}
  color: ${color('grayscale.500')};
  padding: 80px 0px;
  text-align: center;
`;

const HistoryWrap = styled.div`
  padding: 24px 20px;
`;

const HistoryHeading = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
`;

const HistoryMore = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.800')};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const HistoryCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
`;

const HistoryItemTitle = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
`;

const HistoryMeta = styled.div`
  ${typo('caption2')}
  color: ${color('grayscale.600')};
`;

const RoomPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  ${typo('caption1')}
  color: ${color('grayscale.800')};
`;
