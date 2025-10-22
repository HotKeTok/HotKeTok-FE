import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import VendorProfileTemplate from '../../../templates/tenant/repair/VendorProfileTemplate';
import { apiGetVendorProfile } from '../../../api/vendor-service';
import { apiGetVendorReviews, apiDeleteReview } from '../../../api/review-service';
import { parseJwt, getAccessToken } from '../../../utils/auth';

import Toast from '../../../components/common/Toast';

/** API → 템플릿 구조 매핑 */
function mapApiVendorToTemplate(d) {
  if (!d) return null;

  // 러닝타임 텍스트: "월,화,수,목,금 09:00~18:00"
  const days = Array.isArray(d?.runningTime?.working_day_of_week)
    ? d.runningTime.working_day_of_week.join(',')
    : '';
  const open = d?.runningTime?.openingTime ?? '';
  const close = d?.runningTime?.closingTime ?? '';
  const hoursText = [days, open && close ? `${open}~${close}` : ''].filter(Boolean).join(' ');

  // 주소
  const addr1 = d?.addressAndDetail ?? '';
  const addr2 = d?.detailAddress ? ` ${d.detailAddress}` : '';
  const fullAddr = `${addr1}${addr2}`.trim();

  // 이미지(소개 이미지가 있으면 우선, 없으면 단일 image)
  const introImages = Array.isArray(d?.introductionImage) ? d.introductionImage : [];
  const main = d?.image ? [d.image] : [];
  const images = introImages.length ? introImages : main;

  return {
    id: d.vendorId,
    name: d.name,
    categories: d.category ? [d.category] : [],
    ratingAvg: typeof d.rate === 'number' ? d.rate : 0,
    reviewCount: d?.reviewCount ?? 0,
    images,
    intro: d?.introduction ?? '',
    contact: {
      hours: hoursText,
      phone: d?.phoneNumber ?? '',
      address: fullAddr,
    },
    news: [],
    reviews: [],
  };
}

function mapApiReviewsToTemplate(data) {
  const list = Array.isArray(data?.reviews) ? data.reviews : [];
  return {
    count: Number(data?.count) || list.length,
    reviews: list.map(r => ({
      id: r.reviewId,
      user: r.writerName,
      rating: r.rate,
      body: r.content,
      tags: r.category ? [r.category] : [],
      photos: Array.isArray(r.reviewImage) ? r.reviewImage : [],
      date: r.date ?? null,
      profileImage: r.writerProfileImage,
      // 서버 표준: authorId (int)
      authorId: typeof r.authorId === 'number' ? r.authorId : Number(r.authorId ?? NaN),
    })),
  };
}

export default function VendorProfile() {
  const params = useParams();
  const [sp] = useSearchParams();
  const location = useLocation();
  const vendorId = Number(params?.vendorId) || Number(sp.get('vendorId')) || 1;

  // 현재 로그인한 사용자 ID 추출
  const token = getAccessToken();
  const decoded = parseJwt(token) || {};
  const rawId =
    decoded.id ??
    decoded.userId ??
    decoded.user_id ??
    decoded.memberId ??
    decoded.member_id ??
    decoded.sub;
  const currentUserId = rawId == null || rawId === '' ? undefined : Number(rawId);

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });
  const openToast = msg => setToast({ show: true, message: msg });
  const closeToast = () => setToast({ show: false, message: '' });

  // 공통: 리뷰 재조회 함수
  const refreshReviews = async () => {
    const revRes = await apiGetVendorReviews({ vendorId });
    const { count, reviews } =
      revRes.success && revRes.data
        ? mapApiReviewsToTemplate(revRes.data)
        : { count: 0, reviews: [] };
    setVendor(prev => (prev ? { ...prev, reviewCount: count, reviews } : prev));
  };

  // 이동 시 전달된 toastMessage가 있으면 자동 띄움
  useEffect(() => {
    if (location.state?.toastMessage) {
      openToast(location.state.toastMessage);
      // 한 번 띄운 후에는 state 제거 (뒤로가기 시 중복 방지)
      window.history.replaceState({}, document.title, location.pathname + location.search);
    }
  }, [location.state, location.pathname, location.search]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiGetVendorProfile({ vendorId });
        if (!mounted) return;

        if (res.success && res.data) {
          const prof = mapApiVendorToTemplate(res.data);
          const revRes = await apiGetVendorReviews({ vendorId });
          const { count, reviews } =
            revRes.success && revRes.data
              ? mapApiReviewsToTemplate(revRes.data)
              : { count: 0, reviews: [] };

          setVendor({
            ...prof,
            reviewCount: count,
            reviews,
          });
        } else {
          openToast(res.message || '업체 정보를 불러오지 못했습니다.');
        }
      } catch {
        if (!mounted) return;
        openToast('네트워크 오류가 발생했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [vendorId]);

  // 삭제 핸들러: API 호출 후 목록/평점 재조회
  const handleDeleteReview = async reviewId => {
    try {
      const res = await apiDeleteReview({ reviewId });
      if (!res.success) {
        openToast(res.message || '후기 삭제에 실패했습니다.');
        return;
      }
      openToast('후기가 삭제되었습니다.');
      const [revRes, profRes] = await Promise.all([
        apiGetVendorReviews({ vendorId }),
        apiGetVendorProfile({ vendorId }),
      ]);
      if (revRes.success && revRes.data && profRes.success && profRes.data) {
        const prof = mapApiVendorToTemplate(profRes.data);
        const { count, reviews } = mapApiReviewsToTemplate(revRes.data);
        setVendor({ ...prof, reviewCount: count, reviews });
      } else {
        await refreshReviews(); // fallback
      }
    } catch (e) {
      openToast('네트워크 오류가 발생했습니다.');
    }
  };

  if (loading) return <div style={{ padding: 24 }}>불러오는 중...</div>;

  if (!vendor)
    return (
      <>
        <div style={{ padding: 24 }}>업체 정보를 찾을 수 없습니다.</div>
        <Toast show={toast.show} message={toast.message} onClose={closeToast} />
      </>
    );

  return (
    <>
      <VendorProfileTemplate
        vendor={vendor}
        onDeleteReview={handleDeleteReview}
        currentUserId={currentUserId}
      />
      <Toast show={toast.show} message={toast.message} onClose={closeToast} />
    </>
  );
}
