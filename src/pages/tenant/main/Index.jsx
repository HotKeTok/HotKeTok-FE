import MainTemplate from '../../../templates/tenant/main/MainTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState, useEffect } from 'react';
import { getNoticeList } from '../../../api/notice-service';
import { getFixedNoticeList } from '../../../utils/notice';
import useUserAddress from '../../../hooks/useUserAddress';
import { Row } from '../../../styles/flex';
import Toast from '../../../components/common/Toast';
import { getCommonBills } from '../../../api/commonbill-service';

export default function Index() {
  const { loading, addressList, updateAddress } = useUserAddress();

  const accessToken = useAuthStore(state => state.accessToken);
  const [noticeList, setNoticeList] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '' });
  const [commonBillTotal, setCommonBillTotal] = useState(0);

  useEffect(() => {
    // GET: 공지사항 리스트 조회
    const fetchNoticeData = async () => {
      try {
        if (!accessToken) return;
        const { data } = await getNoticeList(accessToken);
        setNoticeList(data || []);
      } catch (error) {
        console.error('Error fetching notice list:', error);
        return [];
      }
    };

    // GET 공동관리비 최근 달 총액 조회
    const fetchCommonBillData = async () => {
      try {
        if (!accessToken) return;
        const { data } = await getCommonBills(accessToken, new Date().getFullYear());
        const latestData = data.slice().sort((a, b) => b.month - a.month)[0];
        setCommonBillTotal(latestData?.balance || 0);
      } catch (error) {
        console.error('Error fetching common bill data:', error);
        return [];
      }
    };

    fetchNoticeData();
    fetchCommonBillData();
  }, [accessToken]);

  // PUT : 현재 주소 변경
  const updateCurrentAddress = async address => {
    try {
      const success = await updateAddress(address.address, address.number);
      if (success) {
        setToast({ open: true, message: '주소가 변경되었어요.' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Row style={{ flex: 1 }} $justify="center" $align="center">
        데이터를 불러오는 중입니다..
      </Row>
    );
  }
  return (
    <>
      <MainTemplate
        utilityBill={132000}
        noticeList={getFixedNoticeList(noticeList, 1, 4)}
        addressList={addressList}
        updateCurrentAddress={updateCurrentAddress}
        commonBillTotal={commonBillTotal}
      />
      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: '' })}
        duration={1000}
      />
    </>
  );
}
