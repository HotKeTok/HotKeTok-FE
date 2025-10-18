import { useEffect } from 'react';
import AdminNoticeTemplate from '../../../templates/landlord/admin/AdminNoticeTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { getNoticeList } from '../../../api/notice-service';
import { useState } from 'react';

export default function AdminNotice() {
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

  return <AdminNoticeTemplate noticeList={noticeList} />;
}
