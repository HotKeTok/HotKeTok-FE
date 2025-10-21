// src/components/repair/vendor-profile/VendorProfileHeader.jsx
import React from 'react';
import { Row, Column } from '../../../styles/flex';
import {
  Header,
  Name,
  CategoryText,
  IconWrapper,
  RatingText,
  SmallText,
  Gallery,
  Thumb,
  InquiryButton,
} from './Styles';

import iconGreenStar from '../../../assets/repair/icon-star-green.svg';

export default function VendorProfileHeader({ vendor }) {
  return (
    <>
      <Header>
        <Column $gap={12}>
          <Column $gap={3}>
            <Row $gap={8} style={{ alignItems: 'center' }}>
              <Name>{vendor.name}</Name>
              <CategoryText>{vendor.categories.join('/')}</CategoryText>
            </Row>
            <Row $gap={14} $align="center">
              <Row $gap={4}>
                <IconWrapper src={iconGreenStar} />
                <RatingText>{vendor.ratingAvg?.toFixed(1) ?? '0.0'}</RatingText>
              </Row>
              <SmallText>후기 {vendor.reviewCount ?? 0}</SmallText>
            </Row>
          </Column>

          <Gallery>
            {vendor.images.map((src, i) => (
              <Thumb key={i}>
                <img src={src} alt={`thumb-${i}`} />
              </Thumb>
            ))}
          </Gallery>
          <div style={{ paddingRight: '24px' }}>
            <InquiryButton onClick={() => alert('문의하기')}>1:1 문의하기</InquiryButton>
          </div>
        </Column>
      </Header>
      <div style={{ background: '#F5F6F6', height: '10px' }} />
    </>
  );
}
