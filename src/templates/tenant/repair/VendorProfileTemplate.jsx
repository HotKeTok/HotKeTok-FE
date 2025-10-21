// src/templates/tenant/repair/VendorProfileTemplate.jsx
import React, { useMemo, useState } from 'react';

import TopBar from '../../../components/common/TopBar';
import { Screen, TabContainer } from '../../../components/repair/vendor-profile/Styles';
import VendorProfileHeader from '../../../components/repair/vendor-profile/VendorProfileHeader';
import VendorTabsBar from '../../../components/repair/vendor-profile/VendorTabsBar';
import HomeTab from '../../../components/repair/vendor-profile/HomeTab';
import NewsTab from '../../../components/repair/vendor-profile/NewsTab';
import ReviewTab from '../../../components/repair/vendor-profile/ReviewTab';

/**
 * UI 전담 템플릿
 * @param {{ vendor: object }} props
 */
export default function VendorProfileTemplate({ vendor }) {
  const [tab, setTab] = useState('home'); // home | news | review
  const [reviewSort, setReviewSort] = useState('latest'); // latest | ratingLow | ratingHigh

  const sortedReviews = useMemo(() => {
    const list = Array.isArray(vendor?.reviews) ? [...vendor.reviews] : [];
    if (reviewSort === 'latest') return list.sort((a, b) => (a.date < b.date ? 1 : -1));
    if (reviewSort === 'ratingLow') return list.sort((a, b) => a.rating - b.rating);
    if (reviewSort === 'ratingHigh') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [vendor?.reviews, reviewSort]);

  return (
    <Screen>
      <TopBar title="업체 프로필" />
      <VendorProfileHeader vendor={vendor} />
      <VendorTabsBar tab={tab} onChangeTab={setTab} />

      <TabContainer>
        {tab === 'home' && <HomeTab vendor={vendor} />}
        {tab === 'news' && <NewsTab news={vendor.news ?? []} vendor={vendor} />}
        {tab === 'review' && (
          <ReviewTab
            reviews={sortedReviews}
            reviewCount={vendor.reviewCount ?? 0}
            reviewSort={reviewSort}
            onChangeSort={setReviewSort}
          />
        )}
      </TabContainer>
    </Screen>
  );
}
