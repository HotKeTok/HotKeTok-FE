import TopBar from "../../../components/common/TopBar";
import { Page, ScrollableContent } from "../../../styles/layout";


export default function ChatRoomTemplate (
    userName, // 채팅 상대방 이름
    chatroomId, // 채팅방 ID
){
    return (
        <Page id={chatroomId}>
            <TopBar title={userName}/>
            <ScrollableContent>

            </ScrollableContent>
        </Page>
    );
}