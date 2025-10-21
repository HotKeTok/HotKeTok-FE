// src/components/repair/vendor-profile/ReviewTab.jsx
import React, { useState } from 'react';
import { Row } from '../../../styles/flex';
import Button from '../../common/Button';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { formatCategoryName } from '../../../utils/format';
import { formatDateToYMD } from '../../../utils/dateFormat';

import {
  TabBody,
  ReviewCount,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  ChevronIcon,
  ScrollWrapper,
  ReviewCard,
  Avatar,
  ReviewerName,
  Stars,
  StarIconImg,
  Badge,
  ReviewDate,
  ReviewText,
  PhotoRow,
  Photo,
} from './Styles';

import iconChevron from '../../../assets/common/icon-arrow-down.svg';
import iconYelloStar from '../../../assets/repair/vendor-profile/icon-star-yellow.svg';
import iconGrayStar from '../../../assets/repair/vendor-profile/icon-star-gray.svg';

const WriteButton = styled(Button)`
  width: 100%;
`;

export default function ReviewTab({
  reviews,
  reviewCount,
  reviewSort,
  onChangeSort,
  vendorId, // ⬅ 추가: 작성 페이지로 vendorId 전달
  vendorName, // ⬅ 선택: 쿼리에 함께 넘기면 템플릿 타이틀 표시 용
}) {
  const [open, setOpen] = useState(false);
  const label =
    reviewSort === 'latest'
      ? '최신 순'
      : reviewSort === 'ratingLow'
      ? '별점 낮은 순'
      : '별점 높은 순';

  const navigate = useNavigate();

  const goWriteReview = () => {
    const q = new URLSearchParams();
    if (vendorId) q.set('vendorId', String(vendorId));
    if (vendorName) q.set('vendorName', vendorName);
    navigate(`/write-review?${q.toString()}`);
  };

  return (
    <TabBody>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <ReviewCount>후기 {reviewCount}</ReviewCount>
        <Dropdown>
          <DropdownButton onClick={() => setOpen(v => !v)}>
            {label}
            <ChevronIcon src={iconChevron} $open={open} />
          </DropdownButton>
          {open && (
            <DropdownMenu>
              <DropdownItem onClick={() => (onChangeSort('latest'), setOpen(false))}>
                최신 순
              </DropdownItem>
              <DropdownItem onClick={() => (onChangeSort('ratingLow'), setOpen(false))}>
                별점 낮은 순
              </DropdownItem>
              <DropdownItem onClick={() => (onChangeSort('ratingHigh'), setOpen(false))}>
                별점 높은 순
              </DropdownItem>
            </DropdownMenu>
          )}
        </Dropdown>
      </Row>

      <ScrollWrapper>
        {reviews.map(r => (
          <ReviewCard key={r.id ?? r.reviewId}>
            <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Row $gap={8} style={{ alignItems: 'center' }}>
                <Avatar>{(r.user ?? r.writerName ?? '유')[0]}</Avatar>
                <div>
                  <ReviewerName>{r.user ?? r.writerName}</ReviewerName>
                  <Row $gap={4} style={{ alignItems: 'center' }}>
                    <Stars>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIconImg
                          key={i}
                          src={i < (r.rating ?? r.rate ?? 0) ? iconYelloStar : iconGrayStar}
                          alt={i < (r.rating ?? r.rate ?? 0) ? 'yellow star' : 'gray star'}
                        />
                      ))}
                    </Stars>
                    {!!(r.tags?.length || r.category) && (
                      <Badge>{formatCategoryName((r.tags?.join('/') ?? r.category) || '')}</Badge>
                    )}
                  </Row>
                </div>
              </Row>
              <ReviewDate>{formatDateToYMD(r.date) ?? ''}</ReviewDate>
            </Row>

            <ReviewText>{r.body ?? r.content}</ReviewText>

            {!!(r.photos?.length || r.review_image?.length || r.reviewImage?.length) && (
              <PhotoRow>
                {(r.photos ?? r.review_image ?? r.reviewImage).map((src, i) => (
                  <Photo key={i}>
                    <img src={src} alt={`review-${i}`} />
                  </Photo>
                ))}
              </PhotoRow>
            )}
          </ReviewCard>
        ))}
      </ScrollWrapper>

      <Row style={{ paddingTop: '16px' }}>
        <WriteButton text="후기 작성하기" onClick={goWriteReview} />
      </Row>
    </TabBody>
  );
}
