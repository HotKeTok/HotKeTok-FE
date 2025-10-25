import { useNavigate, useParams } from 'react-router-dom';
import AdminTenantsDetailTemplate from '../../../templates/landlord/admin/AdminTenantsDetailTemplate';
import { useEffect } from 'react';
import { getTenantDetail, patchTenantInfo } from '../../../api/house-service';
import { useState } from 'react';

export default function AdminTenantsDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const tenantNumber = params.id;
  const [tenantInfo, setTenantInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // todo : 입주민 정보 수정 api
  const updateTenantInfo = async (tenantNumber, updatedInfo) => {
    try {
      console.log('입주민 정보 수정 요청:', tenantNumber, updatedInfo);
      const response = await patchTenantInfo({
        number: tenantNumber,
        tenantMemo: updatedInfo.houseMemo,
      });
      console.log('입주민 정보 수정 성공:', response);
      if (response.success) {
        setTenantInfo(prev => ({
          ...prev,
          houseMemo: updatedInfo.houseMemo,
        }));
      }
    } catch (error) {
      console.error('입주민 정보 수정 실패:', error);
    }
  };

  useEffect(() => {
    const fetchTenantDetail = async () => {
      try {
        setLoading(true);
        const response = await getTenantDetail(tenantNumber);
        if (response.success) {
          setTenantInfo(response.data);
        }
      } catch (error) {
        console.error('입주민 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantDetail();
  }, [tenantNumber]);

  if (loading) {
    return <div>입주민 정보를 불러오는 중입니다...</div>;
  }

  if (!tenantInfo) {
    return <div>입주민 정보를 찾지 못했습니다.</div>;
  }

  return (
    <AdminTenantsDetailTemplate
      tenantNumber={tenantNumber}
      tenantInfo={tenantInfo}
      updateTenantInfo={updateTenantInfo}
    />
  );
}
