import { useNavigate, useParams } from 'react-router-dom';
import AdminTenantsDetailTemplate from '../../../templates/landlord/admin/AdminTenantsDetailTemplate';
import { EXAMPLE_ADMIN_TENANTS } from '../../../mocks/landlord/AdminTenants';

export default function AdminTenantsDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const tenantId = params.id;

  // todo : 입주민 삭제 api
  const deleteTenant = async tenantId => {
    // 삭제 성공 시, 로컬 상태 tenantsList에서 해당 입주민 제거
  };

  // todo : 입주민 정보 수정 api
  const updateTenantInfo = async (tenantId, updatedInfo) => {
    // 수정 성공 시, 로컬 상태 tenantsList에서 해당 입주민 정보 업데이트
    navigate(-1); // 수정 후 이전 페이지로 이동
  };

  // TODO: api 다시 호출?
  const tenantInfo = {
    id: 1,
    unit: 'B101호',
    name: '김민준',
    phone: '010-1111-2222',
    memo: '차량 2대 등록 (12가 3456, 78나 9012)',
  };

  return (
    <AdminTenantsDetailTemplate
      tenantId={tenantId}
      tenantInfo={tenantInfo}
      deleteTenant={deleteTenant}
      updateTenantInfo={updateTenantInfo}
    />
  );
}
