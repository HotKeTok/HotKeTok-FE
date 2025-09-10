import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';

import RequestBanner from '../../components/repair/repair-home/RequestBanner';
import ContractorAd from '../../components/repair/repair-home/ContractorAd';
import { useNavigate } from 'react-router-dom';

export default function RepairHomeTemplate() {
  const nav = useNavigate();
  return (
    <Screen>
      <WhiteBackground />
      <Content>
        <PageHeader leftComponent={'뚝딱'} />
        <RowWrapper>
          <StatusText>현재 진행중인 수리가 없어요.</StatusText>
          <MoveRepairHistory>{'지난 수리 내역 >'}</MoveRepairHistory>
        </RowWrapper>
        <div style={{ padding: '13px 20px' }}>
          <RequestBanner />
        </div>
        <Wrapper>
          <Column>
            <RecommandTitle>수리가 필요하신가요?</RecommandTitle>
            <RecommandSub>이런 업체는 어떠세요?</RecommandSub>
          </Column>
          <ContractorAd />
        </Wrapper>
      </Content>
      <RequestFab type="button" aria-label="수리 요청하기" onClick={() => nav('/request-repair')}>
        수리 요청하기
      </RequestFab>
    </Screen>
  );
}

const Screen = styled.div`
  position: relative; /* 자식 absolute 기준 */
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

const WhiteBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 328px;
  flex-shrink: 0;
  border-radius: 0px 0px 30px 30px;
  background-color: #fff;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.02);
`;

const RowWrapper = styled(Row)`
  justify-content: space-between;
  padding: 0px 20px;
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
  padding: 30px 0px 0px 24px;
  gap: 16px;
`;

const RequestFab = styled.div`
  position: fixed;

  right: calc((100vw - var(--container-w, 390px)) / 2 + 20px);
  bottom: calc(env(safe-area-inset-bottom, 0) + var(--bar-h, 56px) + 16px);
  z-index: 1000;

  ${typo('button1')}
  display: flex;
  width: 90px;
  height: 25px;
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
