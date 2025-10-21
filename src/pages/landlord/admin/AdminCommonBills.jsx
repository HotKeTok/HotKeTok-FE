import AdminCommonBillsTemplate from '../../../templates/landlord/admin/AdminCommonBillsTemplate';
import { useEffect, useState } from 'react';
import { getCommonBillDetail } from '../../../api/commonbill-service';
import { useAuthStore } from '../../../store/useAuthStore';

export default function AdminCommonBills() {
  const accessToken = useAuthStore(state => state.accessToken);
  const [loading, setLoading] = useState(false);
  const [billsList, setBillsList] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // TODO: 년/월에 맞는 공동 관리비 내역 불러오기
  const fetchBillsData = async (year, month) => {
    try {
      if (!accessToken) return;

      setLoading(true);
      const response = await getCommonBillDetail(accessToken, year, month);
      if (response.success) {
        console.log(response.data);
        setBillsList(response.data);
      }
    } catch (error) {
      if (error.status === 404) {
        setBillsList(undefined);
      } else {
        console.error('공동 관리비 내역 불러오기 중 오류 발생:', error);
        setBillsList(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillsData(year, month);
  }, [year, month, accessToken]);

  return (
    <AdminCommonBillsTemplate
      loading={loading}
      billsList={billsList}
      year={year}
      month={month}
      setYear={setYear}
      setMonth={setMonth}
    />
  );
}
