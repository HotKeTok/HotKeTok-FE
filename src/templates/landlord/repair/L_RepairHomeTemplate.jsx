import React from 'react';
import styled from 'styled-components';
import { Page, ScrollableContent } from '../../../styles/layout';
import { Row, Column } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';

import PageHeader from '../../../components/common/PageHeader';
import iconChevron from '../../../assets/repair/icon-chevron.svg';

import { formatCategoryName } from '../../../utils/format';
import ReviewCarousel from '../../../components/repair/repair-home/ReviewCarousel';
import { useNavigate } from 'react-router-dom';

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
  onClickProgress,
}) {
  const hasActive = activeList.length > 0;

  const nav = useNavigate();
  const goHistory = () => nav('/repair-history');
  return (
    <Page>
      <PageHeader leftComponent="뚝딱" background="#fff" />
      <ScrollableContent>
        <Column $gap={10} style={{ padding: '0 24px' }}>
          {/* ===== 진행중 영역 ===== */}
          <GrayBox>
            <RowBetween>
              <Title>진행 중인 수리 확인하기</Title>
              <MoveRepairHistory onClick={goHistory}>
                지난 수리내역 <Chevron src={iconChevron} />
              </MoveRepairHistory>
            </RowBetween>

            {loading ? (
              <NoActive>불러오는 중...</NoActive>
            ) : hasActive ? (
              <>
                <div style={{ marginTop: '4px', marginBottom: '20px' }}>
                  <ActiveStatus>{activeList.length}건 진행중</ActiveStatus>
                </div>
                <Column $gap={10}>
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
          </GrayBox>

          <GrayBox>
            <Title>지난 수리 후기</Title>
            <Caption1_600>입주민들이 작성했어요.</Caption1_600>
            <ReviewCarousel />
          </GrayBox>
        </Column>
      </ScrollableContent>
    </Page>
  );
}

/* ===== styles (기존 유지) ===== */
const GrayBox = styled.div`
  background: #f5f6f6;
  padding: 16px 24px;

  border-radius: 20px;
  border: 1px solid ${color('grayscale.200')};
  background: ${color('grayscale.100')};
`;

const RowBetween = styled(Row)`
  position: relative;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;

const Caption1_600 = styled.div`
  margin: 2px 0 10px 0;
  ${typo('caption1')}
  color: ${color('grayscale.600')};
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

const MoveRepairHistory = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.800')};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`;
