// src/pages/landlord/my/ExtraAddressRegister.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import L_ExtraAddressRegisterTemplate from '../../../templates/landlord/my/L_ExtraAddressRegisterTemplate';
import { apiSearchRoadAddress } from '../../../api/infra-service';
import { apiLandlordRegister } from '../../../api/house-service';

export default function L_ExtraAddressRegister() {
  const nav = useNavigate();

  // 주소 검색 (도로명/지번/건물명 매핑)
  const handleSearch = async keyword => {
    try {
      if (!keyword?.trim()) return [];
      const { success, data } = await apiSearchRoadAddress({
        keyword: keyword.trim(),
        currentPage: 1,
        countPerPage: 10,
      });

      if (!success || !Array.isArray(data)) return [];

      // 서버 응답 케이스별로 안전 매핑
      // 예상 스키마 예: {roadAddr, jibunAddr, buildingName} 또는 {road, jibun, bname}
      return data
        .map((it, idx) => ({
          id: String(it.id ?? idx + 1),
          road: it.road ?? it.roadAddr ?? it.road_address ?? it.address ?? it.fullRoadAddr ?? '',
          jibun: it.jibun ?? it.jibunAddr ?? it.lot_number ?? '',
          bname: it.bname ?? it.buildingName ?? it.building ?? '',
        }))
        .filter(x => x.road);
    } catch {
      return [];
    }
  };

  // 최종 제출 (집주인 주소 등록)
  const handleSubmit = async payload => {
    // payload: { road, jibun, bname, refDetail, count, file }
    try {
      const res = await apiLandlordRegister({
        address: payload?.road ?? '',
        // 서버 DTO: detailAddress 에 건물명(입력값 우선)을 보냄
        detailAddress: payload?.refDetail || payload?.bname || '',
        count: payload?.count ?? 0,
        file: payload?.file ?? null,
      });

      if (!res?.success) {
        alert('등록에 실패했어요. 잠시 후 다시 시도해주세요.');
        return;
      }

      // 목록으로 복귀 + 신규 주소 1건 추가 (템플릿의 목록에서 state add 처리)
      const newItem = {
        id: String(Date.now()),
        roadAddress: payload?.road ?? '',
        buildingName: payload?.refDetail || payload?.bname || '',
        isCurrent: false,
        state: 'NONE', // 최초 상태 (서버 처리 이후 갱신될 수 있음)
      };
      nav('/address-admin', { replace: true, state: { add: newItem } });
    } catch (e) {
      alert(e?.message || '등록 처리 중 오류가 발생했어요.');
    }
  };

  return <L_ExtraAddressRegisterTemplate onSearch={handleSearch} onSubmit={handleSubmit} />;
}
