import { useAuthStore } from '../../../store/useAuthStore';
import BillsTemplate from '../../../templates/tenant/main/BillsTemplate';
import { useEffect, useState } from 'react';
import { getCommonBillDetail, getCommonBills } from '../../../api/commonbill-service';
import { MOCK_UTILITY_BILLS } from '../../../mocks/main/bills';

export default function Bills() {
  const accessToken = useAuthStore(state => state.accessToken);
  const [activeTab, setActiveTab] = useState('공과금'); // '공과금' | '공동 관리비'
  const [year, setYear] = useState(new Date().getFullYear());

  const [billList, setBillList] = useState(null);
  const [billDetail, setBillDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchCommonBillsDetail = async (year, month) => {
    try {
      if (!accessToken) return;

      setModalLoading(true);
      const response = await getCommonBillDetail(accessToken, year, month);
      if (response.success) {
        setBillDetail(response.data);
      }
    } catch (error) {
      if (error.status === 404) {
        setBillDetail(undefined);
      } else {
        console.error('공동 관리비 내역 불러오기 중 오류 발생:', error);
        setBillDetail(null);
      }
    } finally {
      setModalLoading(false);
    }
  };

  // tab에 따라 list data 변경
  useEffect(() => {
    const fetchCommonBills = async year => {
      try {
        if (!accessToken) return;

        setLoading(true);
        if (activeTab === '공동 관리비') {
          const response = await getCommonBills(accessToken, year);
          if (response.success) {
            setBillList(response.data);
          }
        }
      } catch (error) {
        if (error.status === 404) {
          setBillList(undefined);
        } else {
          console.error('공동 관리비 내역 불러오기 중 오류 발생:', error);
          setBillList(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === '공과금') {
      const currentList = MOCK_UTILITY_BILLS[year] ?? [];
      setBillList(currentList);
    } else {
      fetchCommonBills(year);
    }
  }, [activeTab, year, accessToken]);

  return (
    <BillsTemplate
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      year={year}
      setYear={setYear}
      billList={billList}
      fetchCommonBillsDetail={fetchCommonBillsDetail}
      commonBillDetail={billDetail}
      loading={loading}
      modalLoading={modalLoading}
    />
  );
}
