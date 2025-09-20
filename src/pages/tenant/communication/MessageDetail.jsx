import MessageDetailTemplate from "../../templates/tenant/communication/MessageDetailTemplate"
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function MessageDetail(){
    const params = useParams();
    const {state} = useLocation();
    const navigate= useNavigate();
    const { id } = params;

    // TODO: id를 이용해 백엔드에서 쪽지 데이터 받아오기 혹은 전체 데이터에서 가져오기

    const onReply = (message) => {
        navigate("/message/write", {
            state: { recipient: message.senderId }
        });
    }

    return (
        <MessageDetailTemplate id={id} type={state.type} onReply={onReply}/>
    )
}