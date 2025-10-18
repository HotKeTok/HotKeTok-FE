import { useParams } from 'react-router-dom';
import NoticeDetailTemplate from '../../../templates/tenant/main/NoticeDetailTemplate';
import { getNoticeDetail } from '../../../api/notice-service';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState, useEffect } from 'react';

export default function NoticeDetail() {
  const params = useParams();
  const accessToken = useAuthStore(state => state.accessToken);
  const [noticeDetail, setNoticeDetail] = useState(null);

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
  }, [params.id, accessToken]);

  if (!noticeDetail) {
    return null;
  }
  return <NoticeDetailTemplate noticeDetail={noticeDetail} />;
}
