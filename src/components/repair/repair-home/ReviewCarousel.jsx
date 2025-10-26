// src/components/repair/repair-home/ReviewCarousel.jsx
import React from 'react';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { Row } from '../../../styles/flex';
import iconYellowStar from '../../../assets/repair/vendor-profile/icon-star-yellow.svg';
import iconChevron from '../../../assets/repair/icon-chevron.svg';

function ReviewCard({
  companyName,
  photos = [],
  reviewerName,
  reviewerAvatar,
  categoryLabel,
  rating,
  reviewText,
  onClick,
}) {
  const p0 = photos?.[0] || '';
  const p1 = photos?.[1] || '';

  return (
    <Card role="listitem" onClick={onClick}>
      {/* 상단: 업체명 + > */}
      <HeaderRow>
        <Row $gap={4} $align={'center'}>
          <Avatar src={reviewerAvatar} alt={`${reviewerName || '리뷰어'} 프로필`} />
          <CompanyName>{companyName}</CompanyName>
        </Row>
        <Chevron src={iconChevron} />
      </HeaderRow>

      {/* 사진 2장 그리드 */}
      <PhotoGrid>
        {p0 ? <Thumb src={p0} alt={`${companyName} 사진 1`} /> : <Thumb as="div" />}
        {p1 ? <Thumb src={p1} alt={`${companyName} 사진 2`} /> : <Thumb as="div" />}
      </PhotoGrid>

      {/* 리뷰어 + 카테고리칩 + 별점 */}
      <MetaRow>
        <Row $gap={4} style={{ alignItems: 'center' }}>
          <Avatar src={reviewerAvatar} alt={`${reviewerName || '리뷰어'} 프로필`} />
          <ReviewerName>{reviewerName}</ReviewerName>
        </Row>

        <Row $gap={6} style={{ alignItems: 'center' }}>
          <CategoryChip>{categoryLabel}</CategoryChip>
          <Row $gap={2} style={{ alignItems: 'center' }}>
            <StarIcon src={iconYellowStar} alt="" />
            <RatingText>{rating}</RatingText>
          </Row>
        </Row>
      </MetaRow>

      {/* 리뷰 텍스트 (2줄 말줄임) */}
      <ReviewText title={reviewText}>{reviewText}</ReviewText>
    </Card>
  );
}

export default function ReviewCarousel({ items = [], onItemClick }) {
  return (
    <Wrap>
      <HorizontalList role="list" aria-label="업체 리뷰 목록">
        {items.map(item => (
          <ReviewCard key={item.id} {...item} onClick={() => onItemClick?.(item)} />
        ))}
      </HorizontalList>
    </Wrap>
  );
}

/* ============ styles ============ */

const Wrap = styled.div`
  padding: 0 0 2px 0; /* 그림자 잘림 방지 */
`;

const HorizontalList = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 260px;
  gap: 12px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.div`
  scroll-snap-align: start;
  width: 260px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  padding: 12px 12px 14px 12px;
  cursor: pointer;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CompanyName = styled.div`
  ${typo('button3')};
  color: ${color('grayscale.800')};
`;

const Chevron = styled.img`
  width: 4px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  gap: 10px;
`;

const Thumb = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  background: ${color('grayscale.200')};
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;
`;

const Avatar = styled.img`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${color('grayscale.200')};
`;

const ReviewerName = styled.div`
  ${typo('button3')};
  color: ${color('grayscale.800')};
`;

const CategoryChip = styled.div`
  ${typo('caption2')};
  color: ${color('brand.primary')};
  display: flex;
  height: 22px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  border: 0.5px solid var(--Color-Primary, #01d281);
`;

const StarIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const RatingText = styled.div`
  ${typo('button3')};
  color: ${color('rayscale.600')};
`;

const ReviewText = styled.p`
  ${typo('caption1')};
  color: ${color('grayscale.700')};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
`;
