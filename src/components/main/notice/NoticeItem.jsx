import React from 'react';
import styled, { css } from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import ArrowRight from "../../../assets/common/icon-arrow-right.svg?react"
import NewIcn from "../../../assets/main/notice/icon-new.svg?react"
import PinIcn from "../../../assets/main/notice/icon-pin.svg?react"
import { Column, Row } from '../../../styles/flex';


/**
 * 공지 아이템 (공통)
 * props:
 * - title: string 
 * - date: string | Date
 * - writer: string
 * - pinned: boolean // 고정 공지
 * - latest: boolean // 새 공지
 * - onClick: function
 */
export default function NoticeItem({
  title,
  date,
  writer,
  pinned = false,
  latest = false,
  onClick,
  ...rest
}) {
  const dateText =
    typeof date === 'string' ? date : new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(date);

  return (
    <ItemButton
      type="button"
      aria-label={`${pinned ? '고정 ' : ''}${latest ? '새 ' : ''}공지: ${title}`}
      onClick={onClick}
      $pinned={pinned}
      {...rest}
    >
      <LeftCol $gap={10}>
        <Row $justify="space-between" $align="center">
          <Row $align="center" $gap={6}>
            {pinned ? <PinIcn aria-hidden /> : latest ? <NewIcn /> : null}
            <Writer title={writer}>{writer}</Writer>
          </Row>
          <DateText>{dateText}</DateText>
        </Row>

        <Title title={title}>{title}</Title>
      </LeftCol>

      <RightCol>
        <ArrowRightStyled />
      </RightCol>
    </ItemButton>
  );
}

const ItemButton = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  border-radius : 10px;
  background: #fff;
  border: 1px solid ${color('grayscale.200')};

  padding: 14px 0px 14px 16px;
  cursor: pointer;
  text-align: left;

  &:hover { background: #f8fafc; }
  &:active { transform: translateY(0.5px); }
`;

const LeftCol = styled(Column)`
  flex: 1 1 auto;
  min-width: 0;

`;

const RightCol = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  width: 40px;
`;

const Writer = styled.span`
  ${typo('caption1')};
  text-overflow: ellipsis;
  white-space: nowrap;
`;


const DateText = styled.time`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

const Title = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};

  display: -webkit-box;
  -webkit-line-clamp: 2;        /* 최대 두 줄 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: keep-all;
`;

const ArrowRightStyled = styled(ArrowRight)`
  width: 10px;
  height: 10px;

  path {
    stroke: #000;
  }
`;