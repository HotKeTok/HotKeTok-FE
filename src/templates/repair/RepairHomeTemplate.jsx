import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';

import RequestBanner from '../../components/repair/repair-home/RequestBanner';
import CompanyAd from '../../components/repair/repair-home/CompanyAd';

export default function RepairHomeTemplate() {
  return (
    <>
      <PageHeader leftComponent={'뚝딱'} />
      <RowWrapper>
        <StatusText>현재 진행중인 수리가 없어요</StatusText>
        <MoveRepairHistory>{'지난 수리 내역 >'}</MoveRepairHistory>
      </RowWrapper>
      <div style={{ padding: '13px 20px' }}>
        <RequestBanner />
      </div>

      <RecommandTitle>수리가 필요하신가요?</RecommandTitle>
      <RecommandSub>이런 업체는 어떠세요?</RecommandSub>
      <CompanyAd />
    </>
  );
}

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
