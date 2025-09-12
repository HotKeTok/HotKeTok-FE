import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';
import ButtonSmall from '../../components/common/ButtonSmall';
import ButtonRound from '../../components/common/ButtonRound';
import ModeItem from '../../components/common/ModeItem';
import RequestSummary from '../../components/repair/RequestSummary';

import { Row, Column, Spacer } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';

import iconInfo from '../../assets/repair/repair-progress/icon-info.svg';
import iconChevron from '../../assets/repair/icon-chevron.svg';
import iconClose from '../../assets/common/icon-close.svg';

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
  DONE: 4, // 처리 완료
};

// 예시 썸네일
const SAMPLE_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="66"><rect width="100%" height="100%" rx="6" fill="#EEE"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#999">thumb</text></svg>`
  );

/* =========================================================
 * Collapsible: 높이 측정 기반 부드러운 아코디언
 * ======================================================= */
function Collapsible({ isOpen, children, className }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const next = isOpen ? ref.current.scrollHeight : 0;
    setHeight(next);
  }, [isOpen, children]);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => {
      if (isOpen) setHeight(ref.current.scrollHeight);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [isOpen]);

  return (
    <CollapsibleOuter
      className={className}
      style={{ height, opacity: isOpen ? 1 : 0, transform: `translateY(${isOpen ? 0 : -4}px)` }}
      aria-hidden={!isOpen}
    >
      <div ref={ref}>{children}</div>
    </CollapsibleOuter>
  );
}

/* =========================================================
 * 페이지 컴포넌트
 * ======================================================= */
