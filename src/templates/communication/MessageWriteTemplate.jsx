import TopBar from "../../components/common/TopBar";
import { Page, ScrollableContent } from "../../styles/layout";

export default function MessageWriteTemplate(){
    return (
        <Page>
            <TopBar title="쪽지 내용"/>
            {/* 절대적인 탭바 추가 */}
            <ScrollableContent>

            </ScrollableContent>
        </Page>
    )
}