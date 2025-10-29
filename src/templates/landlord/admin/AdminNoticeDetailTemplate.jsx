import TopBar from '../../../components/common/TopBar';
import { Page, PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { Row } from '../../../styles/flex';
import ProfileDefault from '../../../assets/common/icon-profile-default.svg?react';
import { theme } from '../../../styles/theme';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import OptionsMenu from '../../../components/common/OptionsMenu';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { formatDateToYMD } from '../../../utils/dateFormat';

export default function AdminNoticeDetailTemplate({ noticeDetail, onDelete }) {
  const navigate = useNavigate();
  const params = useParams();
  const noticeId = params.id;
  const [modal, setModal] = useState(false);

  const optionsMenuItems = [
    {
      label: '수정하기',
      onClick: () => handleEdit(noticeId),
    },
    {
      label: '삭제하기',
      onClick: () => setModal(true),
    },
  ];

  const handleEdit = noticeId => {
    navigate(`/notice/write`, {
      state: {
        isEdit: true,
        noticeData: {
          noticeId,
          ...noticeDetail,
        },
      },
    });
  };

  const confirmDelete = () => {
    onDelete();
    setModal(false);
  };

  return (
    <PageWithoutBottomBar>
      <TopBar title="공지사항" />
      <Container>
        <Content>
          <div>
            <Row $justify="space-between" $align="center">
              <H2>{noticeDetail.title}</H2>
              <OptionsMenu options={optionsMenuItems} />
            </Row>

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
        <ConfirmModal
          isOpen={modal}
          onClose={() => setModal(false)}
          onConfirm={confirmDelete}
          title="공지 삭제"
          description="공지를 삭제하시겠어요?"
          confirmText="삭제하기"
        />
      </Container>
    </PageWithoutBottomBar>
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
  word-break: keep-all;
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
