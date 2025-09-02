import styled from 'styled-components';
import drillImg from '../../assets/Repair/Drill.png';
import { color, typo } from '../../styles/tokens';
import { Row, Column, Spacer } from '../../styles/flex';

export default function RepairBanner() {
  return (
    <Container>
      <Curve>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="164"
          height="122"
          viewBox="0 0 164 122"
          fill="none"
        >
          <path
            opacity="0.08"
            d="M155.186 121.726C18.5582 127.093 -5.00062 52.3039 0.789782 7.37648C1.34941 3.03434 5.17763 0 9.55569 0H154.708C159.84 0 164 4.16039 164 9.29249V112.546C164 117.453 160.09 121.534 155.186 121.726Z"
            fill="#01D281"
          />
        </svg>
      </Curve>
      <Content>
        <Column $gap={5}>
          <Row $gap={5} $align={'center'}>
            <BannerTitle>뚝딱</BannerTitle>
            <Description>수리가 필요하신가요?</Description>
          </Row>
          <Description>사진 한 장으로 5초만에 뚝딱 견적 받아드릴게요.</Description>
        </Column>
        <div style={{ height: '38px' }} />
        <Column $gap={5}>
          <Row $gap={5}>
            <Category>가전</Category>
            <Category>전기/조명</Category>
          </Row>
          <Row $gap={5}>
            <Category>수도/보일러</Category>
            <Category>문/창문</Category>
            <Spacer />
            <RequestText>수리 요청하기 &gt;</RequestText>
          </Row>
        </Column>
      </Content>
      <Illustration src={drillImg} alt="드릴 이미지" />
    </Container>
  );
}

// 최상위 컨테이너
const Container = styled.div`
  position: relative;
  border-radius: 10px;
  background: var(--Basic-White, #fff);
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  padding: 15px;
  border: 0.5px solid ${color('brand.primary')};
`;

// 배경 곡선
const Curve = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
`;

// 메인 레이아웃
const Content = styled.div``;

const BannerTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
`;

const Description = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
`;

const Category = styled.div`
  display: flex;
  border: 0.5px solid ${color('grayscale.600')};
  padding: 0 8px;
  border-radius: 30px;
  height: 22px;
  justify-content: center;
  align-items: center;
  ${typo('caption1')};
  color: ${color('grayscale.700')};
`;

const RequestText = styled.div`
  display: flex;
  ${typo('caption2')};
  color: ${color('grayscale.800')};
  justify-content: center;
  align-items: flex-end;
  cursor: pointer;
`;

// 오른쪽 삽화 이미지
const Illustration = styled.img`
  position: absolute;
  width: 28.5%;
  top: 32px;
  right: 14px;
`;
