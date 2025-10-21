// src/templates/VendorProfileTemplate.jsx
import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import TopBar from '../../../components/common/TopBar';
import Button from '../../../components/common/Button';
import { Row, Column, Spacer } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';

import iconGreenStar from '../../../assets/repair/icon-star-green.svg';
import iconClock from '../../../assets/repair/icon-clock.svg';
import iconPhone from '../../../assets/repair/icon-phone.svg';
import iconBookmark from '../../../assets/repair/icon-bookmark.svg';
import iconAddress from '../../../assets/repair/icon-address.svg';
import iconChevron from '../../../assets/common/icon-arrow-down.svg';
import iconYelloStar from '../../../assets/repair/vendor-profile/icon-star-yellow.svg';
import iconGrayStar from '../../../assets/repair/vendor-profile/icon-star-gray.svg';

// ✅ mock 데이터 import
import { MOCK_VENDORS } from '../../../mocks/repair/vendors';

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
      <Tabs>
        <TabButton $active={tab === 'home'} onClick={() => setTab('home')}>
          홈
        </TabButton>
        <TabButton $active={tab === 'news'} onClick={() => setTab('news')}>
          소식
        </TabButton>
        <TabButton $active={tab === 'review'} onClick={() => setTab('review')}>
          후기
        </TabButton>
      </Tabs>

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
    </Screen>
  );
}

/* =========================================================
 * 탭: 홈
 *  - 소개 / 운영시간 / 연락처 / 카테고리 / 주소
 * ======================================================= */
function HomeTab({ vendor }) {
  return (
    <TabBody>
      <Card>
        <CardTitle>소개</CardTitle>
        <CardBody>{vendor.intro}</CardBody>
      </Card>
      <div style={{ padding: '22px 4px' }}>
        <Column $gap={12}>
          <Row $gap={10}>
            <Icon src={iconClock} />
            <IconInfo>{vendor.contact.hours}</IconInfo>
          </Row>
          <Row $gap={10}>
            <Icon src={iconPhone} />
            <IconInfo>{vendor.contact.phone}</IconInfo>
          </Row>
          <Row $gap={10}>
            <Icon src={iconBookmark} />
            <IconInfo>{vendor.categories.join('/')}</IconInfo>
          </Row>
          <Row $gap={10}>
            <Icon src={iconAddress} />
            <IconInfo>{vendor.contact.address}</IconInfo>
          </Row>
        </Column>
      </div>
    </TabBody>
  );
}

/* =========================================================
 * 탭: 소식
 * ======================================================= */
function NewsTab({ news, vendor }) {
  return (
    <TabBody style={{ paddingTop: '5px' }}>
      {news.map(n => (
        <NewsCard key={n.id}>
          <Row $justify="space-between" $align="center" style={{ marginBottom: '12px' }}>
            <Row $gap={5} $align="center">
              <Avatar>메</Avatar>
              <NewsVendorName>{vendor.name}</NewsVendorName>
            </Row>
            <NewsDate>{n.date}</NewsDate>
          </Row>
          <NewsTitle>{n.title}</NewsTitle>
          <NewsBody>{n.body}</NewsBody>
        </NewsCard>
      ))}
    </TabBody>
  );
}

/* =========================================================
 * 탭: 후기
 *  - 정렬 드롭다운 (최신순/별점 낮은 순/별점 높은 순)
 * ======================================================= */
function ReviewTab({ reviews, reviewCount, reviewSort, onChangeSort }) {
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

      <Row style={{ padding: '16px' }}>
        <WriteButton text="후기 작성하기" onClick={() => alert('후기 작성')} />
      </Row>
    </TabBody>
  );
}

/* =========================================================
 * 스타일
 * ======================================================= */
const Screen = styled.div`
  min-height: 100vh;
  width: 390px;
  display: flex;
  flex-direction: column;
  background: #fff;
`;

const Header = styled.div`
  background: #fff;
  padding: 10px 0px 20px 24px;
`;

const Name = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;

const IconWrapper = styled.img`
  width: 16px;
  height: 16px;
`;

