import React from 'react';
import styled, { css } from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import ArrowRight from '../../../assets/common/icon-arrow-right.svg?react';
import NewIcn from '../../../assets/main/notice/icon-new.svg?react';
import PinIcn from '../../../assets/main/notice/icon-pin.svg?react';
import { Column, Row } from '../../../styles/flex';
import { formatDateToYMD } from '../../../utils/dateFormat';

export default function NoticeItem({ author, authorProfileImage, title, date, isFix, onClick }) {
  return (
    <ItemButton
      type="button"
      aria-label={`${isFix ? '고정 ' : ''}공지: ${title}`}
      onClick={onClick}
      $pinned={isFix}
    >
      <LeftCol $gap={10}>
        <Row $justify="space-between" $align="center">
          <Row $align="center" $gap={6}>
            {isFix ? <PinIcn aria-hidden /> : null}
            <Writer title={author}>{author}</Writer>
          </Row>
          <DateText>{formatDateToYMD(date)}</DateText>
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

  border-radius: 10px;
  background: #fff;
  border: 1px solid ${color('grayscale.200')};

  padding: 14px 0px 14px 16px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f8fafc;
  }
  &:active {
    transform: translateY(0.5px);
  }
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
  -webkit-line-clamp: 2; /* 최대 두 줄 */
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
