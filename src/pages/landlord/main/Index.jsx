import MainTemplate from '../../../templates/landlord/main/MainTemplate';
import { getTenantRequestList } from '../../../api/house-service';
import { useEffect, useState } from 'react';
import Toast from '../../../components/common/Toast';
import useUserAddress from '../../../hooks/useUserAddress';
import { Row } from '../../../styles/flex';

export default function Index() {
  const { loading, updateAddress } = useUserAddress();
  const [toast, setToast] = useState({ open: false, message: '' });
  const [countLoading, setCountLoading] = useState(false);

  const [authRequestCount, setAuthRequestCount] = useState();

  // PUT : 현재 주소 변경
  const updateCurrentAddress = async (newAddress, newNumber) => {
    try {
      const success = await updateAddress(newAddress, newNumber);
      if (success) {
        setToast({ open: true, message: '주소가 변경되었어요.' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // GET: 입주민 인증 요청 건수 GET
  const getTenantAuthRequestCount = async () => {
    try {
      setCountLoading(true);
      const response = await getTenantRequestList();
      if (response.success) {
        setAuthRequestCount(response.data.length);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCountLoading(false);
    }
  };

  useEffect(() => {
    getTenantAuthRequestCount(); // 입주민 인증 요청 건수 조회
  }, []);

  if (loading || countLoading) {
    return (
      <Row style={{ flex: 1 }} $justify="center" $align="center">
        데이터를 불러오는 중입니다..
      </Row>
    );
  }
  return (
    <>
      <MainTemplate
        updateCurrentAddress={updateCurrentAddress}
        authRequestCount={authRequestCount}
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
