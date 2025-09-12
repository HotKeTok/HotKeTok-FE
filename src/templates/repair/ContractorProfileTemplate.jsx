// src/templates/ContractorProfileTemplate.jsx
import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';
import { Row, Column, Spacer } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';

import StarIcon from '../../assets/repair/icon-star.svg';
import iconClock from '../../assets/repair/icon-clock.svg';
import iconPhone from '../../assets/repair/icon-phone.svg';
import iconBookmark from '../../assets/repair/icon-bookmark.svg';
import iconAddress from '../../assets/repair/icon-address.svg';

// ✅ mock 데이터 import
import { MOCK_CONTRACTORS } from '../../mocks/repair/contractors';
import AddressBox from '../../components/main/index/AddressBox';

/* =========================================================
 * 메인 컴포넌트
 *  - prop: contractorId (없으면 첫 업체)
 * ======================================================= */
export default function ContractorProfileTemplate({ contractorId }) {
  const contractor = useMemo(() => {
    if (!contractorId) return MOCK_CONTRACTORS[0];
    return MOCK_CONTRACTORS.find(c => c.id === contractorId) || MOCK_CONTRACTORS[0];
  }, [contractorId]);

  const [tab, setTab] = useState('home'); // home | news | review
  const [reviewSort, setReviewSort] = useState('latest'); // latest | ratingLow | ratingHigh
  const sortedReviews = useMemo(() => {
    const list = [...contractor.reviews];
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
  }, [contractor.reviews, reviewSort]);

  return (
    <Screen>
      <TopBar title={'업체 프로필'} />
      <Header>
        <Column $gap={12}>
          <Column $gap={3}>
            <Row $gap={8} style={{ alignItems: 'center' }}>
              <Name>{contractor.name}</Name>
              <CategoryText>{contractor.categories.join('/')}</CategoryText>
            </Row>
            <Row $gap={14} $align="center">
              <Row $gap={4}>
                <IconWrapper src={StarIcon} />
                <RatingText>{contractor.ratingAvg?.toFixed(1) ?? '0.0'}</RatingText>
              </Row>
              <SmallText>후기 {contractor.reviewCount ?? 0}</SmallText>
            </Row>
          </Column>

          <Gallery>
            {contractor.images.map((src, i) => (
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

      {tab === 'home' && <HomeTab contractor={contractor} />}
      {tab === 'news' && <NewsTab news={contractor.news} contractor={contractor} />}
      {tab === 'review' && (
        <ReviewTab
          reviews={sortedReviews}
          reviewCount={contractor.reviewCount}
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
function HomeTab({ contractor }) {
  return (
    <TabBody>
      <Card>
        <CardTitle>소개</CardTitle>
        <CardBody>{contractor.intro}</CardBody>
      </Card>
      <div style={{ padding: '22px 4px' }}>
        <Column $gap={12}>
          <Row $gap={10}>
            <Icon src={iconClock} />
            <IconInfo>{contractor.contact.hours}</IconInfo>
          </Row>
          <Row $gap={10}>
            <Icon src={iconPhone} />
            <IconInfo>{contractor.contact.phone}</IconInfo>
          </Row>
          <Row $gap={10}>
            <Icon src={iconBookmark} />
            <IconInfo>{contractor.categories.join('/')}</IconInfo>
          </Row>
          <Row $gap={10}>
            <Icon src={iconAddress} />
            <IconInfo>{contractor.contact.address}</IconInfo>
          </Row>
        </Column>
      </div>
    </TabBody>
  );
}

/* =========================================================
 * 탭: 소식
 * ======================================================= */
function NewsTab({ news, contractor }) {
  return (
    <TabBody style={{ paddingTop: '0px' }}>
      {news.map(n => (
        <NewsCard key={n.id}>
          <Row $justify="space-between" $align="center" style={{ marginBottom: '12px' }}>
            <Row $gap={5} $align="center">
              <div>업체 사진</div>
              <NewsContractorName>{contractor.name}</NewsContractorName>
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
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
        <ReviewCount>후기 {reviewCount}</ReviewCount>
        <Dropdown>
          <DropdownButton onClick={() => setOpen(v => !v)}>{label}</DropdownButton>
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

      <Spacer h={8} />

      {reviews.map(r => (
        <ReviewCard key={r.id}>
          <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Row $gap={8} style={{ alignItems: 'center' }}>
              <Avatar>{r.user[0]}</Avatar>
              <div>
                <ReviewerName>{r.user}</ReviewerName>
                <Row $gap={4} style={{ alignItems: 'center' }}>
                  <Stars>
                    {'★'.repeat(r.rating)}
                    {'☆'.repeat(5 - r.rating)}
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
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  margin-top: 10px;
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
  padding: 20px 20px;
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
const NewsContractorName = styled.div`
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
  ${typo('button2')};
  height: 32px;
  padding: 0 12px;
  color: ${color('grayscale.600')};
  border: none;
  background: transparent;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 36px;
  background: ${color('grayscale.0')};
  border: 1px solid ${color('grayscale.300')};
  border-radius: 10px;
  overflow: hidden;
  min-width: 140px;
  z-index: 10;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
`;

const DropdownItem = styled.div`
  ${typo('body1')};
  padding: 6px 12px;
  border-radius: 10px;
  text-align: center;
  color: ${p => (p.$active ? color('grayscale.800') : color('grayscale.800'))};
  background: ${p => (p.$active ? color('grayscale.100') : 'transparent')};
  cursor: pointer;

  &:hover {
    background: ${color('grayscale.200')};
  }
`;

const ReviewCard = styled(Card)`
  padding: 14px;
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
  ${typo('body.200')};
  font-weight: 700;
`;

const Stars = styled.div`
  ${typo('caption.100')};
  color: #f7b500;
`;

const Badge = styled.span`
  ${typo('caption.100')};
  color: ${color('brand.primary')};
  background: ${color('brand.primary')}22;
  border: 1px solid ${color('brand.primary')}55;
  padding: 2px 6px;
  border-radius: 999px;
`;

const ReviewDate = styled.div`
  ${typo('caption.100')};
  color: ${color('grayscale.500')};
`;

const ReviewText = styled.p`
  ${typo('body.200')};
  color: ${color('grayscale.800')};
  margin: 10px 0 6px;
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

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px 0;
  color: ${color('grayscale.700')};
`;

const RatingWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const MetaDivider = styled.span`
  width: 1px;
  height: 14px;
  background: ${color('grayscale.300')};
  display: inline-block;
`;

const ReviewLink = styled.button`
  ${typo('body.200')};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${color('grayscale.700')};
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;

  b {
    font-weight: 700;
  }
`;