export default function RepairProgressTemplate() {
  // ----- 모드/스텝: 실제론 서버 상태에 맞춰 세팅 -----
  const [mode, setMode] = useState(COST_MODE.SELF); // SELF / LANDLORD
  const [step, setStep] = useState(STEP.FINDING); // 1,2,3,4
  const isDone = step === STEP.DONE;

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
  // ----- 아코디언 토글 (기본 오픈 상태는 step에 따라 제어) -----
  const [openRequest, setOpenRequest] = useState(true);
  const [openQuotes, setOpenQuotes] = useState(true);

  useEffect(() => {
    if (step === STEP.CHOOSE) {
      setOpenRequest(false);
      setOpenQuotes(true);
    } else if (step === STEP.MATCHED) {
      setOpenRequest(false);
      setOpenQuotes(true);
    } else if (step === STEP.FINDING) {
      setOpenRequest(true);
      setOpenQuotes(false);
    } else if (step === STEP.DONE) {
      // ✅ 완료 모드: 요청서/받은견적 모두 접힘(요약만)
      setOpenRequest(false);
      setOpenQuotes(false);
    }
  }, [step]);

  // ----- 모달 제어 -----
  const [showCancelModal, setShowCancelModal] = useState(false); // 매칭 취소 확인
  const [showInfoModal, setShowInfoModal] = useState(false); // 단계 안내

  // ----- 액션 -----
  const handleChooseQuote = () => {
    if (mode === COST_MODE.LANDLORD) return;
    if (!selectedQuoteId) return;
    setStep(STEP.MATCHED);
  };

  const handleCancelMatch = () => {
    setShowCancelModal(true);
  };

  const confirmCancelMatch = () => {
    setShowCancelModal(false);
    setStep(STEP.CHOOSE);
  };

  const goWriteReview = () => {
    alert('후기 작성 진입'); // TODO: 라우팅 연결
  };

  const canProceed = mode !== COST_MODE.LANDLORD && !!selectedQuoteId;

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
      <ButtonSmall active={true} text="STEP4" onClick={() => setStep(STEP.DONE)} />
    </Row>
  );

  return (
    <>
      <TopBar title={isDone ? '완료된 수리' : '진행중인 수리'} />

      {/* 헤더 영역 */}
      <WhiteSection>
        <Row $justify="space-between" style={{ marginBottom: '15px' }}>
          <ButtonRound text={isDone ? '처리 완료' : '진행중'} />
          <InfoIcon src={iconInfo} onClick={() => setShowInfoModal(true)} />
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

          {/* 진행 상태 문구(완료는 숨김) */}
          {!isDone && (
            <GuideBubble>
              {step === STEP.FINDING && '수리업체에서 요청서를 확인하고 있어요.'}
              {step === STEP.CHOOSE &&
                (mode === COST_MODE.SELF
                  ? '마음에 드는 견적서를 선택해주세요!'
                  : '집주인이 견적서를 선택하는 중이에요.')}
              {step === STEP.MATCHED && '업체가 매칭되었어요!'}
            </GuideBubble>
          )}
        </Column>
      </WhiteSection>

      {/* 요청서 아코디언 */}
      <Accordion>
        <AccordionHeader onClick={() => setOpenRequest(!openRequest)}>
          <AccordionTitle>요청서</AccordionTitle>
          <Chevron $open={openRequest} />
        </AccordionHeader>

        <Collapsible isOpen={openRequest}>
          <AccordionBody>
            <RequestSummary
              context={{
                typeKey: 'etc',
                dateKey: request.hopeAt.split('/')[0].trim().replace(/\./g, '-'),
                time: request.hopeAt.split('/')[1]?.trim() || '',
                payer: mode === COST_MODE.SELF ? 'me' : 'landlord',
                images: request.images,
                desc: request.description,
                useAI: false,
              }}
              address={request.address}
              repairTypes={[{ key: 'etc', label: request.categoryLabel }]}
            />
          </AccordionBody>
        </Collapsible>
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
        <Accordion>
          <AccordionHeader onClick={() => setOpenQuotes(!openQuotes)}>
            <Column $gap={2}>
              <AccordionTitle>
                받은 견적
                <Caption1_600>
                  {quotes.length}개 업체에서 견적서를 보내왔어요.
                  <br />
                  수리를 진행할 업체를 선택해 주세요.
                </Caption1_600>
              </AccordionTitle>
            </Column>
            <Chevron $open={openQuotes} />
          </AccordionHeader>

          <Collapsible isOpen={openQuotes}>
            <AccordionBody2>
              <Column $gap={10}>
                {quotes.map(q => (
                  <ModeItem
                    key={q.id}
                    selected={selectedQuoteId === q.id}
                    onClick={() => (mode === COST_MODE.SELF ? setSelectedQuoteId(q.id) : null)}
                    height="auto"
                    padding="18px 24px"
                  >
                    <CardContent>
                      <Row style={{ alignItems: 'center' }} $gap={10}>
                        <Avatar src={q.avatar} alt="" />
                        <CompanyName>
                          {q.companyName} <ArrowRight src={iconChevron} />
                        </CompanyName>
                      </Row>
                      <Phone>{q.phone}</Phone>
                      <Content>{q.content}</Content>
                      <Price>{comma(q.price)}원</Price>
                    </CardContent>
                  </ModeItem>
                ))}
              </Column>
              <Footer>
                <Button
                  active={canProceed}
                  onClick={handleChooseQuote}
                  text={mode === COST_MODE.LANDLORD ? '집주인이 선택합니다' : '견적서 선택'}
                />
              </Footer>
            </AccordionBody2>
          </Collapsible>
        </Accordion>
      )}

      {step === STEP.MATCHED && selectedQuote && (
        <Accordion>
          <AccordionHeader>
            <AccordionTitle>선택한 견적</AccordionTitle>
            {mode === COST_MODE.SELF && (
              <ButtonSmall width={60} text="취소" onClick={handleCancelMatch} />
            )}
          </AccordionHeader>

          <Collapsible isOpen={openQuotes}>
            <AccordionBody>
              <Row $justify={'space-between'} style={{ marginBottom: '14px' }}>
                <ItemLabel>업체명</ItemLabel>
                <ItemValue>
                  <Row $gap={8} style={{ alignItems: 'center', cursor: 'pointer' }}>
                    <Avatar src={selectedQuote.avatar} alt="" />
                    <CompanyName as="span">{selectedQuote.companyName}</CompanyName>
                    <ArrowRight src={iconChevron} />
                  </Row>
                </ItemValue>
              </Row>
              <Column $gap={24}>
                <Row $justify={'space-between'}>
                  <ItemLabel>금액</ItemLabel>
                  <ItemValue>{comma(selectedQuote.price)}원</ItemValue>
                </Row>
                <Row $justify={'space-between'}>
                  <ItemLabel>수리 예정 날짜</ItemLabel>
                  <ItemValue>{request.hopeAt}</ItemValue>
                </Row>
                <Row $justify={'space-between'}>
                  <ItemLabel>전화번호</ItemLabel>
                  <ItemValue>{selectedQuote.phone}</ItemValue>
                </Row>
                <Column $gap={8}>
                  <ItemLabel>내용</ItemLabel>
                  <Note>{selectedQuote.content}</Note>
                </Column>
              </Column>

              <div style={{ height: '30px' }} />
              <Button text="1:1 문의하기" onClick={() => alert('채팅 진입')} />
            </AccordionBody>
          </Collapsible>
        </Accordion>
      )}

      {/* ✅ STEP4: 처리 완료 화면 */}
      {step === STEP.DONE && selectedQuote && (
        <>
          <DividerLine />
          <SectionHeader>
            <AccordionTitle>수리 정보</AccordionTitle>
          </SectionHeader>

          <InfoCard>
            <Row $justify={'space-between'} style={{ marginBottom: '14px' }}>
              <ItemLabel>업체명</ItemLabel>
              <ItemValue>
                <Row $gap={8} style={{ alignItems: 'center' }}>
                  <Avatar src={selectedQuote.avatar} alt="" />
                  <CompanyName as="span">{selectedQuote.companyName}</CompanyName>
                  <ArrowRight src={iconChevron} />
                </Row>
              </ItemValue>
            </Row>

            <Column $gap={24}>
              <Row $justify={'space-between'}>
                <ItemLabel>금액</ItemLabel>
                <ItemValue>{comma(selectedQuote.price)}원</ItemValue>
              </Row>
              <Row $justify={'space-between'}>
                <ItemLabel>수리 예정 날짜</ItemLabel>
                <ItemValue>{request.hopeAt}</ItemValue>
              </Row>
              <Row $justify={'space-between'}>
                <ItemLabel>전화번호</ItemLabel>
                <ItemValue>{selectedQuote.phone}</ItemValue>
              </Row>
              <Column $gap={8}>
                <ItemLabel>내용</ItemLabel>
                <Note>{selectedQuote.content}</Note>
              </Column>
            </Column>
          </InfoCard>

          <FooterSticky>
            <Button text="후기 작성하기" active={true} onClick={goWriteReview} />
          </FooterSticky>
        </>
      )}

      {/* 모달들 */}
      {showCancelModal && (
        <Dim onClick={() => setShowCancelModal(false)}>
          <Modal role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <ModalTitle>GS 건설</ModalTitle>
            <ModalDesc>업체 선택을 취소하시겠어요?</ModalDesc>
            <Row $gap={10}>
              <ModalButton $variant="ghost" onClick={() => setShowCancelModal(false)}>
                아니요
              </ModalButton>
              <ModalButton onClick={confirmCancelMatch}>취소하기</ModalButton>
            </Row>
          </Modal>
        </Dim>
      )}

      {showInfoModal && (
        <Dim onClick={() => setShowInfoModal(false)}>
          <GuideModal role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <Row $justify={'space-between'}>
              <GuideTitle>STEP 01</GuideTitle>
              <GuideClose src={iconClose} onClick={() => setShowInfoModal(false)} />
            </Row>
            <GuideBlock>
              <GuideStep>업체 찾는 중</GuideStep>
              <GuideText>
                제출하신 요청서를 바탕으로 업체에서 견적서를 작성중이에요!{'\n'} 잠시 기다려주시면
                합리적인 견적서를 찾아드릴게요.
              </GuideText>
            </GuideBlock>
            <GuideTitle>STEP 02</GuideTitle>
            <GuideBlock>
              <GuideStep>견적서 선택</GuideStep>
              <GuideText>
                주변 시공업체에서 요청서를 확인하고 견적서를 보내왔어요. {'\n'}도착한 견적서 중 가장
                합리적인 견적서를 선택하는 단계예요.
              </GuideText>
            </GuideBlock>
            <GuideTitle>STEP 03</GuideTitle>
            <GuideBlock>
              <GuideStep>업체 매칭</GuideStep>
              <GuideText>업체 매칭이 완료됐어요! 곧 수리 기사님이 방문하실 예정이에요.</GuideText>
            </GuideBlock>
            <GuideTitle>STEP 04</GuideTitle>
            <GuideBlock style={{ margin: '4px 0px 0px 0px' }}>
              <GuideStep>처리 완료</GuideStep>
              <GuideText>
                수리가 완료됐어요! 만족스러우셨나요? {'\n'}앞으로도 핫케톡에서 만나요!
              </GuideText>
            </GuideBlock>
          </GuideModal>
        </Dim>
      )}

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

