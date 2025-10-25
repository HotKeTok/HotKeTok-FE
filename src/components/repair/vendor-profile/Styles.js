// src/components/repair/vendor-profile/Styles.js
import styled, { css } from 'styled-components';
import { color, typo } from '../../../styles/tokens';

/* ----- Screen & Header ----- */
export const Screen = styled.div`
  height: 100dvh; /* 뷰포트에 딱 맞게 고정 */
  width: 390px;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden; /* 바깥(body) 스크롤 방지, 안쪽에 스크롤을 준다 */
`;

export const Header = styled.div`
  background: #fff;
  padding: 10px 0px 20px 24px;
`;

export const Name = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;

export const IconWrapper = styled.img`
  width: 16px;
  height: 16px;
`;

export const RatingText = styled.div`
  ${typo('button2')}
  color: ${color('brand.primary')};
`;

export const SmallText = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.500')};
`;

export const CategoryText = styled.span`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

export const Gallery = styled.div`
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

export const Thumb = styled.div`
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

export const InquiryButton = styled.div`
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

/* ----- Tabs ----- */
export const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  border-bottom: 1px solid ${color('grayscale.300')};
`;

export const TabButton = styled.button`
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

export const TabBody = styled.div`
  padding: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  flex: 1; /* Screen에서 남는 높이 차지 */
  min-height: 0; /* 내부 스크롤 정상 동작을 위해 필수 */
`;

/* ----- Card ----- */
export const Card = styled.div`
  box-sizing: border-box;
  background: #fff;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 20px;
  padding: 16px 18px;
`;

export const CardTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
  margin-bottom: 10px;
`;

export const CardBody = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  white-space: pre-wrap;
`;

export const Icon = styled.img`
  width: 18px;
  height: 18px;
`;

export const IconInfo = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
`;

/* ----- News ----- */
export const NewsVendorName = styled.div`
  ${typo('button3')};
  color: ${color('grayscale.800')};
`;

export const NewsCard = styled.div`
  padding: 20px 0px;
  border-bottom: 1px solid ${color('grayscale.200')};
`;

export const NewsTitle = styled.div`
  ${typo('subtitle1')};
`;

export const NewsDate = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

export const NewsBody = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
  margin-top: 5px;
  white-space: pre-wrap;
`;

/* ----- Review ----- */
export const ReviewCount = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

export const Dropdown = styled.div`
  position: relative;
`;

export const DropdownButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  ${typo('button2')};
  height: 32px;
  color: ${color('grayscale.600')};
  border: none;
  background: transparent;
`;

export const DropdownMenu = styled.div`
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

export const DropdownItem = styled.div`
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
  white-space: nowrap;
`;

export const ChevronIcon = styled.img`
  width: 8px;
  margin-left: 5px;
  transition: transform 0.2s ease;
  transform: rotate(${p => (p.$open ? '180deg' : '0deg')});
`;

export const ScrollWrapper = styled.div`
  flex: 1; /* TabBody 안에서 남는 공간 전부 차지 */
  min-height: 0; /* 자식 스크롤 보장 */
  overflow-y: auto;
`;

export const ReviewCard = styled.div`
  padding: 14px 0px;
  border-bottom: 1px solid #efefef;
`;

export const Avatar = styled.div`
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

export const ReviewerName = styled.div`
  ${typo('button3')};
`;

export const Stars = styled.div`
  display: flex;
  ${typo('caption.100')};
  color: #f7b500;
`;

export const StarIconImg = styled.img`
  width: 12px;
  height: 12px;
`;

export const Badge = styled.span`
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

export const ReviewDate = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

export const ReviewText = styled.p`
  ${typo('body2')};
  color: black;
  margin: 8px 0 12px;
  white-space: pre-wrap;
`;

export const PhotoRow = styled.div`
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

export const Photo = styled.div`
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

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; /* 상단들(TopBar/헤더/탭바)을 제외한 나머지 전부 차지 */
  min-height: 0; /* 내부 스크롤이 먹히게 필수 */
`;
