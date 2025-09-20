import TopBar from "../../components/common/TopBar"
import { Page, ScrollableNoBottomBarContent } from "../../styles/layout"
import styled from "styled-components";
import { color, typo } from "../../styles/tokens";
import { Row } from "../../styles/flex";
import ProfileDefault from "../../assets/common/icon-profile-default.svg?react";
import { theme } from "../../styles/theme";

export default function NoticeDetailTemplate() {
    // TODO: 공지사항 클릭시 해당 아이템과 함께 navigate하여 정보를 받음.
    const notice = {
    id: 1,
    title: "엘리베이터 점검으로 인한 이용 불가 안내",
    content: "안녕하세요, 입주민 여러분. 다가오는 10월 30일(수) 오전 9시부터 오후 5시까지 엘리베이터 정기 점검이 예정되어 있습니다. 이 기간 동안 엘리베이터를 이용하실 수 없으니, 불편하시더라도 양해 부탁드립니다. 점검 시간 동안에는 계단을 이용해 주시고, 특히 어린이와 노약자분들은 안전에 유의해 주시기 바랍니다. 또한, 무거운 짐을 들고 이동하시는 분들은 주변 이웃의 도움을 받으시길 권장드립니다. 엘리베이터 점검은 입주민 여러분의 안전과 편의를 위해 정기적으로 실시되는 중요한 작업입니다. 점검이 원활히 진행될 수 있도록 협조해 주셔서 감사드리며, 점검 완료 후에는 더욱 안전하고 쾌적한 환경을 제공할 수 있도록 노력하겠습니다. 추가 문의 사항이 있으시면 관리사무소로 연락 주시기 바랍니다. 감사합니다.",
    date: "2024.10.23",
    writer: "집주인",
    pinned: true,
    latest: false,
  };

    return (
        <Page>
            <TopBar title="공지사항" />
            <Content>
                <div>
                    <H2>{notice.title}</H2>
                    <Row $justify="space-between" style={{marginTop: 8}}>
                        <Row $gap={8} $align={"center"}>
                            <ProfileDefault width={24} height={24}/>
                            <Body2>{notice.writer}</Body2>
                        </Row>
                        <Body2 style={{color: theme.colors.grayscale[500]}}>작성일: {notice.date}</Body2>
                    </Row>
                </div>
                <Divider/>
                <Body2>
                    {notice.content}
                </Body2>
            </Content>
            
        </Page>
    )
}

const Container = styled(ScrollableNoBottomBarContent)`
    background-color: white;
`

const Content = styled.div`
    padding: 16px 25px;

    display: flex;
    flex-direction: column;
    gap: 24px;
`

const H2 = styled.div`
    ${typo('h2')};
    color: ${color('grayscale.800')};
    text-align: left;
`

const Body2 = styled.div`
    ${typo('body2')};
    color: ${color('grayscale.700')};
    white-space: pre-wrap;
`

const Divider = styled.div`
    height : 1px;
    background: #DEDEDE;
`