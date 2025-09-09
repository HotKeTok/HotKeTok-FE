// src/pages/RequestRepair.jsx
import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useNavigate } from 'react-router-dom';

import TopBar from '../../../components/common/TopBar';
import ModeItem from '../../../components/common/ModeItem';
import Button from '../../../components/common/Button';
import { Row, Column, Spacer } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';

import meIcon from '../../../assets/repair/request-repair/icon-me.svg';
import landlordIcon from '../../../assets/repair/request-repair/icon-landlord.svg';
import cameraIcon from '../../../assets/repair/request-repair/icon-camera.svg';

/* =========================================================
 * 공통 상수/유틸
 * ======================================================= */
const REPAIR_TYPES = [
  { key: 'appliance', label: '가전' },
  { key: 'door_window', label: '문/창문' },
  { key: 'water_boiler', label: '수도/보일러' },
  { key: 'electric', label: '전기/조명' },
  { key: 'etc', label: '기타' },
];

const TIME_OPTIONS = [
  '오전 10:00',
  '오전 11:00',
  '오후 12:00',
  '오후 1:00',
  '오후 2:00',
  '오후 3:00',
  '오후 4:00',
  '오후 5:00',
  '오후 6:00',
];

function getNext7Days() {
  const out = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    out.push({
      key: d.toISOString().slice(0, 10),
      dateObj: d,
      label: `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')} (${w})`,
      justDate: d.getDate(),
    });
  }
  return out;
}

/* =========================================================
 * STEP 1: 비용부담자 선택
 * ======================================================= */
function StepPayer({ draft, setDraft, onNext, onBack }) {
  return (
    <StepWrap>
      <TopBar title="수리요청서 작성" onBack={onBack} style={{ marginBottom: '10px' }} />
      <div style={{ height: '20px' }} />
      <Column $gap={8} style={{ marginBottom: '24px', padding: '0px 24px' }}>
        <SectionTitle>수리 비용은 누가 부담하나요?</SectionTitle>
        <Tip>세부 기준은 선택 후 확인할 수 있어요</Tip>
        <Tip>
          헷갈린다면, 수리 요청 전 집주인과 먼저 상의해 주세요.
          <br />
          명확한 합의를 통해 원활한 수리 진행이 가능합니다.
        </Tip>
      </Column>

      <Column $gap={10} style={{ padding: '0px 20px' }}>
        <ModeItem
          selected={draft.payer === 'me'}
          onClick={() => setDraft((p) => ({ ...p, payer: 'me' }))}
          height="100%"
          padding="18px 24px"
        >
          <Row $gap={12}>
            <IconWrapper src={meIcon} alt="본인부담아이콘" />
            <Column>
              <BoldText>제가 부담할게요.</BoldText>
              {draft.payer === 'me' && (
                <SubBullets>
                  <li>본인 부주의로 인한 파손 (예: 창문 깨짐, 문 고장)</li>
                  <li>입주 후 설치한 개인 가전·가구 관련 수리</li>
                </SubBullets>
              )}
            </Column>
          </Row>
        </ModeItem>

        <ModeItem
          selected={draft.payer === 'landlord'}
          onClick={() => setDraft((p) => ({ ...p, payer: 'landlord' }))}
          height="100%"
          padding="18px 24px"
        >
          <Row $gap={12}>
            <IconWrapper src={landlordIcon} alt="집주인부담아이콘" />
            <Column>
              <BoldText>집주인이 부담할 예정이에요.</BoldText>
              {draft.payer === 'landlord' && (
                <SubBullets>
                  <li>수도, 전기, 보일러, 배관 등 건물의 기본 설비 문제</li>
                  <li>자연 마모나 노후화로 인한 고장</li>
                </SubBullets>
              )}
            </Column>
          </Row>
        </ModeItem>
      </Column>

      <Spacer />
      <div style={{ padding: '40px 24px' }}>
        <Button text="다음" active={!!draft.payer} onClick={onNext} />
      </div>
    </StepWrap>
  );
}

/* =========================================================
 * STEP 2: 작성 (AI 모드 ON/OFF)
 * ======================================================= */
