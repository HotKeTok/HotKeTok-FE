// src/pages/tenant/repair/VendorProfile.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import VendorProfileTemplate from '../../../templates/tenant/repair/VendorProfileTemplate';
import { apiGetVendorProfile } from '../../../api/vendor-service';
import { apiGetVendorReviews } from '../../../api/review-service';

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
    categories: d.category ? [d.category] : [], // ← 컴포넌트가 배열을 기대
    ratingAvg: typeof d.rate === 'number' ? d.rate : 0,
    reviewCount: d?.reviewCount ?? 0,
    images,
    intro: d?.introduction ?? '',
    contact: {
      hours: hoursText,
      phone: d?.phoneNumber ?? '',
      address: fullAddr,
    },
    // 아직 API에 없음 → 기본값
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
    })),
  };
}

export default function VendorProfile() {
  const params = useParams();
  const [sp] = useSearchParams();
  const vendorId = Number(params?.vendorId) || Number(sp.get('vendorId')) || 1;

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '' });
  const openToast = msg => setToast({ open: true, message: msg });
  const closeToast = () => setToast({ open: false, message: '' });

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

  if (loading) return <div style={{ padding: 24 }}>불러오는 중...</div>;

  if (!vendor)
    return (
      <>
        <div style={{ padding: 24 }}>업체 정보를 찾을 수 없습니다.</div>
        <Toast open={toast.open} message={toast.message} onClose={closeToast} />
      </>
    );

  return (
    <>
      <VendorProfileTemplate vendor={vendor} />
      <Toast open={toast.open} message={toast.message} onClose={closeToast} />
    </>
  );
}
