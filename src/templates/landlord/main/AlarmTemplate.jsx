import TopBar from '../../../components/common/TopBar';
import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
import styled from 'styled-components';
import AlarmItem from '../../../components/main/alarm/AlarmItem';
import { EXAMPLE_ALARMS } from '../../../mocks/main/alarm';
import { Column } from '../../../styles/flex';

export default function AlarmTemplate() {
  return (
    <PageWithoutBottomBar>
      <TopBar title="알림" />
      <Container>
        <Column $gap={10} $align="center">
          {EXAMPLE_ALARMS.map(alarm => (
            <AlarmItem
              key={alarm.id}
              title={alarm.title}
              body={alarm.body}
              date={alarm.date}
              read={alarm.read}
            />
          ))}
        </Column>
      </Container>
    </PageWithoutBottomBar>
  );
}

const Container = styled(ScrollableNoBottomBarContent)`
  background-color: #fff;

  padding: 16px 24px;

  display: flex;
  flex-direction: column;
`;
