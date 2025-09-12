import React from 'react';
import styled from 'styled-components';
import { Row, Column } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';

/* =========================
 * 유틸(금액 콤마 찍어주기)
 * ========================= */
function comma(n) {
  try {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch {
    return n;
  }
}

/**
 * 업체명~내용까지의 정보 행 묶음
 * - 타이틀(섹션 제목)은 부모가 렌더링
 * - 이 컴포넌트는 행(업체명/금액/수리 예정 날짜/전화번호/내용)만 렌더
 */

export default function RepairDetailRows({
  companyName,
  phone,
  price, // number 또는 string
  schedule, // "YYYY.MM.DD / 오전 12:30" 등 표시 문자열
  content,
  avatar, // 이미지 src
  arrowIcon, // 화살표 아이콘 src (선택)
  onCompanyClick, // 업체 영역 클릭 핸들러 (선택)
}) {
  const displayPrice = typeof price === 'number' ? comma(price) : String(price);

  return (
    <Block>
      {/* 업체명 */}
      <Row $justify="space-between" style={{ marginBottom: '14px' }}>
        <ItemLabel>업체명</ItemLabel>
        <ItemValue>
          <Row
            $gap={8}
            style={{ alignItems: 'center', cursor: onCompanyClick ? 'pointer' : 'default' }}
            onClick={onCompanyClick}
          >
            <Avatar src={avatar} alt="" />
            <CompanyName as="span">{companyName}</CompanyName>
            {arrowIcon && <ArrowRight src={arrowIcon} alt="" />}
          </Row>
        </ItemValue>
      </Row>

      <Column $gap={24}>
        {/* 금액 */}
        <Row $justify="space-between">
          <ItemLabel>금액</ItemLabel>
          <ItemValue>{displayPrice}원</ItemValue>
        </Row>

        {/* 수리 예정 날짜 */}
        <Row $justify="space-between">
          <ItemLabel>수리 예정 날짜</ItemLabel>
          <ItemValue>{schedule}</ItemValue>
        </Row>

        {/* 전화번호 */}
        <Row $justify="space-between">
          <ItemLabel>전화번호</ItemLabel>
          <ItemValue>{phone}</ItemValue>
        </Row>

        {/* 내용 */}
        <Column $gap={8}>
          <ItemLabel>내용</ItemLabel>
          <Note>{content}</Note>
        </Column>
      </Column>
    </Block>
  );
}

/* =========================
 * 내부 스타일
 * ========================= */
const Block = styled.div`
  width: 100%;
`;

const ItemLabel = styled.div`
  ${typo('button2')};
  color: ${color('grayscale.800')};
`;

const ItemValue = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
  text-align: right;
`;

const Note = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  background: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 6px;
  padding: 13px 15px;
  white-space: pre-wrap;
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${color('grayscale.200')};
`;

const CompanyName = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.600')};
`;

const ArrowRight = styled.img`
  margin-left: 4px;
`;
