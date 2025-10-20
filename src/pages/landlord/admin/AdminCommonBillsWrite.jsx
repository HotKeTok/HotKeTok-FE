import { postCommonBill } from '../../../api/commonbill-service';
import AdminCommonBillsWriteTemplate from '../../../templates/landlord/admin/AdminCommonBillsWriteTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState } from 'react';
import Toast from '../../../components/common/Toast';
import { useNavigate } from 'react-router-dom';

export default function AdminCommonBillsWrite() {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: '',
    icon: null,
  });

  const fetchCommonBills = async formData => {
    try {
      const response = await postCommonBill(accessToken, formData);

      if (response.success) {
        setToast({
          open: true,
          message: '공동관리비가 성공적으로 등록되었습니다.',
          icon: null,
        });
        navigate('/admin/common-bills', { replace: true });
      } else {
        setToast({
          open: true,
          message: response.message || '공동관리비 등록에 실패했습니다. 다시 시도해주세요.',
          icon: 'warning',
        });
        console.error('공동관리비 등록 실패:', response.message);
      }
    } catch (error) {
      setToast({
        open: true,
        message: '공동관리비 등록에 실패했습니다. 다시 시도해주세요.',
        icon: 'warning',
      });
      console.error('공동관리비 등록 실패:', error);
    }
  };

  return (
    <>
      <AdminCommonBillsWriteTemplate fetchCommonBills={fetchCommonBills} />
      <Toast
        height={'high'}
        show={toast.open}
        onClose={() => setToast({ open: false, message: '' })}
        message={toast.message}
        icon={toast.icon}
        duration={1200}
      />
    </>
  );
}
