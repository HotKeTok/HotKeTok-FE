import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L_RepairHomeTemplate from '../../../templates/landlord/repair/L_RepairHomeTemplate';

import { getAccessToken } from '../../../utils/auth';
import { apiGetInProgressRepairs } from '../../../api/requestform-service';
import { formatDateToYMD } from '../../../utils/dateFormat';

// 서버 status → UI 라벨 매핑 (필요시 추가/수정)
const STATUS_LABEL = {
  SEARCHING: '업체 찾는 중',
  CHOOSING: '견적서 선택',
  MATCHING: '업체 매칭',
  COMPLETED: '처리 완료',
};
export default function L_RepairHome() {
  const nav = useNavigate();
  const token = useMemo(() => getAccessToken(), []);
  const [loading, setLoading] = useState(false);
  const [activeList, setActiveList] = useState([]); // 진행중만

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiGetInProgressRepairs(token);
        // 응답 예시: { success, data: { count, list: [...] } }
        const list = res?.data?.list ?? [];

        // 1) 집주인 부담만 필터
        const landlordOnly = list.filter(
          it => it?.payType === 'PROPRIETORSHIP' || it?.payer === 'LANDLORD'
        );

        // 2) 템플릿용 필드로 매핑
        const mapped = landlordOnly.map(it => ({
          id: it.requestFormId ?? it.id, // 상세 이동용
          category: it.category || '기타',
          scheduleLabel: formatDateToYMD(it.requestSchedule), // 카드 하단 날짜
          currentNumber: it.number || it.currentNumber || '-', // 호수
          status: it.status, // 원 status
          statusLabel: STATUS_LABEL[it.status] || '진행중',
        }));

        setActiveList(mapped);
      } catch (e) {
        console.error('집주인 수리 목록 조회 실패:', e);
        setActiveList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // 진행중 상세 이동
  const handleClickProgress = id => nav(`/repair-progress?id=${encodeURIComponent(id)}`);
  // 지난 내역 더보기 (아직 API 없음이라면 라우트만 연결하거나 빈 처리)
  const handleClickHistoryMore = () => nav('/repair-history');

  return (
    <L_RepairHomeTemplate
      loading={loading}
      activeList={activeList} // 진행중 카드 목록
      historyList={[]} // (API 준비 전이면 빈 배열)
      onClickProgress={handleClickProgress}
      onClickHistoryMore={handleClickHistoryMore}
    />
  );
}
