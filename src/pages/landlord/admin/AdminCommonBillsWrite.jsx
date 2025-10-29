import { postCommonBill } from '../../../api/commonbill-service';
import AdminCommonBillsWriteTemplate from '../../../templates/landlord/admin/AdminCommonBillsWriteTemplate';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';

export default function AdminCommonBillsWrite() {
  const showToast = useToast();
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();

  const fetchCommonBills = async formData => {
    try {
      const response = await postCommonBill(accessToken, formData);

      if (response.success) {
        showToast('공동관리비가 성공적으로 등록되었습니다.');
        navigate('/admin/common-bills', { replace: true });
      } else {
        showToast(response.message || '공동관리비 등록에 실패했습니다. 다시 시도해주세요.');
        console.error('공동관리비 등록 실패:', response.message);
      }
    } catch (error) {
      showToast('공동관리비 등록에 실패했습니다. 다시 시도해주세요.');
      console.error('공동관리비 등록 실패:', error);
    }
  };

  return (
    <>
      <AdminCommonBillsWriteTemplate fetchCommonBills={fetchCommonBills} />
    </>
  );
}
