import PageHeader from "../../../components/common/PageHeader";
import TopBar from "../../../components/common/TopBar";
import { BOTTOM_BAR_HEIGHT, Page, ScrollableContent } from "../../../styles/layout";
import styled from "styled-components";
import { typo, color } from "../../../styles/tokens";
import { EXAMPLE_NOTICES } from "../../../mocks/main/notice";
import NoticeItem from "../../../components/main/notice/NoticeItem";
import { Column } from "../../../styles/flex";
import MessageIcn from "../../../assets/communication/message/message-icon.svg?react";
import MessageImg from "../../../assets/communication/message/message.png";

export default function CommunicationTemplate ({
    onNoticeDetailRoute,
    onMessageRoute
}) {
    return (
    <Page>
       <PageHeader leftComponent={<Subtitle1>똑똑</Subtitle1>}/>
        <ScrollableContent style={{padding: '0 24px', paddingBottom: 143 }}>
            {/* 공지사항 컴포넌트 */}
            <NoticeWrapper>
                <NoticeTitle>
                    <Subtitle1>공지사항</Subtitle1>
                    <Button3 style={{padding: 10, color: '#9a9a9a'}} onClick={() => onNoticeDetailRoute()}>전체 보기</Button3>
                 </NoticeTitle>
                    {EXAMPLE_NOTICES.slice(0,4).map((notice) => (
                        <div key={notice.id} style={{ cursor: 'pointer'}} onClick={() => onNoticeDetailRoute(notice.id)}>
                            <NoticeItem
                                title={notice.title}
                                date={notice.date}
                                writer={notice.writer}
                                pinned={notice.pinned}
                                latest={notice.latest}
                            />
                        </div>
                    ))}
            </NoticeWrapper>

            {/* 메시지 컴포넌트 */} 
            <MessageWrapper style={{marginTop: 16}} onClick={onMessageRoute}>
                <Column $gap={10} $align="flex-start">
                    <MessageIcn width={32} height={32} />
                    <Column $gap={4}>
                        <H3 style={{color: '#3F856A'}}>이웃에게 쪽지 보내기</H3>
                        <Caption1 style={{color: '#3F856A'}} >
                            이웃에게 전할 메세지가 있으신가요?  <br/>쪽지를 보내보세요.
                        </Caption1>
                    </Column>
                </Column>
                <img src={MessageImg} alt="쪽지 이미지" width={63} height={71} object-fit="contain"/>
            </MessageWrapper>

        </ScrollableContent>
    </Page>)
}

const Subtitle1 = styled.text`
    ${typo('subtitle1')};
`

const H3 = styled.div`
    ${typo('h3')};
`

const Caption1 = styled.div`
    ${typo('caption1')};
`

const Button3 = styled.div`
    ${typo('button3')};
    padding: 10px;
    cursor: pointer;
`

const NoticeWrapper = styled.div`
    background-color: #f5f6f6;
    border-radius: 10px;
    padding: 16px;

    display : flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 6px;
`

const NoticeTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
`

const MessageWrapper = styled.div`
    height: 140px;
    padding: 16px 24px;

    border-radius: 20px;
    background: rgba(1, 210, 129, 0.12);

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;
`