import React, { useMemo } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { Column, Row } from '../../../styles/flex';
import { Page, ScrollableContent } from '../../../styles/layout';

import RequestBanner from '../../../components/repair/repair-home/RequestBanner';
import ContractorAd from '../../../components/repair/repair-home/ContractorAd';
import { useNavigate } from 'react-router-dom';
import { getActiveRepairs } from '../../../mocks';

import iconChevron from '../../../assets/repair/icon-chevron.svg';

export default function RepairHomeTemplate() {
  const nav = useNavigate();
  const list = useMemo(() => getActiveRepairs(), []);
  const hasActive = list.length > 0;

  const goHistory = () => nav('/repair-history');
  const goProgress = id => nav(`/repair-progress?id=${encodeURIComponent(id)}`);

  return (
    <Page>
      <PageHeader leftComponent="뚝딱" background={'#fff'} />
      <ScrollableContent>
        <TopSurface>
          <RowWrapper>
            <StatusText>
              {hasActive
                ? `총 ${list.length}건의 수리가 진행중이에요.`
                : '현재 진행중인 수리가 없어요.'}
            </StatusText>
            <MoveRepairHistory onClick={goHistory}>
              지난 수리내역 <Chevron src={iconChevron} />
            </MoveRepairHistory>
          </RowWrapper>
          {hasActive && (
            <CardsWrap>
              <Column $gap={12}>
                {list.map(item => (
                  <ActiveCard key={item.id} onClick={() => goProgress(item.id)}>
                    <Row $justify="space-between" style={{ alignItems: 'flex-start' }}>
                      <div>
                        <CardTitle>{item.categoryLabel}</CardTitle>
                        <CardMeta>{item.schedule}</CardMeta>
                      </div>
                      <RightCol>
                        <Payer>{item.payerLabel}</Payer>
                        <StatusCTA>
                          {item.statusLabel} <Chevron src={iconChevron} />
                        </StatusCTA>
                      </RightCol>
                    </Row>
                  </ActiveCard>
                ))}
              </Column>
            </CardsWrap>
          )}
          {/* ✅ 진행 중이 없을 때만 배너 표시 */}
          {!hasActive && (
            <div style={{ padding: '13px 20px' }}>
              <RequestBanner />
            </div>
          )}
        </TopSurface>

        <Wrapper>
          <Column>
            <RecommandTitle>수리가 필요하신가요?</RecommandTitle>
            <RecommandSub>이런 업체는 어떠세요?</RecommandSub>
          </Column>
          <ContractorAd />
        </Wrapper>

        <RequestFab type="button" aria-label="수리 요청하기" onClick={() => nav('/request-repair')}>
          수리 요청하기
        </RequestFab>
      </ScrollableContent>
    </Page>
  );
}

/* ===== styles ===== */
const TopSurface = styled.div`
  background: #fff;
  border-radius: 0 0 30px 30px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.02);
  padding-bottom: 16px;
`;

const RowWrapper = styled(Row)`
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
`;

const StatusText = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;

const MoveRepairHistory = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.800')};
  cursor: pointer;
  display: inline-flex; // ✅ 텍스트 + 이미지 줄바꿈 방지
  align-items: center;
  gap: 4px; // ✅ 아이콘 간격 조정
  white-space: nowrap; // ✅ 전체 줄바꿈 방지
`;

const CardsWrap = styled.div`
  padding: 12px 20px 0;
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
  ${typo('caption2')}
  color: ${color('grayscale.600')};
  margin-top: 8px;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`;

const Payer = styled.div`
  ${typo('caption1')}
  color: ${({ children }) =>
    children === '본인 부담' ? color('brand.primary') : color('grayscale.500')};
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

const RecommandTitle = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
`;

const RecommandSub = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.800')};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 0 30px 24px;
  gap: 16px;
`;

const RequestFab = styled.div`
  position: fixed;
  right: calc((100vw - var(--container-w, 390px)) / 2 + 20px);
  bottom: calc(env(safe-area-inset-bottom, 0) + var(--bar-h, 56px) + 16px);
  z-index: 1000;

  white-space: nowrap; // ✅ 줄바꿈 방지
  ${typo('button1')}
  display: flex;
  width: 132px;
  height: 54px;
  justify-content: center;
  align-items: center;
  padding: 14px 18px;
  border-radius: 50px;
  background: ${color('brand.primary')};
  color: #fff;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;
