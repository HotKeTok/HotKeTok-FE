// src/templates/VendorProfileTemplate.jsx
import React, { useMemo, useState } from 'react';

import TopBar from '../../../components/common/TopBar';
import { Screen } from '../../../components/repair/vendor-profile/Styles';
import VendorProfileHeader from '../../../components/repair/vendor-profile/VendorProfileHeader';
import VendorTabsBar from '../../../components/repair/vendor-profile/VendorTabsBar';
import HomeTab from '../../../components/repair/vendor-profile/HomeTab';
import NewsTab from '../../../components/repair/vendor-profile/NewsTab';
import ReviewTab from '../../../components/repair/vendor-profile/ReviewTab';

// ✅ mock 데이터 import (경로는 기존 그대로 유지)
import { MOCK_VENDORS } from '../../../mocks/repair/vendors';
import { TabContainer } from '../../../components/repair/vendor-profile/Styles';

/* =========================================================
 * 메인 컴포넌트
 *  - prop: vendorId (없으면 첫 업체)
 * ======================================================= */
export default function VendorProfileTemplate({ vendorId }) {
  const vendor = useMemo(() => {
    if (!vendorId) return MOCK_VENDORS[0];
    return MOCK_VENDORS.find(c => c.id === vendorId) || MOCK_VENDORS[0];
  }, [vendorId]);

  const [tab, setTab] = useState('home'); // home | news | review
  const [reviewSort, setReviewSort] = useState('latest'); // latest | ratingLow | ratingHigh

  const sortedReviews = useMemo(() => {
    const list = [...vendor.reviews];
    if (reviewSort === 'latest') {
      return list.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    if (reviewSort === 'ratingLow') {
      return list.sort((a, b) => a.rating - b.rating);
    }
    if (reviewSort === 'ratingHigh') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [vendor.reviews, reviewSort]);

  return (
    <Screen>
      <TopBar title={'업체 프로필'} />
      <VendorProfileHeader vendor={vendor} />
      <VendorTabsBar tab={tab} onChangeTab={setTab} />

      <TabContainer>
        {tab === 'home' && <HomeTab vendor={vendor} />}
        {tab === 'news' && <NewsTab news={vendor.news} vendor={vendor} />}
        {tab === 'review' && (
          <ReviewTab
            reviews={sortedReviews}
            reviewCount={vendor.reviewCount}
            reviewSort={reviewSort}
            onChangeSort={setReviewSort}
          />
        )}
      </TabContainer>
    </Screen>
  );
}
