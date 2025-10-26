// src/pages/landlord/repair/L_RepairHome.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L_RepairHomeTemplate from '../../../templates/landlord/repair/L_RepairHomeTemplate';

import { getAccessToken } from '../../../utils/auth';
import { apiGetInProgressRepairs } from '../../../api/requestform-service';
import { apiGetAddressReviews } from '../../../api/review-service'; // ★ 추가
import { formatDateToYMD } from '../../../utils/dateFormat';

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

  // ★ 주소기반 후기
  const [reviewItems, setReviewItems] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiGetInProgressRepairs(token);
        const list = res?.data?.list ?? [];

        const landlordOnly = list.filter(
          it => it?.payType === 'PROPRIETORSHIP' || it?.payer === 'LANDLORD'
        );

        const mapped = landlordOnly.map(it => ({
          id: it.requestFormId ?? it.id,
          category: it.category || '기타',
          scheduleLabel: formatDateToYMD(it.requestSchedule),
          currentNumber: it.number || it.currentNumber || '-',
          status: it.status,
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

  // ★ 주소기반 후기 패칭
  useEffect(() => {
    (async () => {
      try {
        setReviewLoading(true);
        const res = await apiGetAddressReviews();
        const reviews = res?.data?.reviews ?? [];

        // 케러셀 아이템 형태로 매핑
        const items = reviews.map(r => ({
          id: r.reviewId,
          companyName: r.vendorName,
          photos: [
            r.reviewImage?.[0] ?? r.vendorProfileImage ?? '',
            r.reviewImage?.[1] ?? r.vendorProfileImage ?? '',
          ],
          reviewerName: r.writerName,
          reviewerAvatar: r.writerProfileImage,
          categoryLabel: r.category,
          rating: r.rate,
          reviewText: r.content,
          vendorId: r.vendorId,
        }));

        setReviewItems(items);
      } catch (e) {
        console.error('주소기반 후기 조회 실패:', e);
        setReviewItems([]);
      } finally {
        setReviewLoading(false);
      }
    })();
  }, []);

  // 진행중 상세 이동
  const handleClickProgress = id => nav(`/repair-progress?id=${encodeURIComponent(id)}`);

  // ★ 후기 카드 클릭 시 업체 프로필로 이동
  const handleReviewClick = item => nav(`/vendor-proifle/${encodeURIComponent(item?.vendorId)}`);

  // 지난 내역 더보기
  const handleClickHistoryMore = () => nav('/repair-history');

  return (
    <L_RepairHomeTemplate
      loading={loading}
      activeList={activeList}
      onClickProgress={handleClickProgress}
      // ★ 추가 전달
      reviewLoading={reviewLoading}
      reviewItems={reviewItems}
      onReviewClick={handleReviewClick}
      onClickHistoryMore={handleClickHistoryMore}
    />
  );
}
