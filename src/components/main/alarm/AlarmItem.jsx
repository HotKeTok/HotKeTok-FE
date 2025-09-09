import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { Column, Row } from '../../../styles/flex';
import ChevronIcn from '../../../assets/common/icon-arrow-right.svg?react';
import AlarmIcn from "../../../assets/common/icon-alarm-filled.svg?react";

/**
 * 알림 아이템 (공통)
 * props:
 * - title: string          
 * - body: string           
 * - date: string | Date   
 */
export default function AlarmItem({
  title,
  body,
  date,
}) {
  const dateText =
    typeof date === 'string'
      ? date
      : new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: undefined }).format(date);

  return (
    <Item>
        <Row $justify="space-between" $align="center" style={{width: '100%'}}>
            <Row $gap={8} $align="center">
            <AlarmIcn/>
            <Title title={title}>{title}</Title>
            </Row>
            <MetaTime dateTime={typeof date === 'string' ? undefined : date?.toISOString()}>
                {dateText}
            </MetaTime>
      </Row>

      <Body>
        {body}
      </Body>
    </Item>
  );
}

const Item= styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;

  background: #fff;
  border: 1px solid ${color('grayscale.200')};
  text-align: left;
  cursor: pointer;
`;


const Title = styled.h3`
  ${typo('subtitle1')};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Body = styled.p`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  margin: 0;

  display: -webkit-box;
  -webkit-line-clamp: 2;          /* 본문 2줄 고정 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: keep-all;
`;

const MetaTime = styled.time`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
  flex: 0 0 auto;
`;
