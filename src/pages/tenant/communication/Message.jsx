import MessageTemplate from '../../../templates/tenant/communication/MessageTemplate';
import { useEffect, useState } from 'react';
import { getReceivedMessages, getSentMessages } from '../../../api/post-service';
import { useAuthStore } from '../../../store/useAuthStore';
import { Row } from '../../../styles/flex';

export default function Message() {
  const accessToken = useAuthStore(s => s.accessToken);

  const [loading, setLoading] = useState(true);
  // 0: 받은 쪽지, 1: 보낸 쪽지
  const [toggleState, setToggleState] = useState(0);
  const [messages, setMessages] = useState({
    received: null,
    sent: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!accessToken) return;

        setLoading(true);
        if (toggleState === 0) {
          const { data } = await getReceivedMessages(accessToken);
          setMessages(prev => ({ ...prev, received: data || [] }));
        } else {
          const { data } = await getSentMessages(accessToken);
          setMessages(prev => ({ ...prev, sent: data || [] }));
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toggleState, accessToken]);

  return (
    <MessageTemplate
      toggleState={toggleState}
      setToggleState={setToggleState}
      receivedMessages={messages.received || []}
      sentMessages={messages.sent || []}
      loading={loading}
    />
  );
}
