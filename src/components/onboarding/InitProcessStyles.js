import styled, { keyframes } from 'styled-components';
import { color, typo } from '../../styles/tokens';

export const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  overflow: hidden;
`;

export const ContentWrap = styled.div`
  padding: 16px 16px 0 16px;
`;

export const ContentWrapCentered = styled(ContentWrap)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: calc(100dvh - 120px);
  text-align: center;
`;

export const StepTitle = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.800')};
  white-space: pre-line;
  margin: 30px 0 40px 28px;
`;

export const Label = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

export const CardTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.900')};
`;

export const CardDesc = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;

export const ExampleTitle = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  white-space: nowrap;
`;

export const ExampleDesc = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

export const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 500px;
  overflow-y: auto; /* ✅ 실제 스크롤 주체 */
  flex: 1; /* ✅ 남은 영역을 차지해서 스크롤 공간 확보 */

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.15);
  }
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; /* ✅ 남은 높이를 다 차지 */
  min-height: 0; /* ✅ 자식 스크롤 허용 핵심! */
  padding: 0 27px;
`;

export const EmptyText = styled.div`
  margin-top: 16px;
  color: #767676;
  font-size: 14px;
`;

export const AddressCard = styled.div`
  width: 100%;
  text-align: left;
  cursor: pointer;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${color('grayscale.200')};
`;

export const SelectedBox = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 14px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid #efefef;
  background: #fafafb;
  margin-bottom: 30px;
`;

export const Addr = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
`;

export const Caption1Addr = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
`;

export const JibunAddr = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.600')};
`;

export const Jibun = styled.div`
  display: flex;
  width: 38px;
  height: 22px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  border: 0.5px solid #a8a8a8;
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

export const InfoKey = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
`;

export const SmallNotice = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

export const SmallNoticeGreen = styled.div`
  ${typo('caption1')};
  color: ${color('brand.primary')};
`;

const fadeUp = keyframes`
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
`;

const popBounce = keyframes`
  0%   { transform: scale(0.6) rotate(-6deg); opacity: 0; }
  60%  { transform: scale(1.08) rotate(2deg);  opacity: 1; }
  80%  { transform: scale(0.98) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

export const SubmitIcon = styled.img`
  width: 90px;
  animation: ${popBounce} 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  will-change: transform, opacity;
`;

export const SuccessTitle = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.800')};
  animation: ${fadeUp} 360ms ease 80ms both;
  margin-bottom: 6px;
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

export const ProgressTrack = styled.div`
  position: relative;
  height: 2px;
  width: 100%;
  background: ${color('grayscale.200')};
`;

export const ProgressFill = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $start = 0 }) => `${$start}%`};
  width: ${({ $width = 0 }) => `${$width}%`};
  background: ${color('brand.primary')};
  transition: left 220ms ease, width 220ms ease;
`;

export const UploadBox = styled.div`
  width: 100%;
  height: 160px;
  border: 1px dashed ${color('grayscale.300')};
  border-radius: 6px;
  background: #fafafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const UploadIcon = styled.img`
  width: 33px;
`;

export const UploadTitle = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.500')};
`;
