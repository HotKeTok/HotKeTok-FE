// src/pages/common/InitProcess.jsx
// ✅ 이 파일은 API 연동/상태/콜백만 담당합니다. (UI는 템플릿에 위임)
import React, { useMemo, useState } from 'react';
import InitProcessTemplate from '../../templates/common/InitProcessTemplate';
import { apiTenantRequest, apiLandlordRegister } from '../../api/house-service';
import { apiSearchRoadAddress } from '../../api/infra-service';

/** roadAddr 문자열을 템플릿에서 쓰기 좋게 보조 파싱 (UI 아님: 데이터 정규화 용도) */
function parseRoadAddr(roadAddrStr = '') {
  const s = (roadAddrStr || '').trim();
  if (!s) return { sido: '', sigungu: '', road: '', building: '' };

  const building = s.match(/\((.*?)\)/)?.[0] || '';
  const withoutBuilding = s.replace(/\s*\(.*?\)\s*/, '').trim();

  const tokens = withoutBuilding.split(/\s+/);
  const sido = tokens[0] || '';
  const sigungu = tokens[1] || '';
  const road = tokens.slice(2).join(' ') || '';

  return { sido, sigungu, road, building };
}

export default function InitProcess() {
  // 로딩/요청 진행 상태 (템플릿에 내려 UI 제어)
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [submittingTenant, setSubmittingTenant] = useState(false);
  const [submittingLandlord, setSubmittingLandlord] = useState(false);

  /** 주소 검색 */
  const onSearchAddress = async ({ keyword, page, pageSize }) => {
    try {
      setSearchingAddress(true);
      const res = await apiSearchRoadAddress({
        keyword,
        currentPage: page,
        countPerPage: pageSize,
        resultType: 'json',
      });

      if (res?.success) {
        const items = (res.data || []).map(row => {
          const { roadAddr = '', jibunAddr = '' } = row || {};
          const parsed = parseRoadAddr(roadAddr);
          return { roadAddr, jibunAddr, ...parsed };
        });
        return { success: true, items };
      }
      // 실패 포맷(예: { isSuccess:false, code, message })
      return {
        success: false,
        items: [],
        message: res?.message || res?.data?.message || '주소 검색에 실패했어요.',
      };
    } catch (e) {
      return {
        success: false,
        items: [],
        message:
          e?.response?.data?.message ||
          e?.response?.data?.data?.message ||
          e?.message ||
          '주소 검색 중 오류가 발생했어요.',
      };
    } finally {
      setSearchingAddress(false);
    }
  };

  /** 입주민 초기정보 등록(인증 요청) */
  const onSubmitTenant = async ({
    address,
    floor,
    number,
    alias = '우리집',
    houseType = 'HOME',
  }) => {
    try {
      setSubmittingTenant(true);
      const body = { address, floor, number, alias, houseType };
      const res = await apiTenantRequest(body);

      if (res?.success) {
        // 템플릿에서 네비게이션/알림 처리
        return { success: true, data: res?.data };
      }
      return {
        success: false,
        message: res?.message || res?.data?.message || '인증 요청에 실패했어요.',
      };
    } catch (e) {
      return {
        success: false,
        message:
          e?.response?.data?.message ||
          e?.response?.data?.data?.message ||
          e?.message ||
          '인증 요청 처리 중 오류가 발생했어요.',
      };
    } finally {
      setSubmittingTenant(false);
    }
  };

  /** 집주인 초기정보 등록(파일 업로드 포함) */
  const onSubmitLandlord = async ({ address, detailAddress, count, file }) => {
    try {
      setSubmittingLandlord(true);
      const res = await apiLandlordRegister({ address, detailAddress, count, file });

      if (res?.success) {
        return { success: true, data: res?.data }; // data.houseId 배열 등
      }
      return {
        success: false,
        message: res?.message || res?.data?.message || '등록 처리에 실패했어요.',
      };
    } catch (e) {
      return {
        success: false,
        message:
          e?.response?.data?.message ||
          e?.response?.data?.data?.message ||
          e?.message ||
          '등록 처리 중 오류가 발생했어요.',
      };
    } finally {
      setSubmittingLandlord(false);
    }
  };

  // 템플릿으로 내리는 프롭(전부 UI-불문 기능/상태)
  const templateProps = useMemo(
    () => ({
      // 로딩 상태
      loading: {
        searchingAddress,
        submittingTenant,
        submittingLandlord,
      },
      // 콜백
      onSearchAddress, // ({ keyword, page?, pageSize? }) => { success, items, message? }
      onSubmitTenant, // ({ address, floor, number, alias?, houseType? }) => { success, data?, message? }
      onSubmitLandlord, // ({ address, detailAddress, count, file }) => { success, data?, message? }
    }),
    [searchingAddress, submittingTenant, submittingLandlord]
  );

  return <InitProcessTemplate {...templateProps} />;
}
