import TopBar from '../../../components/common/TopBar';
import { Page, ScrollableNoBottomBarContent } from '../../../styles/layout';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { Row } from '../../../styles/flex';
import ProfileDefault from '../../../assets/common/icon-profile-default.svg?react';
import { theme } from '../../../styles/theme';
import { formatDateToYMD } from '../../../utils/dateFormat';

export default function NoticeDetailTemplate({ noticeDetail }) {
  return (
    <Page>
      <TopBar title="공지사항" />
      <Container>
        <Content>
          <div>
            <H2>{noticeDetail.title}</H2>
            <Row $justify="space-between" style={{ marginTop: 8 }}>
              <Row $gap={8} $align={'center'}>
                {noticeDetail.authorProfileImage ? (
                  <ProfileImage src={noticeDetail.authorProfileImage} alt="Profile" />
                ) : (
                  <ProfileDefault width={24} height={24} />
                )}
                <Body2>{noticeDetail.author}</Body2>
              </Row>
              <Body2 style={{ color: theme.colors.grayscale[500] }}>
                {formatDateToYMD(noticeDetail.createdAt)}
              </Body2>
            </Row>
          </div>
          <Divider />
          <Body2>{noticeDetail.content}</Body2>
        </Content>
      </Container>
    </Page>
  );
}

const Container = styled(ScrollableNoBottomBarContent)`
  background-color: white;
`;

const Content = styled.div`
  padding: 16px 25px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const H2 = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.800')};
  text-align: left;
`;

const Body2 = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
  white-space: pre-wrap;
`;

const Divider = styled.div`
  height: 1px;
  background: #dedede;
`;

const ProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;
