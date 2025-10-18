import { useEffect } from 'react';
import AdminNoticeDetailTemplate from '../../../templates/landlord/admin/AdminNoticeDetailTemplate';
import { useNavigate, useParams } from 'react-router-dom';
import { getNoticeDetail } from '../../../api/notice-service';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState } from 'react';
import { deleteNotice } from '../../../api/notice-service';

export default function AdminNoticeDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const accessToken = useAuthStore(state => state.accessToken);
  const [noticeDetail, setNoticeDetail] = useState(null);

  const handleNoticeDelete = async () => {
    try {
      if (!accessToken) return;

      const data = await deleteNotice(accessToken, params.id);
      if (data.success) {
        navigate('/notice', { replace: true });
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      return {};
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!accessToken) return;

        const { data } = await getNoticeDetail(params.id, accessToken);
        setNoticeDetail(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [params.id]);

  if (!noticeDetail) {
    return null;
  }

  return <AdminNoticeDetailTemplate noticeDetail={noticeDetail} onDelete={handleNoticeDelete} />;
}
