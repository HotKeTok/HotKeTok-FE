import React, { useState } from "react";
import styled from "styled-components";
import TopBar from "../../components/common/TopBar";
import { Page, ScrollableFullPage } from "../../styles/layout";
import { typo, color } from "../../styles/tokens";
import NoticeItem from "../../components/main/notice/NoticeItem";

export default function NoticeTemplate({onNoticeItemClick}) {
   const notices = [
  {
    id: 1,
    title: "엘리베이터 점검으로 인한 이용 불가 안내",
    date: "2024.10.23",
    writer: "집주인",
    pinned: true,
    latest: false,
  },
  {
    id: 2,
    title: "한양빌라 관리비 인하 고지",
    date: "2024.10.23",
    writer: "집주인",
    pinned: false,
    latest: true,
  },
  {
    id: 3,
    title: "분리수거 안내",
    date: "2024.10.23",
    writer: "집주인",
    pinned: false,
    latest: false,
  },
  {
    id: 4,
    title: "옥상 방수 공사 예정 안내",
    date: "2024.09.15",
    writer: "관리사무소",
    pinned: false,
    latest: false,
  },
  {
    id: 5,
    title: "정전 점검 안내 (9월 20일 오전 9시~12시)",
    date: "2024.09.10",
    writer: "관리사무소",
    pinned: false,
    latest: false,
  },
  {
    id: 6,
    title: "엘리베이터 점검으로 인한 이용 불가 안내",
    date: "2024.10.23",
    writer: "집주인",
    pinned: false,
    latest: false,
  },
  {
    id: 7,
    title: "한양빌라 관리비 인하 고지",
    date: "2024.10.23",
    writer: "집주인",
    pinned: false,
    latest: true,
  },
  {
    id: 8,
    title: "분리수거 안내",
    date: "2024.10.23",
    writer: "집주인",
    pinned: false,
    latest: false,
  },
  {
    id: 9,
    title: "옥상 방수 공사 예정 안내",
    date: "2024.09.15",
    writer: "관리사무소",
    pinned: false,
    latest: false,
  },
  {
    id: 10,
    title: "정전 점검 안내 (9월 20일 오전 9시~12시)",
    date: "2024.09.10",
    writer: "관리사무소",
    pinned: false,
    latest: false,
  },
];


  return (
    <ScrollableFullPage>
      <TopBar title="공지사항" />

        <Content>
            {notices.map((notice) => (
              <NoticeItem key={notice.id} {...notice} onClick={() => onNoticeItemClick(notice.id)} />
            ))}
        </Content>
    </ScrollableFullPage >
  );
}

const Content = styled.div`
    padding: 16px 20px;
    overflow: scroll;

    display: flex;
    flex-direction: column;
    gap: 6px;
`