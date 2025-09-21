import React from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/common/TopBar';
import {
  BottomButtonContainer,
  Page,
  ScrollableContent,
  ScrollableNoBottomBarContent,
} from '../../../styles/layout';
import NoticeItem from '../../../components/main/notice/NoticeItem';
import Button from '../../../components/common/Button';
import { EXAMPLE_NOTICES } from '../../../mocks/main/notice';
import { useNavigate } from 'react-router-dom';

export default function AdminNoticeTemplate() {
  const navigate = useNavigate();

  return (
    <Page>
      <TopBar title="공지사항" />
      <ScrollableNoBottomBarContent style={{ backgroundColor: '#f5f6f6' }}>
        <Content>
          {EXAMPLE_NOTICES.map(notice => (
            <NoticeItem
              key={notice.id}
              {...notice}
              onClick={() => navigate(`/notice/${notice.id}`)}
            />
          ))}
        </Content>
      </ScrollableNoBottomBarContent>
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
