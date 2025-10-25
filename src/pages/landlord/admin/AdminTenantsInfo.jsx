import AdminTenantsInfoTemplate from '../../../templates/landlord/admin/AdminTenantsInfoTemplate';
import { useEffect, useState } from 'react';
import { getTenantList } from '../../../api/post-service';
import { useAuthStore } from '../../../store/useAuthStore';

export default function AdminTenantsInfo() {
  const accessToken = useAuthStore(state => state.accessToken);
  const [loading, setLoading] = useState(false);
  const [tenantsList, setTenantsList] = useState([]);

  // todo : 입주민 목록 조회 api
  const getTenantsList = async () => {
    try {
      setLoading(true);
      const response = await getTenantList(accessToken);
      if (response.success) {
        setTenantsList(response.data.floors);
      }
    } catch (error) {
      console.error('입주민 목록 조회 실패:', error);
      setTenantsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTenantsList();
  }, [accessToken]);

  return <AdminTenantsInfoTemplate tenantsList={tenantsList} loading={loading} />;
}
