import styled, { css, keyframes } from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { ScrollableNoBottomBarContent } from '../../../styles/layout';

// === 공용 레이아웃 ===
export const ScrollableNoBottomBarContent2 = styled(ScrollableNoBottomBarContent)`
  padding-bottom: var(--bar-h);
`;
export const StepWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
export const Section = styled.section`
  padding: 24px 24px;
`;
export const SectionTitle = styled.h3`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;
export const Tip = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

// === 아이콘/텍스트 ===
export const IconWrapper = styled.img`
  width: 18px;
  height: 18px;
  place-items: center;
`;
export const BoldText = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;
export const SubBullets = styled.ul`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
  margin: 10px 0 0 0;
  list-style: disc;
`;

// === 작성 단계 스타일 ===
export const HeaderToggle = styled.div`
  background: linear-gradient(90deg, #92ffcc 0%, #5cff9a 50.06%, #3dc279 100%);
  padding: 13px 24px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
export const ToggleSwitch = styled.div`
  width: 52px;
  height: 28px;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  background: ${p => (p.$on ? color('grayscale.700') : color('grayscale.300'))};
  span {
    position: absolute;
    top: 3px;
    left: ${p => (p.$on ? '26px' : '3px')};
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    transition: left 0.2s ease;
  }
`;
export const Caption1_600 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;
export const Caption1_800 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
`;
export const Caption2_800 = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.800')};
`;

export const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  row-gap: 8px;
  column-gap: 16px;
`;
export const TypeItem = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  min-height: 32px;
  &:focus-visible {
    outline: 2px solid ${color('brand.primary')};
    outline-offset: 2px;
    border-radius: 6px;
  }
`;
export const TypeIcon = styled.img`
  width: 22px;
  height: 22px;
  flex: 0 0 28px;
`;
export const TypeLabel = styled.div`
  ${typo('body2')};
  color: ${({ $selected }) => ($selected ? color('grayscale.900') : color('grayscale.700'))};
  white-space: nowrap;
`;

export const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;
export const Thumb = styled.div`
  position: relative;
  height: 80px;
  width: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  overflow: hidden;
`;
export const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
`;
export const UploadBox = styled.label`
  position: relative;
  height: 80px;
  width: 80px;
  border-radius: 6px;
  border: 1px solid ${color('grayscale.400')};
  background: #fff;
  cursor: pointer;
  display: block;
  input {
    display: none;
  }
`;
export const CameraIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 20px;
  opacity: 0.6;
  cursor: pointer;
`;
export const UploadText = styled.div`
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  cursor: pointer;
`;
export const TextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  padding: 13px 15px;
  justify-content: center;
  align-items: center;
  ${typo('body2')};
  color: ${color('grayscale.800')};
  border-radius: 6px;
  border: 1px solid #efefef;
  background: #fafafb;
  resize: none;
  outline: none;
`;
export const CharCount = styled.div`
  display: flex;
  justify-content: flex-end;
  ${typo('caption2')};
  color: ${color('grayscale.400')};
`;

export const DateRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;
export const DateDot = styled.button`
  ${typo('body1')};
  height: 44px;
  border-radius: 50%;
  border: 0;
  ${p =>
    p.$active &&
    css`
      color: #fff;
      background: #000;
    `}
`;
export const Dropdown = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  height: 44px;
  border-radius: 6px;
  border: 1px solid ${color('grayscale.400')};
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${color('grayscale.100')};
  cursor: pointer;
`;
export const DropdownList = styled.ul`
  margin-top: 6px;
  border: 1px solid ${color('grayscale.400')};
  background: ${color('grayscale.100')};
  border-radius: 10px;
  padding: 6px 15px;
  max-height: 240px;
  overflow: auto;
  li {
    padding: 10px 12px;
    cursor: pointer;
  }
  li:hover {
    background: ${color('grayscale.200')};
  }
`;
export const TimeItem = styled.li`
  padding: 14px 16px;
  ${typo('body2')};
  color: ${color('grayscale.800')};
  cursor: pointer;
  border-radius: 8px;
  &:hover {
    background: ${color('grayscale.050')};
  }
  ${p =>
    p.$selected &&
    css`
      background: ${color('grayscale.100')};
      font-weight: 700;
    `}
`;

// === 요약/완료 단계 스타일 ===
export const EditLink = styled.div`
  ${typo('button2')};
  color: #3c66ff;
  cursor: pointer;
`;
export const SummarySection = styled.div`
  padding: 30px 24px;
`;
export const ItemLabel = styled.div`
  ${typo('button2')};
  color: ${color('grayscale.800')};
`;
export const ItemValue = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;
export const DescBox = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  background: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 6px;
  padding: 13px 15px;
`;
export const ThumbRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: wrap;
`;

const popBounce = keyframes`
  0%{ transform:scale(0.6) rotate(-6deg); opacity:0; }
  60%{ transform:scale(1.08) rotate(2deg); opacity:1; }
  80%{ transform:scale(0.98) rotate(-1deg); }
  100%{ transform:scale(1) rotate(0); }
`;
const fadeUp = keyframes`
  from{ transform:translateY(8px); opacity:0; }
  to{ transform:translateY(0); opacity:1; }
`;
export const SubmitIcon = styled.img`
  width: 90px;
  animation: ${popBounce} 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  will-change: transform, opacity;
`;
export const SuccessTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
  animation: ${fadeUp} 360ms ease 80ms both;
`;
export const SuccessSub = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  text-align: center;
  animation: ${fadeUp} 360ms ease 120ms both;
`;
export const FadeInWrap = styled.div`
  animation: ${fadeUp} 700ms ease both;
  animation-delay: 800ms;
`;
