// src/components/repair/vendor-profile/ReviewTab.jsx
import React, { useState } from 'react';
import { Row } from '../../../styles/flex';
import Button from '../../common/Button';

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
import styled from 'styled-components';

export default function ReviewTab({ reviews, reviewCount, reviewSort, onChangeSort }) {
  const [open, setOpen] = useState(false);
  const label =
    reviewSort === 'latest'
      ? '최신 순'
      : reviewSort === 'ratingLow'
      ? '별점 낮은 순'
      : '별점 높은 순';

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
          <ReviewCard key={r.id}>
            <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Row $gap={8} style={{ alignItems: 'center' }}>
                <Avatar>{r.user[0]}</Avatar>
                <div>
                  <ReviewerName>{r.user}</ReviewerName>
                  <Row $gap={4} style={{ alignItems: 'center' }}>
                    <Stars>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIconImg
                          key={i}
                          src={i < r.rating ? iconYelloStar : iconGrayStar}
                          alt={i < r.rating ? 'yellow star' : 'gray star'}
                        />
                      ))}
                    </Stars>
                    {!!r.tags?.length && <Badge>{r.tags.join('/')}</Badge>}
                  </Row>
                </div>
              </Row>
              <ReviewDate>{r.date}</ReviewDate>
            </Row>

            <ReviewText>{r.body}</ReviewText>

            {!!r.photos?.length && (
              <PhotoRow>
                {r.photos.map((src, i) => (
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
        <WriteButton text="후기 작성하기" onClick={() => alert('후기 작성')} />
      </Row>
    </TabBody>
  );
}