const InfoIcon = styled.img`
  width: 22px;
  height: 22px;
  cursor: pointer;
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
    max-content;
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

/* 구분선 + 섹션 헤더 (완료 화면에서 사용) */
const DividerLine = styled.div`
  height: 8px;
  background: ${color('grayscale.100')};
  width: 100%;
  margin-top: 6px;
`;

const SectionHeader = styled.div`
  padding: 16px 24px 8px 24px;
  background: #fff;
`;

const InfoCard = styled.div`
  padding: 16px 24px 24px 24px;
  background: #fff;
`;

const FooterSticky = styled.div`
  position: sticky;
  bottom: 10px;
  background: #fff;
  padding: 12px 24px 18px;
`;

// 섹션 2 (공용 아코디언)
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

const Chevron = styled.div`
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

const AccordionBody2 = styled.div`
  padding: 0px 24px 16px 24px;
  background: #fff;
`;

const CollapsibleOuter = styled.div`
  overflow: hidden;
  transition: height 240ms ease, opacity 200ms ease, transform 200ms ease;
`;

const CardContent = styled.div`
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

const Phone = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
  margin-top: 4px;
`;

const Content = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.800')};
  margin: 2px 0 10px 0;
`;

const Price = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
  text-align: end;
`;

const Footer = styled.div`
  margin-top: 30px;
`;

