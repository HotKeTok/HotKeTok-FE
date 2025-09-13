import styled from 'styled-components';
import { Column, Row, Spacer } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';

import AvatarImg from '../../assets/my/img-profile.png';
import iconChevron from '../../assets/repair/icon-chevron.svg';

import VerificationBadge from '../../components/my/VerificationBadge';

export default function MyPageTemplate() {
  return (
    <div>
      <Header>
        <RowForTopBar $justify="center" $align="center">
          <Title>마이페이지</Title>
        </RowForTopBar>
      </Header>

      <MiddleSection>
        <Avatar src={AvatarImg} />
        <Column $gap={20}>
          <Column $gap={24}>
            <Row $justify="space-between">
              <Label>이름</Label>
              <Content>하케톡</Content>
            </Row>
            <Row $justify="space-between">
              <Label>휴대폰 번호</Label>
              <Content>010-1234-1234</Content>
            </Row>
            <Row $justify="space-between">
              <Label>아이디</Label>
              <Content>soongsil123</Content>
            </Row>
          </Column>
          <EditButton>프로필 편집</EditButton>
        </Column>
      </MiddleSection>

      <EndSection>
        <Column $gap={10}>
          <Row $justify="space-between">
            <Label>주소</Label>
            <MoveText>
              주소관리 <img src={iconChevron} />
            </MoveText>
          </Row>
          <CurrentAddress>서울특별시 강남구 영동대로 112길 46 304호</CurrentAddress>
          <VerificationBadge status="pending" height={30} typoKey="button2" />
          <div style={{ height: '30px' }} />
          <Row $justify="space-between">
            <Label>수리내역</Label>
            <MoveText>
              조회하기 <img src={iconChevron} />
            </MoveText>
          </Row>
        </Column>
      </EndSection>
    </div>
  );
}

const Header = styled.div`
  width: 100%;
  padding-top: 52px;
  background-color: white;
`;

const RowForTopBar = styled(Row)`
  padding: 0px 6px 4.5px 6px;
`;

const Title = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;

const MiddleSection = styled.div`
  display: flex;
  padding: 30px 24px 16px 24px;
  flex-direction: column;
  gap: 34px;
  background: #fff;
  margin-top: 6px;
  margin-bottom: 8px;
`;

const Avatar = styled.img`
  display: flex;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 100px;
  border: 2.5px solid var(--Color-Primary, #01d281);
  align-self: center;
`;

const Label = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

const Content = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.800')};
`;

const EditButton = styled.div`
  display: flex;
  height: 42px;
  justify-content: center;
  align-items: center;
  ${typo('button2')};
  color: ${color('grayscale.600')};
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;

  cursor: pointer;
`;

const EndSection = styled.div`
  display: flex;
  padding: 24px 24px 0px 24px;
  background: #fff;
  flex-direction: column;
`;

const MoveText = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
  cursor: pointer;
`;

const CurrentAddress = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;
