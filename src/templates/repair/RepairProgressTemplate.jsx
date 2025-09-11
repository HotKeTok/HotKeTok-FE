import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';
import ButtonSmall from '../../components/common/ButtonSmall';
import ButtonRound from '../../components/common/ButtonRound';
import RequestSummary from '../../components/repair/RequestSummary';

import { Row, Column, Spacer } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';

import iconInfo from '../../assets/repair/repair-progress/icon-info.svg';

/* =========================================================
 * 타입/상수
 * ======================================================= */
const COST_MODE = {
  SELF: 'SELF', // 본인 부담
  LANDLORD: 'LANDLORD', // 집주인 부담
};

const STEP = {
  FINDING: 1, // 업체 찾는 중
  CHOOSE: 2, // 견적서 선택
  MATCHED: 3, // 업체 매칭
  DONE: 4, // 처리 완료 (이 페이지에선 노출 X)
};

// 예시 썸네일
const SAMPLE_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="66"><rect width="100%" height="100%" rx="6" fill="#EEE"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#999">thumb</text></svg>`
  );

/* =========================================================
 * 페이지 컴포넌트
 *  - props 없이도 동작하도록 mockData 포함
 *  - 실제 연동 시 props 또는 API 데이터로 교체
 * ======================================================= */
export default function RepairProgressTemplate() {
  // ----- 모드/스텝: 실제론 서버 상태에 맞춰 세팅 -----
  const [mode, setMode] = useState(COST_MODE.SELF); // SELF / LANDLORD
  const [step, setStep] = useState(STEP.FINDING); // 1,2,3,4

  // ----- 요청서 데이터 (예시) -----
  const request = useMemo(
    () => ({
      categoryLabel: '기타',
      requestedAt: '2024.10.13',
      hopeAt: '2024.11.20 / 오전 12:30',
      payerLabel: mode === COST_MODE.SELF ? '본인 부담' : '집주인 부담',
      address: '동작 핫케톡 스테이 304호',
      images: [SAMPLE_THUMB, SAMPLE_THUMB],
      description:
        '바퀴벌레가 너무 많아졌습니다. 약 2주정도 된 것 같아요. 집에서 음식을 자주 해먹는 것도 아니고 매번 꼼꼼하게 청소하는데 원인을 모르겠습니다.',
    }),
    [mode]
  );

  // ----- 견적 리스트 (예시) -----
  const [quotes] = useState([
    {
      id: 'q1',
      companyName: '메종인테리어',
      phone: '02-0000-0000',
      price: 230000,
      content: '업계 최고 수준 보장합니다. 합리적인 가격에 모시겠습니다.',
      avatar:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><circle cx="14" cy="14" r="14" fill="#EEE"/></svg>`
        ),
    },
    {
      id: 'q2',
      companyName: 'GS건설',
      phone: '02-0000-0000',
      price: 220000,
      content: '업계 최고 수준 보장합니다. 합리적인 가격에 모시겠습니다.',
      avatar:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><circle cx="14" cy="14" r="14" fill="#EEE"/></svg>`
        ),
    },
    {
      id: 'q3',
      companyName: '세이브프롬',
      phone: '02-0000-0000',
      price: 245000,
      content: '업계 최고 수준 보장합니다. 합리적인 가격에 모시겠습니다.',
      avatar:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><circle cx="14" cy="14" r="14" fill="#EEE"/></svg>`
        ),
    },
  ]);

  // ----- 선택한 견적 -----
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const selectedQuote = useMemo(
    () => quotes.find(q => q.id === selectedQuoteId) || null,
    [quotes, selectedQuoteId]
  );

  // ----- 아코디언 토글 -----
  const [openRequest, setOpenRequest] = useState(true);
  const [openQuotes, setOpenQuotes] = useState(true);

  // ----- 액션 -----
  const handleChooseQuote = () => {
    if (mode === COST_MODE.LANDLORD) return; // 집주인 부담은 선택 불가
    if (!selectedQuoteId) return;
    setStep(STEP.MATCHED);
  };

  const handleCancelMatch = () => {
    // 매칭 취소 → 다시 견적 선택 단계로
    setStep(STEP.CHOOSE);
  };

  // 데모 전환용 UI (실제 배포 시 제거 가능)
  const DemoSwitch = () => (
    <Row $gap={8} style={{ padding: '10px 16px' }}>
      <ButtonSmall
        active={true}
        text="본인부담 모드"
        onClick={() => {
          setMode(COST_MODE.SELF);
          setStep(STEP.FINDING);
          setSelectedQuoteId(null);
        }}
      />
      <ButtonSmall
        active={true}
        text="집주인부담 모드"
        onClick={() => {
          setMode(COST_MODE.LANDLORD);
          setStep(STEP.FINDING);
          setSelectedQuoteId(null);
        }}
      />
      <Spacer x={8} />
      <ButtonSmall active={true} text="STEP1" onClick={() => setStep(STEP.FINDING)} />
      <ButtonSmall active={true} text="STEP2" onClick={() => setStep(STEP.CHOOSE)} />
      <ButtonSmall active={true} text="STEP3" onClick={() => setStep(STEP.MATCHED)} />
    </Row>
  );

  return (
    <>
      <TopBar title="진행중인 수리" />

      {/* 헤더 영역 */}
      <WhiteSection>
        <Row $justify="space-between" style={{ marginBottom: '15px' }}>
          <ButtonRound text="진행중" />
          <InfoIcon src={iconInfo} />
        </Row>
        <Column $gap={20}>
          <Column $gap={6}>
            <Category>{request.categoryLabel}</Category>
            <RequestDate>{request.requestedAt}</RequestDate>
          </Column>

          {/* 스텝 인디케이터 */}
          <StepBar>
            <StepDot $active={step === STEP.FINDING}>업체{'\n'}찾는 중</StepDot>
            <StepDivider />
            <StepDot $active={step === STEP.CHOOSE}>견적서{'\n'}선택</StepDot>
            <StepDivider />
            <StepDot $active={step === STEP.MATCHED}>업체{'\n'}매칭</StepDot>
            <StepDivider />
            <StepDot $active={step === STEP.DONE}>처리{'\n'}완료</StepDot>
          </StepBar>

          {/* 진행 상태 문구 */}
          <GuideBubble>
            {step === STEP.FINDING && '수리업체에서 요청서를 확인하고 있어요.'}
            {step === STEP.CHOOSE &&
              (mode === COST_MODE.SELF
                ? '마음에 드는 견적서를 선택해주세요!'
                : '집주인이 견적서를 선택하는 중이에요.')}
            {step === STEP.MATCHED && '업체가 매칭되었어요!'}
            {step === STEP.DONE && '처리가 완료되었어요.'}
          </GuideBubble>
        </Column>
      </WhiteSection>

      {/* 요청서 아코디언 */}
      <Accordion>
        <AccordionHeader onClick={() => setOpenRequest(!openRequest)}>
          <AccordionTitle>요청서</AccordionTitle>
          <Chevron $open={openRequest} />
        </AccordionHeader>

        {openRequest && (
          <AccordionBody>
            <RequestSummary
              context={{
                // 수리 분야: 키/라벨 매핑
                typeKey: 'etc',
                // 날짜/시간: "YYYY.MM.DD / 오전 12:30" → dateKey/time 로 분리
                dateKey: request.hopeAt.split('/')[0].trim().replace(/\./g, '-'), // "2024-11-20"
                time: request.hopeAt.split('/')[1]?.trim() || '', // "오전 12:30"
                // 비용 부담: 모드 → me/landlord
                payer: mode === COST_MODE.SELF ? 'me' : 'landlord',
                images: request.images,
                desc: request.description,
                useAI: false,
              }}
              address={request.address}
              // 라벨 테이블 (typeKey ↔ label)
              repairTypes={[{ key: 'etc', label: request.categoryLabel }]}
            />
          </AccordionBody>
        )}
      </Accordion>

      {/* 단계별 섹션 */}
      {step === STEP.FINDING && (
        <EmptyQuotes>
          <EmptyBox>
            <AccordionTitle>받은 견적</AccordionTitle>
            <Caption1_600>아직 견적서가 도착하지 않았어요.</Caption1_600>
          </EmptyBox>
        </EmptyQuotes>
      )}

      {step === STEP.CHOOSE && (
        <>
          {/* 받은 견적 아코디언 */}
          <Accordion>
            <AccordionHeader onClick={() => setOpenQuotes(!openQuotes)}>
              <AccordionTitle>
                받은 견적
                <SmallHint>{quotes.length}개 업체에서 견적서를 보내왔어요.</SmallHint>
              </AccordionTitle>
              <Chevron $open={openQuotes} />
            </AccordionHeader>

            {openQuotes && (
              <AccordionBody>
                <Column $gap={12}>
                  {quotes.map(q => (
                    <QuoteCard
                      key={q.id}
                      $selected={selectedQuoteId === q.id}
                      onClick={() => (mode === COST_MODE.SELF ? setSelectedQuoteId(q.id) : null)}
                    >
                      <Row style={{ alignItems: 'center' }} $gap={10}>
                        <Avatar src={q.avatar} alt="" />
                        <CompanyName>
                          {q.companyName} <ArrowRight />
                        </CompanyName>
                      </Row>
                      <Phone>{q.phone}</Phone>
                      <Content>{q.content}</Content>
                      <Price>{comma(q.price)}원</Price>
                    </QuoteCard>
                  ))}
                </Column>
              </AccordionBody>
            )}
          </Accordion>

          <Footer>
            <Button
              disabled={mode === COST_MODE.LANDLORD || !selectedQuoteId}
              onClick={handleChooseQuote}
              text={mode === COST_MODE.LANDLORD ? '집주인이 선택합니다' : '견적서 선택'}
            />
          </Footer>
        </>
      )}

      {step === STEP.MATCHED && selectedQuote && (
        <>
          <MatchedBox>업체가 매칭되었어요!</MatchedBox>

          <Accordion $noTopMargin>
            <AccordionHeader onClick={() => setOpenQuotes(!openQuotes)}>
              <AccordionTitle>선택한 견적</AccordionTitle>
              <Row $gap={8}>
                {mode === COST_MODE.SELF && <ButtonSmall text="취소" onClick={handleCancelMatch} />}
                <Chevron $open={openQuotes} />
              </Row>
            </AccordionHeader>

            {openQuotes && (
              <AccordionBody>
                <KeyValue>
                  <dt>업체명</dt>
                  <dd>
                    <Row $gap={8} style={{ alignItems: 'center' }}>
                      <Avatar src={selectedQuote.avatar} alt="" />
                      <CompanyName as="span">{selectedQuote.companyName}</CompanyName>
                      <ArrowRight />
                    </Row>
                  </dd>
                </KeyValue>
                <KeyValue>
                  <dt>금액</dt>
                  <dd>{comma(selectedQuote.price)}원</dd>
                </KeyValue>
                <KeyValue>
                  <dt>수리 예정 날짜</dt>
                  <dd>{request.hopeAt}</dd>
                </KeyValue>
                <KeyValue>
                  <dt>전화번호</dt>
                  <dd>{selectedQuote.phone}</dd>
                </KeyValue>
                <KeyValue $column>
                  <dt>내용</dt>
                  <dd>
                    <Note>{selectedQuote.content}</Note>
                  </dd>
                </KeyValue>

                <Spacer y={8} />
                <Button text="1:1 문의하기" onClick={() => alert('채팅 진입')} />
              </AccordionBody>
            )}
          </Accordion>
        </>
      )}

      {/* STEP4(처리완료)는 이 페이지에서 다루지 않음 */}
      {/* 데모 스위치 – 실제 배포 시 삭제 가능 */}
      <DemoSwitch />
    </>
  );
}

/* =========================================================
 * 유틸
 * ======================================================= */
function comma(n) {
  try {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch {
    return n;
  }
}

/* =========================================================
 * 스타일
 * ======================================================= */

const WhiteSection = styled.div`
  box-sizing: border-box;
  padding: 20px 24px;
  width: 100%;
  background-color: white;
`;

const Badge = styled.span`
  ${typo('caption2')}
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${color('brand.alpha.10')};
  color: ${color('brand.primary')};
  ${p =>
    p.$type === 'progress' &&
    css`
      background: ${color('brand.alpha.10')};
    `}
`;

const InfoIcon = styled.img`
  width: 22px;
  height: 22px;
  cursor: pointer;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 6px;
`;

const Category = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.600')};
`;

const RequestDate = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.500')};
`;

const StepBar = styled.div`
  display: grid;
  grid-template-columns:
    max-content minmax(16px, 1fr)
    max-content minmax(16px, 1fr)
    max-content minmax(16px, 1fr)
    max-content; /* 마지막 원 */
  align-items: center;
`;

const StepDot = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 56px;
  height: 56px;

  ${typo('button3')}
  white-space: pre-line;
  text-align: center;
  justify-content: center;
  align-items: center;

  color: ${color('grayscale.800')};

  background: ${color('grayscale.100')};
  border: 1px ${({ $active }) => ($active ? 'solid' : 'dashed')} ${color('brand.primary')};
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};

  padding: 10px;
  border-radius: 50%;
`;

const StepDivider = styled.div`
  height: 1px;
  /* 원과 선 사이 살짝 띄우기 */
  margin: 0 8px;
  background: ${color('brand.primary')};
  opacity: 0.4;
`;

const GuideBubble = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
  ${typo('body2')}
  height: 46px;
  text-align: center;

  padding: 10px 12px;
  border: 1px solid ${color('grayscale.300')};
  border-radius: 10px;
  color: ${color('grayscale.600')};
`;

// 섹션 2
const Accordion = styled.div`
  margin-top: ${p => (p.$noTopMargin ? '0' : '10px')};
  background: #fff;
  overflow: hidden;
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  cursor: pointer;
`;

const AccordionTitle = styled.div`
  ${typo('h3')}
  color: ${color('grayscale.800')};
`;

const SmallHint = styled.span`
  ${typo('caption2')}
  color: ${color('grayscale.600')};
  margin-left: 6px;
`;

const Chevron = styled.i`
  width: 6px;
  height: 6px;
  display: inline-block;
  border-right: 2px solid ${color('grayscale.500')};
  border-bottom: 2px solid ${color('grayscale.500')};
  transform: rotate(${p => (p.$open ? '-135deg' : '45deg')});
  transition: transform 0.2s ease;
`;

const AccordionBody = styled.div`
  padding: 16px 24px;
  background: #fff;
`;

const KeyValue = styled.dl`
  display: grid;
  grid-template-columns: ${p => (p.$column ? '90px 1fr' : '110px 1fr')};
  gap: 8px 14px;
  align-items: flex-start;
  & + & {
    margin-top: 10px;
  }
  dt {
    ${typo('caption1')}
    color: ${color('grayscale.600')};
    white-space: nowrap;
  }
  dd {
    ${typo('body2')}
    margin: 0;
  }
`;

const Thumb = styled.img`
  width: 88px;
  height: 66px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${color('grayscale.200')};
`;

const Note = styled.div`
  ${typo('body2')}
  padding: 10px 12px;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 8px;
  color: ${color('grayscale.700')};
`;

const EmptyQuotes = styled.div`
  margin-top: 10px;
`;

const Caption1_600 = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
`;

const EmptyBox = styled.div`
  padding: 16px 24px;
  background: #fff;
`;

const QuoteCard = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  border-radius: 12px;
  padding: 14px;
  background: #fff;
  border: 1px solid ${color('grayscale.200')};
  position: relative;
  cursor: pointer;

  ${p =>
    p.$selected &&
    css`
      border: 1px solid ${color('brand.primary')};
      box-shadow: 0 0 0 3px ${color('brand.alpha.10')};
    `}

  & + & {
    margin-top: 10px;
  }
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${color('grayscale.200')};
`;

const CompanyName = styled.div`
  ${typo('body2')}
`;

const ArrowRight = styled.i`
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-right: 2px solid ${color('grayscale.500')};
  border-bottom: 2px solid ${color('grayscale.500')};
  transform: rotate(-45deg);
  display: inline-block;
`;

const Phone = styled.div`
  ${typo('caption2')}
  color: ${color('grayscale.600')};
  margin-top: 6px;
`;

const Content = styled.p`
  ${typo('caption1')}
  color: ${color('grayscale.700')};
  margin: 8px 0 36px 0;
`;

const Price = styled.div`
  ${typo('subtitle2')}
  position: absolute;
  right: 14px;
  bottom: 14px;
`;

const Footer = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 0 16px 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 24%);
`;

const MatchedBox = styled.div`
  ${typo('caption1')}
  margin-top: 14px;
  padding: 14px 12px;
  border-radius: 10px;
  border: 1px solid ${color('grayscale.200')};
  text-align: center;
  background: #fff;
`;
