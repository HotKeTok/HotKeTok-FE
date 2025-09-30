import AdminTenantsInfoTemplate from '../../../templates/landlord/admin/AdminTenantsInfoTemplate';
import { useState } from 'react';
import { EXAMPLE_ADMIN_TENANTS } from '../../../mocks/landlord/AdminTenants';

export default function AdminTenantsInfo() {
  const [tenantsList, setTenantsList] = useState(EXAMPLE_ADMIN_TENANTS);

  // todo : 입주민 목록 조회 api
  const getTenantsList = async () => {};

  return <AdminTenantsInfoTemplate tenantsList={tenantsList} />;
}
