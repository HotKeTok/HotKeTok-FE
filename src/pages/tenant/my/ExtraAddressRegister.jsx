// src/pages/tenant/my/ExtraAddressRegister.jsx
import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ExtraAddressRegisterTemplate from '../../../templates/tenant/my/ExtraAddressRegisterTemplate';
import { apiSearchRoadAddress } from '../../../api/infra-service';
import { apiTenantRequest } from '../../../api/house-service';

// API 응답을 템플릿이 기대하는 형태로 정규화
// (템플릿은 a.sido, a.sigungu, a.road, a.building, a.jibun을 사용)
function normalizeAddressResult(raw) {
  // 가장 이상적인 케이스: 이미 필요한 키를 제공
  if (raw?.sido && raw?.sigungu && raw?.road) return raw;

  // 그 외 케이스 대비 (최소 방어)
  // roadAddr/addr 등에서 분해 필요 시, 가볍게 분리만 시도
  const roadAddr = raw?.roadAddr || raw?.road_address || raw?.address || '';
  const building = raw?.building || raw?.buildingName || raw?.bname || '';
  const jibun = raw?.jibun || raw?.jibunAddr || raw?.parcelAddress || '';

  // 아주 단순 분해(공백 기준). 실제 서비스 주소 파서가 있다면 교체 권장
  const parts = String(roadAddr).split(' ');
  const sido = parts[0] || '';
  const sigungu = parts[1] || '';
  const road = parts.slice(2).join(' ').trim();

  return {
    sido,
    sigungu,
    road,
    building,
    jibun,
  };
}

export default function ExtraAddressRegister() {
  const location = useLocation();
  const hasHomeAlready = Boolean(location.state?.hasHomeAlready);

  // 1) 도로명 주소 검색
  const handleSearch = useCallback(async keyword => {
    const res = await apiSearchRoadAddress({
      keyword,
      currentPage: 1,
      countPerPage: 10,
      resultType: 'json',
    });
    if (!res.success) {
      throw new Error(res.message || '주소 검색에 실패했습니다.');
    }

    const list = Array.isArray(res.data) ? res.data : res.data?.list || res.data?.addresses || [];
    const normalized = (list || []).map(normalizeAddressResult).filter(a => a.road);
    return normalized;
  }, []);

  // 2) 입주민 집 등록(인증 요청)
  // 템플릿에서 넘겨주는 파라미터를 받아 실제 API 바디로 변환
  const handleSubmit = useCallback(
    async ({ baseAddress, floor, ho, placeType, replaceHome, customPlaceName }) => {
      // 템플릿에서 보여주던 문자열 그대로 조합
      const fullAddress = [
        baseAddress?.sido,
        baseAddress?.sigungu,
        baseAddress?.road,
        baseAddress?.building || '',
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      const alias =
        placeType === 'HOME' ? '우리집' : placeType === 'WORK' ? '회사' : customPlaceName || '기타';

      const body = {
        address: fullAddress, // "경기도 성남시 분당구 판교역로 235 (XX아파트)" 등
        number: `${ho}호`, // 호 표시
        alias, // 우리집/회사/기타 별칭
        type: placeType, // HOME | WORK | ETC
        replaceHome: !!replaceHome, // 우리집 교체 여부 (서버가 받지 않으면 무시됨)
      };

      const res = await apiTenantRequest(body);
      if (!res.success) {
        const code = res?.data?.errorClassName || res?.status || 'REQUEST_FAILED';
        const msg = res?.data?.message || res?.message || '인증 요청에 실패했습니다.';
        throw Object.assign(new Error(msg), { code });
      }
      return res; // 템플릿에서 성공 처리
    },
    []
  );

  return (
    <ExtraAddressRegisterTemplate
      hasHomeAlready={hasHomeAlready}
      onSearch={handleSearch}
      onSubmit={handleSubmit}
    />
  );
}
