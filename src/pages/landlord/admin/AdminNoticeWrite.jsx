import { useLocation } from 'react-router-dom';
import AdminNoticeWriteTemplate from '../../../templates/landlord/admin/AdminNoticeWriteTemplate';

export default function AdminNoticeWrite() {
  const location = useLocation();
  const editData = location.state?.noticeData;
  const isEdit = location.state?.isEdit || false;

  // 초깃값 설정
  let initialData = { title: '', content: '', isFixed: false };
  if (isEdit && editData) {
    initialData = {
      title: editData.title || '',
      content: editData.content || '',
      isFixed: editData.pinned || false,
    };
  }

  // TODO:수정일 때는 데이터 가져오기

  const onNoticeSubmit = ({ formData, noticeIdx }) => {
    // todo : 공지 작성/수정 API 요청
  };

  return (
    <AdminNoticeWriteTemplate isEdit={isEdit} initialData={initialData} onSubmit={onNoticeSubmit} />
  );
}
