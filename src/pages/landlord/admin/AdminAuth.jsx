import { useEffect, useState, useCallback } from 'react';
import AdminAuthTemplate from '../../../templates/landlord/admin/AdminAuthTemplate';
import { getTenantRequestList, approveTenant, rejectTenant } from '../../../api/house-service';

export default function AdminAuth() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTenantRequestList();
      if (res.success) {
        // API data: [{ houseId, name, phoneNumber, profileImageUrl, houseNumber }]
        setItems(res.data || []);
      } else {
        setItems([]);
        // 필요하면 토스트 메시지 처리
        // alert(res.message || '승인 요청을 불러오지 못했어요.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // 승인
  const handleConfirm = async houseId => {
    try {
      const res = await approveTenant(houseId, {}); // 명세상 body는 형식상 존재
      if (!res.success) {
        // alert(res.message || '승인에 실패했어요.');
        return;
      }
      await load();
    } catch (e) {
      // alert('승인 처리 중 오류가 발생했어요.');
    }
  };

  // 거절
  const handleDelete = async houseId => {
    try {
      const res = await rejectTenant(houseId, {});
      if (!res.success) {
        // alert(res.message || '거절에 실패했어요.');
        return;
      }
      await load();
    } catch (e) {
      // alert('거절 처리 중 오류가 발생했어요.');
    }
  };

  return (
    <AdminAuthTemplate
      items={items}
      loading={loading}
      onConfirm={handleConfirm}
      onDelete={handleDelete}
      onRefresh={load}
    />
  );
}
