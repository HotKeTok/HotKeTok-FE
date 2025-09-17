import { useNavigate } from 'react-router-dom';
import NoticeTemplate from '../../templates/main/NoticeTemplate'

export default function Notice(){
    const navigate = useNavigate();

    const onNoticeItemClick = (id) => {
        navigate(`/notice/${id}`);
    }

    return (<NoticeTemplate onNoticeItemClick={onNoticeItemClick} />)
}