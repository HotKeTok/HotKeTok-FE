import React, { useState } from "react";
import styled from "styled-components";
import TopBar from "../../components/common/TopBar";
import { BottomButtonContainer, Page, ScrollableContent,  } from "../../styles/layout";
import NoticeItem from "../../components/main/notice/NoticeItem";
import Button from "../../components/common/Button";
import {EXAMPLE_NOTICES} from "../../mocks/main/notice"

export default function NoticeTemplate({onNoticeItemClick}) {


  return (
    <Page>
      <TopBar title="공지사항" />
        <Content>
            {EXAMPLE_NOTICES.map((notice) => (
              <NoticeItem key={notice.id} {...notice} onClick={() => onNoticeItemClick(notice.id)} />
            ))}
        </Content>
        <BottomButtonContainer>
          <Button text="버튼 예시임니두"/>
        </BottomButtonContainer>
    </Page >
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
`