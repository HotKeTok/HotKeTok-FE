import MessageWriteTemplate from '../../../templates/tenant/communication/MessageWriteTemplate';
import { getTenantList } from '../../../api/post-service';
import { useAuthStore } from '../../../store/useAuthStore';
import { useEffect, useState } from 'react';
import { postMessage } from '../../../api/post-service';
import { useLocation } from 'react-router-dom';
import { markCurrentUserUnit } from '../../../utils/tenantList';

export default function MessageWrite() {
  const accessToken = useAuthStore(s => s.accessToken);
  const recipient = useLocation().state?.recipient || null; // 답장할 때 미리 지정된 수신자
  const senderNumber = useLocation().state?.senderNumber || null; // 답장할 때 미리 지정된 발신자 호수

  const [state, setState] = useState(0); // 0: 호수 선택, 1: 입력 폼 및 최종 제출
  const [tenantList, setTenantList] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null); // 선택된 수신자

  const fetchNewMessageData = async formData => {
    try {
      if (!accessToken) return;

      const { data } = await postMessage(accessToken, formData);
      return data?.data || [];
    } catch (error) {
      console.error('Error fetching new message data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchTenantsList = async () => {
      try {
        if (!accessToken) return;

        const { data } = await getTenantList(accessToken);
        // 본인 호수 제외
        const markedData = markCurrentUserUnit(data);
        setTenantList(markedData);
      } catch (error) {
        console.error('Error fetching tenant list:', error);
        return [];
      }
    };

    if (state === 0) {
      fetchTenantsList();
    }
  }, [accessToken, state]);

  useEffect(() => {
    if (recipient) {
      setSelectedReceiver(recipient);
      setState(1); // 바로 입력 폼으로 이동
    }
  }, [recipient]);

  return (
    <MessageWriteTemplate
      state={state}
      setState={setState}
      tenantList={tenantList}
      selectedReceiver={selectedReceiver}
      setSelectedReceiver={setSelectedReceiver}
      fetchNewMessageData={fetchNewMessageData}
      preDefinedRecipient={{
        receiverId: recipient,
        senderNumber: senderNumber,
      }}
    />
  );
}
