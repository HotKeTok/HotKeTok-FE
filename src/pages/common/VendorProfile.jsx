import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import VendorProfileTemplate from '../../templates/common/VendorProfileTemplate';
import { apiGetVendorProfile, apiGetVendorNews } from '../../api/vendor-service';
import {
  apiGetVendorReviews,
  apiDeleteReview,
  apiGetReviewWriteStatus,
} from '../../api/review-service';
import { parseJwt, getAccessToken } from '../../utils/auth';
import Toast from '../../components/common/Toast';

/** API → 템플릿 구조 매핑 */
function mapApiVendorToTemplate(d) {
  if (!d) return null;

  const days = Array.isArray(d?.runningTime?.working_day_of_week)
    ? d.runningTime.working_day_of_week.join(',')
    : '';
  const open = d?.runningTime?.openingTime ?? '';
  const close = d?.runningTime?.closingTime ?? '';
  const hoursText = [days, open && close ? `${open}~${close}` : ''].filter(Boolean).join(' ');

  const addr1 = d?.addressAndDetail ?? '';
  const addr2 = d?.detailAddress ? ` ${d.detailAddress}` : '';
  const fullAddr = `${addr1}${addr2}`.trim();

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

/** 리뷰 데이터 변환 */
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

/** 소식 데이터 변환 */
function mapApiNewsToTemplate(list) {
  return Array.isArray(list)
    ? list.map(n => ({
        id: n.newsId,
        author: n.authorName,
        profileImage: n.authorProfileImage,
        title: n.title,
        body: n.content,
        date: n.createdAt,
      }))
    : [];
}

export default function VendorProfile() {
  const params = useParams();
  const [sp] = useSearchParams();
  const location = useLocation();
  const vendorId = Number(params?.vendorId) || Number(sp.get('vendorId')) || 1;
  const initialTab = (sp.get('tab') || 'home').toLowerCase(); // 'home' | 'news' | 'review'

  // 로그인 사용자 ID
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
  const [canWrite, setCanWrite] = useState(true);
  const openToast = msg => setToast({ show: true, message: msg });
  const closeToast = () => setToast({ show: false, message: '' });

  // 리뷰 새로고침
  const refreshReviews = async () => {
    const revRes = await apiGetVendorReviews({ vendorId });
    const { count, reviews } =
      revRes.success && revRes.data
        ? mapApiReviewsToTemplate(revRes.data)
        : { count: 0, reviews: [] };
    setVendor(prev => (prev ? { ...prev, reviewCount: count, reviews } : prev));
  };

  // 이동 시 전달된 toastMessage 표시
  useEffect(() => {
    if (location.state?.toastMessage) {
      openToast(location.state.toastMessage);
      window.history.replaceState({}, document.title, location.pathname + location.search);
    }
  }, [location.state, location.pathname, location.search]);

  // 메인 데이터 조회
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [profileRes, reviewRes, newsRes, statusRes] = await Promise.all([
          apiGetVendorProfile({ vendorId }),
          apiGetVendorReviews({ vendorId }),
          apiGetVendorNews({ vendorId }),
          apiGetReviewWriteStatus({ vendorId }),
        ]);
        if (!mounted) return;

        if (profileRes.success && profileRes.data) {
          const prof = mapApiVendorToTemplate(profileRes.data);
          const { count, reviews } =
            reviewRes.success && reviewRes.data
              ? mapApiReviewsToTemplate(reviewRes.data)
              : { count: 0, reviews: [] };
          const news =
            newsRes.success && Array.isArray(newsRes.data)
              ? mapApiNewsToTemplate(newsRes.data)
              : [];
          const status = statusRes.success ? !!statusRes.data?.status : true;

          setVendor({ ...prof, reviewCount: count, reviews, news });
          setCanWrite(status);
        } else {
          openToast(profileRes.message || '업체 정보를 불러오지 못했습니다.');
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

  // 후기 삭제
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
        await refreshReviews();
      }
    } catch {
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
        canWriteReview={canWrite}
        initialTab={initialTab}
      />
      <Toast show={toast.show} message={toast.message} onClose={closeToast} />
    </>
  );
}
