import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
import TenantsIcn from '../../..//assets/landlord/admin/Empty_TenantsInfo.svg?react';
import { color, typo } from '../../..//styles/tokens';
import TopBar from '../../../components/common/TopBar';
import { Column } from '../../..//styles/flex';
import styled from 'styled-components';
import BoxToggleTenant from '../../../components/admin/BoxToggleTenant';

const EMPTY_TEXT = '아직 입주민이 없어요. \n입주 요청이 오면 알림을 보내드릴게요.';

export default function AdminTenantsInfoTemplate({ tenantsList, loading }) {
  return (
    <PageWithoutBottomBar>
      <TopBar title="입주민 목록" />
      <ScrollableNoBottomBarContent
        style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 20 }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : tenantsList.length === 0 ? (
          <Column $justify="center" $align="center" style={{ height: '100%' }}>
            <TenantsIcn width={70} height={70} />
            <Description style={{ whiteSpace: 'pre-wrap' }}>{EMPTY_TEXT}</Description>
          </Column>
        ) : (
          <>
            <Column $gap={8} $align="center">
              <TenantsIcn width={70} height={70} style={{ marginTop: 20, marginBottom: 30 }} />
              {tenantsList.map(floor => (
                <BoxToggleTenant floorTenantsInfo={floor} key={floor.floor} />
              ))}
            </Column>
          </>
        )}
      </ScrollableNoBottomBarContent>
    </PageWithoutBottomBar>
  );
}

const Description = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.500')};
`;
