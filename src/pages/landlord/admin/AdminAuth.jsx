import { useState } from 'react';
import AdminAuthTemplate from '../../../templates/landlord/admin/AdminAuthTemplate';

export default function AdminAuth() {
  // 승인시 api 호출
  const handleConfirm = id => {};

  // 삭제(거절)시 api 호출
  const handleDelete = id => {};

  // 승인 혹은 거절시 모달 open

  return <AdminAuthTemplate onConfirm={handleConfirm} onDelete={handleDelete} />;
}