const RatingText = styled.div`
  ${typo('button2')}
  color: ${color('brand.primary')};
`;

const SmallText = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.500')};
`;

const CategoryText = styled.span`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

const Gallery = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 160px;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Thumb = styled.div`
  scroll-snap-align: start;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${color('grayscale.200')};
  background: ${color('grayscale.50')};
  img {
    width: 160px;
    height: 160px;
    object-fit: cover;
    display: block;
  }
`;

const InquiryButton = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.800')};
  display: flex;
  height: 46px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  cursor: pointer;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  border-bottom: 1px solid ${color('grayscale.300')};
`;

const TabButton = styled.button`
  ${typo('body.200')};
  height: 44px;
  border: none;
  position: relative;
  color: ${color('grayscale.600')};
  ${p =>
    p.$active &&
    css`
      color: black;
      ${typo('subtitle1')}
      &:after {
        content: '';
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 0;
        height: 2px;
        background: #000;
      }
    `}
`;

const TabBody = styled.div`
  padding: 20px;
  background: #fff;
`;

const Card = styled.div`
  box-sizing: border-box;
  background: #fff;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 20px;
  padding: 16px 18px;
`;

const CardTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
  margin-bottom: 10px;
`;

const CardBody = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  white-space: pre-wrap;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
`;

const IconInfo = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
`;

/* ----- News ----- */
const NewsVendorName = styled.div`
  ${typo('button3')};
  color: ${color('grayscale.800')};
`;

const NewsCard = styled.div`
  padding: 20px 0px;
  border-bottom: 1px solid ${color('grayscale.200')};
`;

const NewsTitle = styled.div`
  ${typo('subtitle1')};
`;

const NewsDate = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

const NewsBody = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
  margin-top: 5px;
  white-space: pre-wrap;
`;

/* ----- Review ----- */
const ReviewCount = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  ${typo('button2')};
  height: 32px;
  color: ${color('grayscale.600')};
  border: none;
  background: transparent;
`;

const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  border-radius: 10px;
  min-width: 120px;
  z-index: 10;
  padding: 5px;
  background: ${color('grayscale.100')};
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  gap: 4px;
`;

const DropdownItem = styled.div`
  ${typo('body1')};
  display: flex;
  width: 90px;
  height: 30px;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  color: black;
  background: ${p => (p.$active ? color('grayscale.200') : 'transparent')};
  cursor: pointer;

  &:hover {
    background: ${color('grayscale.200')};
  }
`;

const ChevronIcon = styled.img`
  width: 8px;
  margin-left: 5px;
  transition: transform 0.2s ease;
  transform: rotate(${p => (p.$open ? '180deg' : '0deg')});
`;

const ReviewCard = styled.div`
  padding: 14px 0px;
  border-bottom: 1px solid #efefef;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${color('grayscale.200')};
  display: grid;
  place-items: center;
  ${typo('body.200')};
  font-weight: 700;
  color: ${color('grayscale.600')};
`;

const ReviewerName = styled.div`
  ${typo('button3')};
`;

const Stars = styled.div`
  ${typo('caption.100')};
  color: #f7b500;
`;

const StarIconImg = styled.img`
  width: 12px;
  height: 12px;
`;

const Badge = styled.span`
  ${typo('caption2')};
  color: ${color('brand.primary')};
  display: flex;
  height: 22px;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  border: 0.5px solid ${color('brand.primary')};
`;

const ReviewDate = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

const ReviewText = styled.p`
  ${typo('body2')};
  color: black;
  margin: 8px 0 12px;
  white-space: pre-wrap;
`;

const PhotoRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 28%;
  gap: 8px;
  overflow-x: auto;
  padding-top: 6px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Photo = styled.div`
  border: 1px solid ${color('grayscale.200')};
  border-radius: 8px;
  overflow: hidden;
  img {
    width: 100%;
    height: 88px;
    object-fit: cover;
    display: block;
  }
`;

const WriteButton = styled(Button)`
  width: 100%;
`;
