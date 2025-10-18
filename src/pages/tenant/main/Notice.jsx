import { useNavigate } from 'react-router-dom';
import NoticeTemplate from '../../../templates/tenant/main/NoticeTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState, useEffect } from 'react';
import { getNoticeList } from '../../../api/notice-service';
import { useMemo } from 'react';
import { getFixedNoticeList } from '../../../utils/notice';

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

  const sortedNoticeList = useMemo(() => {
    return getFixedNoticeList(noticeList, 1, 4);
  }, [noticeList]);

  return <NoticeTemplate noticeList={sortedNoticeList} />;
}
