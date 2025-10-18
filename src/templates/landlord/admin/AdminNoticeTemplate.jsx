import React from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/common/TopBar';
import { Page, ScrollableContent, ScrollableNoBottomBarContent } from '../../../styles/layout';
import NoticeItem from '../../../components/main/notice/NoticeItem';
import { useNavigate } from 'react-router-dom';
import ButtonFixed from '../../../components/common/ButtonFixed';

export default function AdminNoticeTemplate({ noticeList }) {
  const navigate = useNavigate();

  const onClickWrite = () => {
    navigate('/notice/write');
  };

  return (
    <Page>
      <TopBar title="공지사항" />
      <ScrollableNoBottomBarContent style={{ backgroundColor: '#f5f6f6' }}>
        <Content>
          {noticeList.map(notice => (
            <NoticeItem
              key={notice.id}
              {...notice}
              onClick={() => navigate(`/notice/${notice.noticeId}`)}
            />
          ))}
        </Content>
      </ScrollableNoBottomBarContent>
      <ButtonFixed text="글쓰기" onClick={onClickWrite} />
    </Page>
  );
}

const Content = styled(ScrollableContent)`
  padding-top: 16px;
  padding-right: 16px;
  padding-left: 16px;
  padding-bottom: calc(16px + var(--bar-safe-h));
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
