import MainTemplate from '../../../templates/tenant/main/MainTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState, useEffect } from 'react';
import { getNoticeList } from '../../../api/notice-service';
import { getFixedNoticeList } from '../../../utils/notice';
import useUserAddress from '../../../hooks/useUserAddress';
import { Row } from '../../../styles/flex';
import Toast from '../../../components/common/Toast';

export default function Index() {
  const { loading, addressList, updateAddress } = useUserAddress();

  const accessToken = useAuthStore(state => state.accessToken);
  const [noticeList, setNoticeList] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '' });

  useEffect(() => {
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

    fetchNoticeData();
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
        commonBill={130410}
        noticeList={getFixedNoticeList(noticeList, 1, 4)}
        addressList={addressList}
        updateCurrentAddress={updateCurrentAddress}
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
