import { useNavigate } from "react-router-dom";
import CommunicationTemplate from "../../../templates/tenant/communication/CommunicationTemplate";

export default function Communication() {
    const navigate = useNavigate();
    // TODO : 공지사항 리스트 받아오기

    const onNoticeDetailRoute = (noticeId) => {
        if (noticeId) navigate(`/notice/${noticeId}`); // 특정 공지사항 페이지로 이동
        else navigate(`/notice`); // 전체 공지사항으로 이동
    }

    const onMessageRoute = () => {
        navigate(`/message`);
    }

    return (
       <CommunicationTemplate onNoticeDetailRoute={onNoticeDetailRoute} onMessageRoute={onMessageRoute} />
    );
}
