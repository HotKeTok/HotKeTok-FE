// src/templates/landlord/repair/L_RepairHomeTemplate.jsx
import React, { useMemo } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { Column, Row } from '../../../styles/flex';
import { Page, ScrollableContent } from '../../../styles/layout';
import { useNavigate } from 'react-router-dom';

// ✅ 입주민용 목데이터 그대로 사용
import { getActiveRepairs, getHistoryItems, REPAIR_REQUESTS } from '../../../mocks';

import iconChevron from '../../../assets/repair/icon-chevron.svg';
import iconDrill from '../../../assets/landlord/repair/one-drill.png';

/* 호수 파싱: 주소의 마지막 토큰이 `###호` 형태면 그걸 사용 */
const getRoomFromAddress = addr => {
  if (!addr || typeof addr !== 'string') return '';
  const parts = addr.trim().split(/\s+/);
  const last = parts[parts.length - 1] || '';
  return /호$/.test(last) ? last : '';
};

export default function L_RepairHomeTemplate() {
  const nav = useNavigate();

  // 전체 진행중/지난내역 원본
  const activeRaw = useMemo(() => getActiveRepairs() ?? [], []);
  const historyRaw = useMemo(() => getHistoryItems() ?? [], []);

  // 집주인 부담만 필터 (없으면 폴백으로 전체 노출)
  const activeOwnerOnly = useMemo(() => {
    const owner = activeRaw.filter(
      r =>
        r.payerLabel === '집주인 부담' ||
        (typeof r.payer === 'string' && ['LANDLORD', 'OWNER'].includes(r.payer))
    );
    return owner.length ? owner : activeRaw;
  }, [activeRaw]);

  // 우측 “304호” 표기를 위해 REPAIR_REQUESTS에서 address 찾아 합치기
  const active = useMemo(() => {
    const byId = new Map(REPAIR_REQUESTS.map(r => [r.id, r]));
    return activeOwnerOnly.map(item => {
      const raw = byId.get(item.id);
      const room = (raw && getRoomFromAddress(raw.request?.address)) || ''; // 없으면 빈 문자열
      return { ...item, room };
    });
  }, [activeOwnerOnly]);

  const hasActive = active.length > 0;

  const goHistory = () => nav('/repair-history');
  const goProgress = id => nav(`/repair-progress?id=${encodeURIComponent(id)}`);

  return (
    <Page>
      <PageHeader leftComponent="뚝딱" background="#fff" />
      <ScrollableContent>
        {/* ===== 상단 진행중 영역 ===== */}
        <div style={{ padding: '0px 24px' }}>
          <TopSurface>
            <RowBetween>
              <Title>진행 중인 수리 확인하기</Title>
              <Drill src={iconDrill} alt="" />
            </RowBetween>

            {hasActive ? (
              <>
                <div style={{ padding: '0px 24px', marginTop: '4px', marginBottom: '20px' }}>
                  <ActiveStatus>{active.length}건 진행중</ActiveStatus>
                </div>
                <Column $gap={10} style={{ padding: '0px 16px' }}>
                  {active.map(item => (
                    <ActiveCard key={item.id} onClick={() => goProgress(item.id)}>
                      <Row $justify="space-between" style={{ alignItems: 'flex-start' }}>
                        <div>
                          <CardTitle>{item.categoryLabel}</CardTitle>
                          <CardMeta>{item.schedule}</CardMeta>
                        </div>
                        <RightCol>
                          <RoomNo>{item.room || ' '}</RoomNo>
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

          {/* ===== 지난 수리 내역 ===== -> 일단 에비로 띄워둠. 디자인 확정되면 수정 예정 */}
          <HistoryWrap>
            <RowBetween>
              <HistoryHeading>지난 수리 내역</HistoryHeading>
              <HistoryMore onClick={goHistory}>
                더보기 <Chevron src={iconChevron} alt="" />
              </HistoryMore>
            </RowBetween>

            <Column $gap={12}>
              {historyRaw.slice(0, 3).map(item => {
                // 완료 항목도 호수 표기 시도
                const raw = REPAIR_REQUESTS.find(r => r.id === item.id);
                const room = getRoomFromAddress(raw?.request?.address);
                const price =
                  typeof item.price === 'number'
                    ? item.price.toLocaleString() + '원'
                    : item.price || '';
                const date =
                  item.date || item.completedAt || (raw ? raw.request?.requestedAt : '') || '';

                return (
                  <HistoryCard key={item.id}>
                    <Column $gap={4}>
                      <HistoryItemTitle>{item.categoryLabel}</HistoryItemTitle>
                      <HistoryMeta>{date}</HistoryMeta>
                    </Column>
                    <RoomPrice>
                      <div>{room || ' '}</div>
                      <div>{price}</div>
                    </RoomPrice>
                  </HistoryCard>
                );
              })}
            </Column>
          </HistoryWrap>
        </div>
      </ScrollableContent>
    </Page>
  );
}

/* ===== styles ===== */
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
  ${typo('caption1')}
  color: ${color('grayscale.600')};
  padding: 12px 20px;
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
