import TopBar from "../../components/common/TopBar"
import { PageWithoutBottomBar, ScrollableNoBottomBarContent} from "../../styles/layout"
import styled from "styled-components";
import AlarmItem from "../../components/main/alarm/AlarmItem";
import { Column } from "../../styles/flex";

export default function AlarmTemplate(){
    //TODO: 더미 데이터 -> API 연동
    const alarms = [
  {
    id: 1,
    title: '주소 인증 완료',
    body: "‘우리집’ 주소 인증이 완료되었어요.",
    date: '오전 10:36',
    read: false,
  },
  {
    id: 2,
    title: '수리 완료',
    body: "‘문/창문’ 수리는 어떠셨나요? 리뷰를 남겨보세요.",
    date: '2024.10.23',
    read: false,
  },
  {
    id: 3,
    title: '1:1 문의의 답변 도착',
    body: "‘메종 인테리어’에서 회원님의 문의에 답변을 남겼어요.",
    date: '2024.10.23',
    read: true,
  },
];

    return (
      <PageWithoutBottomBar>
        <TopBar title="알림" />
        <Container $gap={10} $align="center">
          {alarms.map(alarm => (
            <AlarmItem
              key={alarm.id}
              title={alarm.title}
              body={alarm.body}
              date={alarm.date}
              read={alarm.read}
            />
          ))}
        </Container>
       </PageWithoutBottomBar>
    )
}

const Container = styled(ScrollableNoBottomBarContent)`
    background-color: #fff;

    padding: 16px 24px;
`