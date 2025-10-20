import { useAuthStore } from '../../../store/useAuthStore';
import BillsTemplate from '../../../templates/tenant/main/BillsTemplate';
import { useEffect, useState } from 'react';
import { getCommonBillDetail } from '../../../api/commonbill-service';

export default function Bills() {
  const accessToken = useAuthStore(state => state.accessToken);
  const [activeTab, setActiveTab] = useState('공과금'); // '공과금' | '공동 관리비'
  const [billDetail, setBillDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCommonBills = async () => {
      try {
        if (activeTab === '공동 관리비') {
          // const response =
        }
      } catch (err) {
        console.error(err);
      }
    };
  }, [activeTab]);

  const fetchCommonBillsDetail = async (year, month) => {
    try {
      if (!accessToken) return;

      setLoading(true);
      const response = await getCommonBillDetail(accessToken, year, month);
      if (response.success) {
        setBillDetail(response.data);
      } else {
        console.error('공동 관리비 내역 불러오기 실패:', response.message);
      }
    } catch (error) {
      console.error('공동 관리비 내역 불러오기 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BillsTemplate
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      fetchCommonBillsDetail={fetchCommonBillsDetail}
      commonBillDetail={billDetail}
      loading={loading}
    />
  );
}
