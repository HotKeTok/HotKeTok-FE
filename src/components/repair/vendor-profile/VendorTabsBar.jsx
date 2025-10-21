// src/components/repair/vendor-profile/VendorTabsBar.jsx
import React from 'react';
import { Tabs, TabButton } from './Styles';

export default function VendorTabsBar({ tab, onChangeTab }) {
  return (
    <Tabs>
      <TabButton $active={tab === 'home'} onClick={() => onChangeTab('home')}>
        홈
      </TabButton>
      <TabButton $active={tab === 'news'} onClick={() => onChangeTab('news')}>
        소식
      </TabButton>
      <TabButton $active={tab === 'review'} onClick={() => onChangeTab('review')}>
        후기
      </TabButton>
    </Tabs>
  );
}
