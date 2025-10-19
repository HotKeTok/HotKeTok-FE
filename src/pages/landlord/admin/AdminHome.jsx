import AdminHomeTemplate from '../../../templates/landlord/admin/AdminHomeTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMemo, useState } from 'react';
import { getNoticeList } from '../../../api/notice-service';
import { useEffect } from 'react';
import { getFixedNoticeList } from '../../../utils/notice';

export default function AdminHome() {
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
    return getFixedNoticeList(noticeList, 0, 4);
  }, [noticeList]);

  return <AdminHomeTemplate noticeList={sortedNoticeList} />;
}
