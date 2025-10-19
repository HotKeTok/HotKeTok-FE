import MessageDetailTemplate from '../../../templates/tenant/communication/MessageDetailTemplate';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getMessageDetail } from '../../../api/post-service';
import { useAuthStore } from '../../../store/useAuthStore';
import { useEffect, useState } from 'react';
import { reportMessage } from '../../../api/post-service';

export default function MessageDetail() {
  const accessToken = useAuthStore(state => state.accessToken);
  const params = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = params;
  const [messageDetail, setMessageDetail] = useState(null);

  const onReply = message => {
    navigate('/message/write', {
      state: { recipient: message.senderId, senderNumber: message.senderNumber },
    });
  };

  const fetchMessageReport = async () => {
    try {
      if (!accessToken) return;

      const res = await reportMessage(accessToken, id);
      if (res.success) navigate('/message', { replace: true });
    } catch (error) {
      console.error('Error reporting message:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    const fetchMessageDetailData = async () => {
      try {
        if (!accessToken) return;

        const { data } = await getMessageDetail(id, accessToken);
        setMessageDetail(data || {});
      } catch (error) {
        console.error('Error fetching message detail data:', error);
        return {};
      }
    };

    fetchMessageDetailData();
  }, [id, accessToken]);

  if (!messageDetail) {
    return null;
  }
  return (
    <MessageDetailTemplate
      id={id}
      type={state.type}
      onReply={onReply}
      messageDetail={messageDetail}
      onReport={fetchMessageReport}
    />
  );
}
