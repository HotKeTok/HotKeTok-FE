import { useLocation, useNavigate } from 'react-router-dom';
import AdminNoticeWriteTemplate from '../../../templates/landlord/admin/AdminNoticeWriteTemplate';
import { postNotice, updateNotice } from '../../../api/notice-service';
import { useAuthStore } from '../../../store/useAuthStore';

export default function AdminNoticeWrite() {
  const accessToken = useAuthStore(state => state.accessToken);
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.noticeData;
  const isEdit = location.state?.isEdit || false;

  // 초깃값 설정
  let initialData = { noticeId: null, title: '', content: '', isFix: false };
  if (isEdit && editData) {
    initialData = {
      noticeId: editData.noticeId || null,
      title: editData.title || '',
      content: editData.content || '',
      isFix: editData.isFix || false,
    };
  }

  const fetchNoticeData = async formData => {
    try {
      if (!accessToken) return;

      if (isEdit) {
        const data = await updateNotice(accessToken, formData);
        if (data.success) {
          navigate(-1);
        }
      } else {
        const data = await postNotice(accessToken, formData);
        if (data.success) {
          navigate(-1);
        }
      }
    } catch (error) {
      console.error('Error fetching notice data:', error);
      return {};
    }
  };

  return (
    <AdminNoticeWriteTemplate
      isEdit={isEdit}
      initialData={initialData}
      onSubmit={fetchNoticeData}
    />
  );
}