function StepForm({ draft, setDraft, days, onNext, onBack }) {
  const [open, setOpen] = useState(false);

  const canComplete = useMemo(() => {
    const hasDateTime = !!draft.dateKey && !!draft.time;
    if (draft.useAI) return draft.images.length >= 1 && hasDateTime;
    const hasDesc = draft.desc && draft.desc.trim().length > 0 && draft.desc.length <= 300;
    return !!draft.typeKey && hasDesc && hasDateTime;
  }, [draft]);

  // 수리 분야 선택 섹션을 재사용 가능하게 분리
  const TypePickerSection = ({ note }) => (
    <>
      <Caption2_800>수리 분야</Caption2_800>
      {note ? <Caption1_600 style={{ marginBottom: 8 }}>{note}</Caption1_600> : null}
      <ChipRow>
        {REPAIR_TYPES.map((t) => (
          <Chip
            key={t.key}
            $active={draft.typeKey === t.key}
            onClick={() => setDraft((p) => ({ ...p, typeKey: t.key }))}
          >
            {t.label}
          </Chip>
        ))}
      </ChipRow>
    </>
  );

  return (
    <StepWrap>
      <TopBar title="수리요청서 작성" onBack={onBack} />

      <HeaderToggle>
        <Row $gap={12} style={{ alignItems: 'center' }}>
          <SectionTitle>AI로 작성하기</SectionTitle>
          <ToggleSwitch
            $on={draft.useAI}
            onClick={() => setDraft((p) => ({ ...p, useAI: !p.useAI }))}
          >
            <span />
          </ToggleSwitch>
        </Row>
        <Caption1_800>사진을 업로드하면 AI가 수리분야와 증상 설명을 도와드려요.</Caption1_800>
      </HeaderToggle>

      {/* ❗️AI OFF일 때는 수리분야를 사진 섹션 '위'에서 노출 */}
      {!draft.useAI && <TypePickerSection />}

      {/* 사진 업로드 */}
      <Section>
        <SectionTitle>증상 사진을 업로드 해주세요.</SectionTitle>
        <Caption1_600 style={{ marginBottom: '12px' }}>
          AI가 증상을 분석하고 요청서를 완성해드릴게요.
        </Caption1_600>
        <Column $gap={6}>
          <Caption2_800>증상 사진</Caption2_800>
          <ThumbGrid>
            {draft.images.map((url) => (
              <Thumb key={url} style={{ backgroundImage: `url(${url})` }}>
                <RemoveBtn
                  onClick={() =>
                    setDraft((p) => ({ ...p, images: p.images.filter((u) => u !== url) }))
                  }
                >
                  ×
                </RemoveBtn>
              </Thumb>
            ))}
            {draft.images.length < 8 && (
              <UploadBox>
                <label htmlFor="repair-photos" className="uploader">
                  <CameraIcon src={cameraIcon} alt="카메라 아이콘" />
                  <UploadText>사진 {draft.images.length}/8</UploadText>
                </label>
                <input
                  id="repair-photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const arr = Array.from(e.target.files);
                    const remain = Math.max(0, 8 - draft.images.length);
                    const next = arr.slice(0, remain).map((f) => URL.createObjectURL(f));
                    if (arr.length > remain) alert('사진은 최대 8장까지 첨부할 수 있어요.');
                    setDraft((p) => ({ ...p, images: [...p.images, ...next] }));
                  }}
                />
              </UploadBox>
            )}
          </ThumbGrid>
        </Column>

        {/* ✅ AI ON일 때는 수리분야를 사진 섹션 '아래'에서 노출 (선택 가능, 선택 시 요약에 반영) */}
        {draft.useAI && <TypePickerSection />}

        {/* 설명 */}
        <Column $gap={6}>
          <Caption2_800>증상 설명</Caption2_800>
          <TextArea
            placeholder="증상에 대한 설명을 상세하게 적어주세요."
            value={draft.desc}
            onChange={(e) => setDraft((p) => ({ ...p, desc: e.target.value.slice(0, 300) }))}
          />
          <CharCount $over={draft.desc.length >= 300}>{draft.desc.length} / 300</CharCount>
        </Column>
        {/* 날짜/시간 */}

        <SectionTitle>원하는 날짜와 시간을 선택해주세요.</SectionTitle>
        <DateRow>
          {days.map((d) => (
            <DateDot
              key={d.key}
              $active={draft.dateKey === d.key}
              onClick={() => setDraft((p) => ({ ...p, dateKey: d.key }))}
            >
              {d.justDate}
            </DateDot>
          ))}
        </DateRow>
        <Column $gap={6}>
          <Caption2_800>수리 희망 시간</Caption2_800>
          <Dropdown onClick={() => setOpen((v) => !v)}>
            <span>{draft.time || '시간 선택'}</span>
            <i>▾</i>
          </Dropdown>
          {open && (
            <DropdownList>
              {TIME_OPTIONS.map((t) => (
                <li
                  key={t}
                  onClick={() => {
                    setDraft((p) => ({ ...p, time: t }));
                    setOpen(false);
                  }}
                >
                  {t}
                </li>
              ))}
            </DropdownList>
          )}
        </Column>

        <Spacer h={12} />
        <Button text="완료하기" active={canComplete} onClick={onNext} />
      </Section>
    </StepWrap>
  );
}

