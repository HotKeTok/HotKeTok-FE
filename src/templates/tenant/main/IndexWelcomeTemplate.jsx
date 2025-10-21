import styled from 'styled-components';
import PageHeader from '../../../components/common/PageHeader';
import SelectHome from '../../../components/main/index/SelectHome';
import AddressBox from '../../../components/main/index/AddressBox';
import { Column } from '../../../styles/flex';
import WelcomeHouse from '../../../assets/main/icn-welcome-house.svg?react';
import { typo, color } from '../../../styles/tokens';
import { ScrollableContent } from '../../../styles/layout';
import { useAuthStore } from '../../../store/useAuthStore';

export default function IndexWelcomeTemplate() {
  const currentRole = useAuthStore(state => state.role);

  const MAIN_FEATURES = [
    {
      text: '# 간편한 수리 요청',
      opacity: 1,
      absolute: {
        top: 0,
        left: 0,
      },
    },
    {
      text: '# 투명한 관리비 시각화',
      opacity: 0.6,
      absolute: {
        top: 22,
        right: 0,
      },
    },
    {
      text: '# 집주인 비대면 소통',
      opacity: 0.4,
      absolute: {
        bottom: 0,
        left: 26,
      },
    },
  ];

  return (
    <Container>
      <div style={{ height: 48 }} />
      <AddressBox address="서울특별시 강남구 영동대로 112길 46" currentRole={currentRole} />
      <Center>
        <WelcomeHouse />
        <H2>
          다세대주택 관리, <br />
          손쉽게 끝내는 일상의 필수앱
        </H2>
      </Center>
      <Bottom>
        {MAIN_FEATURES.map(({ text, opacity, absolute }) => (
          <FeatureBox key={text} style={{ opacity, ...absolute }}>
            {text}
          </FeatureBox>
        ))}
      </Bottom>
    </Container>
  );
}

const Container = styled(ScrollableContent)`
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

const FeatureBox = styled.span`
  position: absolute;

  ${typo('body1')};
  color: #fff;

  padding: 10px 16px;
  text-align: center;

  border-radius: 4px;
  background-color: ${color('brand.primary')};
`;
