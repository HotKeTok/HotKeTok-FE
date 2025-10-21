// src/components/repair/vendor-profile/NewsTab.jsx
import React from 'react';
import { Row } from '../../../styles/flex';
import {
  TabBody,
  NewsCard,
  NewsVendorName,
  NewsTitle,
  NewsDate,
  NewsBody,
  ScrollWrapper,
} from './Styles';

export default function NewsTab({ news, vendor }) {
  return (
    <TabBody style={{ paddingTop: '5px' }}>
      <ScrollWrapper>
        {news.map(n => (
          <NewsCard key={n.id}>
            <Row $justify="space-between" $align="center" style={{ marginBottom: '12px' }}>
              <Row $gap={5} $align="center">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#EDEEEF',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#6B7280',
                  }}
                >
                  메
                </div>
                <NewsVendorName>{vendor.name}</NewsVendorName>
              </Row>
              <NewsDate>{n.date}</NewsDate>
            </Row>
            <NewsTitle>{n.title}</NewsTitle>
            <NewsBody>{n.body}</NewsBody>
          </NewsCard>
        ))}
      </ScrollWrapper>
    </TabBody>
  );
}