/* =========================================================
 * STEP 3: 요약
 * ======================================================= */
function StepReview({ context, onEdit, onSubmit, onBack }) {
  return (
    <StepWrap>
      <TopBar title="수리요청서 작성" onBack={onBack} />

      <TitleRow>
        <SummaryTitle>수리요청서 작성을 완료했어요!</SummaryTitle>
        <EditLink onClick={onEdit}>수정하기</EditLink>
      </TitleRow>

      <SummaryCard>
        <SummaryItem>
          <ItemLabel>수리 분야</ItemLabel>
          <ItemValue>
            {context.typeKey
              ? REPAIR_TYPES.find((t) => t.key === context.typeKey)?.label
              : context.useAI
              ? 'AI로 분석 예정'
              : '미선택'}
          </ItemValue>
        </SummaryItem>

        <SummaryItem>
          <ItemLabel>수리 희망 날짜</ItemLabel>
          <ItemValue>
            {context.dateKey && context.time
              ? (() => {
                  const d = new Date(context.dateKey);
                  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} / ${context.time}`;
                })()
              : '-'}
          </ItemValue>
        </SummaryItem>

        <SummaryItem>
          <ItemLabel>주소</ItemLabel>
          <ItemValue>동작 핫케톡 스테이 304호</ItemValue>
        </SummaryItem>

        {!!context.images.length && (
          <>
            <ItemLabel style={{ marginTop: 12 }}>증상 사진</ItemLabel>
            <ThumbGrid>
              {context.images.map((url, idx) => (
                <Thumb key={url + idx} style={{ backgroundImage: `url(${url})` }} />
              ))}
            </ThumbGrid>
          </>
        )}

        <ItemLabel style={{ marginTop: 12 }}>증상 설명</ItemLabel>
        <DescBox>
          {context.desc
            ? context.desc
            : context.useAI
            ? 'AI가 작성한 설명이 여기에 표시됩니다.'
            : '작성된 설명이 없습니다.'}
        </DescBox>
      </SummaryCard>

      <Spacer h={12} />
      <Button text="제출하기" active onClick={onSubmit} />
    </StepWrap>
  );
}

/* =========================================================
 * STEP 4: 완료
 * ======================================================= */
function StepDone({ onHome, onBack }) {
  return (
    <SuccessWrap>
      <TopBar title="" onBack={onBack} />
      <Emoji>📝✅</Emoji>
      <SuccessTitle>수리 요청서를 제출했어요!</SuccessTitle>
      <SuccessSub>작성한 요청서를 바탕으로 견적서를 받으면 알림드릴게요.</SuccessSub>
      <Spacer h={12} />
      <Button text="홈으로 돌아가기" active onClick={onHome} />
    </SuccessWrap>
  );
}

/* =========================================================
 * 메인(컨테이너)
 * ======================================================= */
export default function RequestRepairTemplate() {
  const navigate = useNavigate();
  const days = useMemo(() => getNext7Days(), []);
  const [draft, setDraft] = useState({
    payer: null,
    useAI: true,
    typeKey: null,
    dateKey: null,
    time: null,
    images: [],
    desc: '',
  });

  const Funnel = useFunnel({
    id: 'request-repair',
    initial: { step: 'Payer', context: {} },
    routes: (s) => `/request-repair/${s}`,
  });

  return (
    <Funnel.Render
      Payer={({ history }) => (
        <StepPayer
          draft={draft}
          setDraft={setDraft}
          onBack={history.back}
          onNext={() => history.push('Form', { ...draft })}
        />
      )}
      Form={({ history }) => (
        <StepForm
          draft={draft}
          setDraft={setDraft}
          days={days}
          onBack={history.back}
          onNext={() => history.push('Review', { ...draft })}
        />
      )}
      Review={({ history, context }) => (
        <StepReview
          context={context}
          onBack={history.back}
          onEdit={() => history.replace('Form', context)}
          onSubmit={() => history.push('Done')}
        />
      )}
      Done={({ history }) => <StepDone onHome={() => navigate('/')} onBack={history.back} />}
    />
  );
}

/* =========================================================
 * 스타일 (공통)
 * ======================================================= */

// STEP 1
const StepWrap = styled.div`
  display: flex;
  width: 390px;
  flex-direction: column;
  min-height: 100vh;
`;
const Section = styled.section`
  padding: 16px 24px;
`;
const SectionTitle = styled.h3`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;
const Tip = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

const IconWrapper = styled.img`
  width: 18px;
  height: 18px;
  place-items: center;
`;
const BoldText = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;
const SubBullets = styled.ul`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
  margin: 10px 0 0 0;
  list-style: disc;
`;

// STEP 2

const HeaderToggle = styled.div`
  background: ${color('grayscale.200')};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Helper = styled.div`
  ${typo('subtitle2')};
  color: ${color('grayscale.900')};
`;

const Caption1_600 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;

const Caption1_800 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
`;

const Caption2_800 = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.800')};
`;

const ToggleSwitch = styled.div`
  width: 52px;
  height: 28px;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  background: ${(p) => (p.$on ? color('brand.primary') : color('grayscale.300'))};
  span {
    position: absolute;
    top: 3px;
    left: ${(p) => (p.$on ? '26px' : '3px')};
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    transition: left 0.2s ease;
  }
`;

const ChipRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;
const Chip = styled.button`
  ${typo('body2')};
  height: 40px;
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  color: ${color('grayscale.800')};
  cursor: pointer;
  ${(p) =>
    p.$active &&
    css`
      border-color: ${color('brand.primary')};
      box-shadow: 0 0 0 3px ${color('brand.primary/10')};
    `}
`;

const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;
const Thumb = styled.div`
  position: relative;
  height: 80px;
  width: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 6x;
  overflow: hidden;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
`;

const UploadBox = styled.label`
  position: relative;
  height: 80px;
  width: 80px;
  border-radius: 6px;
  border: 1px solid ${color('grayscale.400')};
  background: #fff;
  cursor: pointer;
  display: block;

  input {
    display: none;
  }
`;

const CameraIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 👈 박스 정중앙 */
  width: 22px;
  height: 20px;
  opacity: 0.6;
  cursor: pointer;
`;

const UploadText = styled.div`
  position: absolute;
  bottom: 6px; /* 👈 박스 하단 */
  left: 50%;
  transform: translateX(-50%);
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  cursor: pointer;
`;

const TextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  padding: 13px 15px;
  justify-content: center;
  align-items: center;

  ${typo('body2')};
  color: ${color('grayscale.800')};

  border-radius: 6px;
  border: 1px solid #efefef;
  background: #fafafb;

  resize: none;
  outline: none;
`;

const CharCount = styled.div`
  display: flex;
  justify-content: flex-end;
  ${typo('caption2')};
  color: ${color('grayscale.400')};
`;

const DateRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;
const DateDot = styled.button`
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  ${(p) =>
    p.$active &&
    css`
      border-color: ${color('brand.primary')};
      color: ${color('brand.primary')};
      font-weight: 700;
    `}
`;

const Dropdown = styled.div`
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  cursor: pointer;
`;
const DropdownList = styled.ul`
  margin-top: 6px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  border-radius: 10px;
  padding: 6px 0;
  max-height: 240px;
  overflow: auto;
  li {
    padding: 10px 12px;
    cursor: pointer;
  }
  li:hover {
    background: ${color('grayscale.050')};
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;
const SummaryTitle = styled.h2`
  ${typo('title2')};
  color: ${color('grayscale.900')};
`;
const EditLink = styled.button`
  ${typo('body2')};
  color: ${color('brand.secondary') || '#2A7BF4'};
  border: none;
  background: transparent;
  text-decoration: underline;
  cursor: pointer;
`;
const SummaryCard = styled.div`
  border: 1px solid ${color('grayscale.200')};
  background: #fff;
  border-radius: 12px;
  padding: 12px;
`;
const SummaryItem = styled.div`
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 8px;
  & + & {
    margin-top: 8px;
  }
`;
const ItemLabel = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;
const ItemValue = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.900')};
`;
const DescBox = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  background: ${color('grayscale.050')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 10px;
  padding: 10px;
`;

const SuccessWrap = styled.div`
  width: 390px;
  padding: 40px 16px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const Emoji = styled.div`
  font-size: 48px;
  margin: 12px 0 8px;
`;
const SuccessTitle = styled.div`
  ${typo('title2')};
  color: ${color('grayscale.900')};
`;
const SuccessSub = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;
