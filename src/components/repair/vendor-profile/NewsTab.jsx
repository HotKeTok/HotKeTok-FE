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
  const hasNews = Array.isArray(news) && news.length > 0;

  return (
    <TabBody style={{ paddingTop: '5px' }}>
      <ScrollWrapper>
        {hasNews ? (
          news.map(n => (
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
                    {vendor?.name?.[0] ?? '업'}
                  </div>
                  <NewsVendorName>{vendor.name}</NewsVendorName>
                </Row>
                <NewsDate>{n.date}</NewsDate>
              </Row>
              <NewsTitle>{n.title}</NewsTitle>
              <NewsBody>{n.body}</NewsBody>
            </NewsCard>
          ))
        ) : (
          // ✅ 소식이 없을 때 표시
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              color: '#9CA3AF',
              fontSize: 14,
              paddingTop: '40px',
            }}
          >
            등록된 소식이 없어요.
          </div>
        )}
      </ScrollWrapper>
    </TabBody>
  );
}
