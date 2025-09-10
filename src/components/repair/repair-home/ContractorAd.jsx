// src/components/repair/repair-home/RepairCompanyCarousel.jsx
import React from 'react';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { Row, Column } from '../../../styles/flex';
import StarIcon from '../../../assets/repair/icon-star.svg';
import PhoneIcon from '../../../assets/repair/icon-phone.svg';
import AddressIcon from '../../../assets/repair/icon-address.svg';

/* =========================================
 * Mock Data (기본값)
 * ======================================= */
const MOCK_COMPANIES = [
  {
    id: 'c1',
    category: '인테리어/리모델링',
    name: '매종인테리어',
    rating: 3.6,
    reviewCount: 10,
    phone: '02-000-0000',
    address: '서울특별시 동작구 상도동 사당로 12',
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'c2',
    category: '종합설비업체',
    name: 'GS 건설',
    rating: 3.6,
    reviewCount: 10,
    phone: '02-1234-1234',
    address: '서울특별시 동작구 상도동 성대로 25',
    imageUrl:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
  },
];

/* =========================================
 * 카드 한 개(실제 데이터 props 받아서 사용)
 * ======================================= */
function CompanyCard({ category, name, rating, reviewCount, phone, address, imageUrl }) {
  return (
    <Card role="listitem">
      <CardBody>
        <Column $gap={10}>
          <CategoryChip>{category}</CategoryChip>

          <Column $gap={3}>
            <Name>{name}</Name>
            <Row $gap={8} $align="center">
              <Row $gap={4}>
                <IconWrapper src={StarIcon} />
                <RatingText>{rating.toFixed(1)}</RatingText>
              </Row>
              <SmallText>후기 {reviewCount}</SmallText>
            </Row>
          </Column>

          <Column $gap={6}>
            <Row $gap={4} $align="center">
              <IconWrapper src={PhoneIcon} />
              <DataText>{phone}</DataText>
            </Row>
            <Row $gap={4} $align="center">
              <IconWrapper src={AddressIcon} />
              <DataText>{address}</DataText>
            </Row>
          </Column>
        </Column>
      </CardBody>

      <ThumbWrap>
        <Thumb src={imageUrl} alt={`${name} 업체 사진`} loading="lazy" decoding="async" />
      </ThumbWrap>
    </Card>
  );
}

/* =========================================
 * 가로 스크롤 캐러셀
 * - props.companies 가 없으면 MOCK_COMPANIES 사용
 * ======================================= */
export default function ContractorAd({ companies = MOCK_COMPANIES }) {
  return (
    <div>
      <HorizontalList role="list" aria-label="수리 업체 목록">
        {companies.map(c => (
          <CompanyCard key={c.id} {...c} />
        ))}
      </HorizontalList>
    </div>
  );
}

/* =========================================
 * Styled
 * ======================================= */

const HorizontalList = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 220px;
  gap: 10px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  padding-bottom: 2px; /* 하단 그림자 잘림 방지 */

  /* 스크롤바 미노출 (iOS/Android/desktop 대응) */
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
`;

const Card = styled.div`
  scroll-snap-align: start;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr 160px;
  max-height: 276px;
  width: 220px;
  cursor: pointer;
`;

const CardBody = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const IconWrapper = styled.img`
  width: 16px;
  height: 16px;
`;

const CategoryChip = styled.div`
  align-self: flex-start;
  ${typo('caption1')}
  color: ${color('grayscale.500')};
  background: #f5f6f6;
  border: 1px solid ${color('grayscale.200')};
  padding: 4px 10px;
  border-radius: 30px;
`;

const Name = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;

const RatingText = styled.div`
  ${typo('button3')}
  color: ${color('brand.primary')};
`;

const SmallText = styled.div`
  ${typo('caption2')}
  color: ${color('grayscale.500')};
`;

const DataText = styled.div`
  ${typo('caption2')}
  color: ${color('grayscale.800')};
`;

const ThumbWrap = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
  background: ${color('grayscale.100')};
  border-top: 1px solid ${color('grayscale.200')};
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
