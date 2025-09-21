import { useNavigate } from 'react-router-dom';
import CommunicationTemplate from '../../../templates/tenant/communication/CommunicationTemplate';

export default function Communication() {
  const navigate = useNavigate();
  // TODO : 공지사항 리스트 받아오기

  const onMessageRoute = () => {
    navigate(`/message`);
  };

  return <CommunicationTemplate onMessageRoute={onMessageRoute} />;
}
