import styled, { css, keyframes } from 'styled-components';
import { Column } from '../../../styles/flex';
import WelcomeHouse from '../../../assets/main/icn-welcome-house.svg?react';
import { typo, color } from '../../../styles/tokens';
import IconWelcomeLogo from '../../../assets/common/icon-welcome-logo.svg';

export default function IndexWelcomeTemplate() {
  const MAIN_FEATURES = [
    {
      text: '# 간편한 수리 요청',
      opacity: 1,
      delay: 0.5,
      absolute: { top: 0, left: 30 },
    },
    {
      text: '# 투명한 관리비 시각화',
      opacity: 0.6,
      delay: 0.7,
      absolute: { top: 22, right: 10 },
    },
    {
      text: '# 집주인 비대면 소통',
      opacity: 0.4,
      delay: 0.9,
      absolute: { bottom: 0, left: 45 },
    },
  ];

  return (
    <Container>
      <div style={{ height: 48 }} />
      <img src={IconWelcomeLogo} />
      <div style={{ height: 25 }} />
      <WhiteBox $gap={5}>
        <Subtitle1>주소 인증을 진행 중이에요.</Subtitle1>
        <Column>
          <Caption1>작성해 주신 정보를 바탕으로 인증을 진행하고 있어요.</Caption1>
          <Caption1 style={{ color: '#01D281' }}>인증이 완료되면 알림을 보내드릴게요!</Caption1>
        </Column>
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}
        >
          <Tag>인증 중</Tag>
        </div>
      </WhiteBox>
      <Center>
        <WelcomeHouse />
        <H2>
          다세대주택 관리, <br />
          손쉽게 끝내는 일상의 필수앱
        </H2>
      </Center>
      <Bottom>
        {MAIN_FEATURES.map(({ text, opacity, delay, absolute }) => (
          <FeatureBox
            key={text}
            style={{ opacity, ...absolute }}
            $delay={delay}
            $finalOpacity={opacity}
          >
            {text}
          </FeatureBox>
        ))}
      </Bottom>
    </Container>
  );
}

const Container = styled.div`
  flex: 1 1 auto;
  height: 100%;
  padding: 12px 16px;
  background: linear-gradient(180deg, #d8f4ea 0%, #fff 100%);
`;

const Center = styled(Column)`
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const H2 = styled.div`
  ${typo('h2')};
  color: #000;
`;

const Bottom = styled.div`
  height: 96px;
  margin-top: 40px;
  margin-bottom: 40px;
  position: relative;
`;

const fadeIn = (to = 1) => keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: ${to}; transform: translateY(0); }
`;

const float = keyframes`
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;
const FeatureBox = styled.span`
  position: absolute;
  ${typo('body1')};
  color: #fff;
  padding: 10px 16px;
  text-align: center;
  border-radius: 4px;
  background-color: ${color('brand.primary')};

  /* 애니메이션 동안은 opacity를 덮어쓰고, 끝나면 $finalOpacity 로 고정됨 */
  ${({ $delay = 0, $finalOpacity = 1 }) => css`
    animation: ${fadeIn($finalOpacity)} 0.8s ease forwards ${$delay}s,
      ${float} 5s ease-in-out infinite ${$delay + 1.5}s;
  `}
`;

const WhiteBox = styled(Column)`
  background-color: #fff;
  padding: 20px 18px 16px 17px;
  border: 1px solid #f7f9fc;
  border-radius: 10px;
`;

const Subtitle1 = styled.div`
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 34px; /* 141.667% */
`;

const Caption1 = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.600')};
`;

const Tag = styled.div`
  display: inline-flex;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;

  color: ${color('brand.primary')};
  border-radius: 30px;
  border: ${color('brand.primary')} 1px solid;

  ${typo('button1')}
`;
