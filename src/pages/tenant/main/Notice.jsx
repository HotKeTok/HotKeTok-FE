import NoticeTemplate from '../../../templates/tenant/main/NoticeTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState, useEffect } from 'react';
import { getNoticeList } from '../../../api/notice-service';

export default function Notice() {
  const accessToken = useAuthStore(state => state.accessToken);
  const [noticeList, setNoticeList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!accessToken) return;
        const { data } = await getNoticeList(accessToken);
        setNoticeList(data || []);
      } catch (error) {
        console.error('Error fetching notice list:', error);
        return [];
      }
    };

    fetchData();
  }, [accessToken]);

  return <NoticeTemplate noticeList={noticeList} />;
}