/* =========================
 * 모달 스타일
 * ========================= */
const fadeIn = keyframes`
  from { opacity: 0 } to { opacity: 1 }
`;
const pop = keyframes`
  from { transform: translateY(8px); opacity: .8 }
  to   { transform: translateY(0);  opacity: 1 }
`;

const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 390px; /* 앱 최대 폭 한정 */
  margin: 0 auto;

  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 120ms ease;
  z-index: 1000;
`;

const ModalBase = css`
  position: relative;
  width: 80%;
  border-radius: 15px;
  background: #fff;
  padding: 20px 24px 20px 18px;
  animation: ${pop} 160ms ease;
`;

const Modal = styled.div`
  ${ModalBase}
  text-align: center;
`;

const ModalTitle = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
  margin-top: 30px;
`;

const ModalDesc = styled.div`
  ${typo('body1')}
  color: ${color('grayscale.800')};
  margin-bottom: 30px;
`;

const ModalButton = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 44px;
  border-radius: 10px;
  ${typo('button2')}
  cursor: pointer;

  ${({ $variant }) =>
    $variant === 'ghost'
      ? css`
          color: ${color('grayscale.600')};
          background: #fff;
          border: 1px solid ${color('grayscale.300')};
        `
      : css`
          color: white;
          background: ${color('brand.primary')};
          border: none;
        `}
`;

/* 안내 모달 */
const GuideModal = styled.div`
  ${ModalBase}
`;

const GuideTitle = styled.div`
  ${typo('button3')}
  color: ${color('brand.primary')};
  opacity: 0.5;
`;

const GuideStep = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
`;

const GuideText = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
  white-space: pre-line;
`;

const GuideBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 4px 0px 24px 0px;
  background: #fff;
  border-radius: 12px;
`;

const GuideClose = styled.img`
  width: 16px;
  cursor: pointer;
`;
