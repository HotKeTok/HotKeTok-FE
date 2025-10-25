import MainTemplate from '../../../templates/tenant/main/MainTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState, useEffect } from 'react';
import { getNoticeList } from '../../../api/notice-service';
import { getFixedNoticeList } from '../../../utils/notice';
import useUserAddress from '../../../hooks/useUserAddress';

export default function Index() {
  const { addressList } = useUserAddress();

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

  return (
    <MainTemplate
      address="서울특별시 강남구 영동대로 112길 46"
      utilityBill={132000}
      commonBill={130410}
      noticeList={getFixedNoticeList(noticeList, 1, 4)}
    />
  );
}
