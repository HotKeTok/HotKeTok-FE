import React from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/common/TopBar';
import { BottomButtonContainer, Page, ScrollableContent } from '../../../styles/layout';
import NoticeItem from '../../../components/main/notice/NoticeItem';
import { useNavigate } from 'react-router-dom';
import { Row } from '../../../styles/flex';

export default function NoticeTemplate({ noticeList }) {
  const navigate = useNavigate();

  return (
    <Page>
      <TopBar title="공지사항" />
      <Content>
        {noticeList.length === 0 ? (
          <Row
            $align="center"
            $justify="center"
            style={{ width: '100%', height: '100%', textAlign: 'center', color: '#999' }}
          >
            <div> 아직 공지사항이 없습니다.</div>
          </Row>
        ) : (
          noticeList.map(notice => (
            <NoticeItem
              key={notice.id}
              {...notice}
              onClick={() => navigate(`/notice/${notice.noticeId}`)}
            />
          ))
        )}
      </Content>
    </Page>
  );
}

const Content = styled(ScrollableContent)`
  padding-top: 16px;
  padding-right: 16px;
  padding-left: 16px;
  /* 필요시 부모의 padding bottom을 overwrite하여 자체 padding 추가 */
  padding-bottom: calc(16px + var(--bar-safe-h));
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
