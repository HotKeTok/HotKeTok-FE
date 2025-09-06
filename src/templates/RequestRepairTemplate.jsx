// src/pages/RequestRepair.jsx
import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useNavigate } from 'react-router-dom';

import TopBar from '../components/common/TopBar';
import ModeItem from '../components/common/ModeItem';
import Button from '../components/common/Button';
import { Row, Column, Spacer } from '../styles/flex';
import { color, typo } from '../styles/tokens';

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
function StepPayer({ draft, setDraft, onNext }) {
  return (
    <StepWrap>
      <SectionTitle>수리 비용은 누가 부담하나요?</SectionTitle>
      <Tip>✅ 헷갈린다면, 수리 요청 전 집주인과 먼저 상의해 주세요.</Tip>
      <Tip>명확한 합의를 통해 원활한 수리 진행이 가능합니다.</Tip>
      <Spacer h={16} />
      <Column $gap={12}>
        <ModeItem
          selected={draft.payer === 'me'}
          onClick={() => setDraft((p) => ({ ...p, payer: 'me' }))}
          height={'80px'}
        >
          <Row $gap={12}>
            <IconCircle>👤</IconCircle>
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
          height={'80px'}
        >
          <Row $gap={12}>
            <IconCircle>🏠</IconCircle>
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

      <Spacer h={24} />
      <Button text="다음" active={!!draft.payer} onClick={onNext} />
    </StepWrap>
  );
}

/* =========================================================
 * STEP 2: 작성 (AI 모드 ON/OFF)
 * ======================================================= */
function StepForm({ draft, setDraft, days, onNext }) {
  const [open, setOpen] = useState(false);

  const canComplete = useMemo(() => {
    const hasDateTime = !!draft.dateKey && !!draft.time;
    if (draft.useAI) return draft.images.length >= 1 && hasDateTime;
    const hasDesc = draft.desc && draft.desc.trim().length > 0 && draft.desc.length <= 300;
    return !!draft.typeKey && hasDesc && hasDateTime;
  }, [draft]);

  return (
    <StepWrap>
      <HeaderToggle>
        <Row $gap={12} style={{ alignItems: 'center' }}>
          <ToggleLabel>AI로 작성하기</ToggleLabel>
          <ToggleSwitch
            $on={draft.useAI}
            onClick={() => setDraft((p) => ({ ...p, useAI: !p.useAI }))}
          >
            <span />
          </ToggleSwitch>
        </Row>
        <ToggleHelp>사진을 업로드하면 AI가 수리분야와 증상 설명을 도와드려요.</ToggleHelp>
      </HeaderToggle>

      {/* 분야 선택 */}
      {!draft.useAI && (
        <Section>
          <SectionTitle>어떤 분야의 견적을 받고 싶으신가요?</SectionTitle>
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
        </Section>
      )}

      {/* 사진 업로드 */}
      <Section>
        <SectionTitle>증상 사진을 업로드 해주세요.</SectionTitle>
        <Helper>최대 8장까지 등록할 수 있어요.</Helper>
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
              <label htmlFor="repair-photos">＋</label>
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
      </Section>

      {/* 설명 */}
      <Section>
        <SectionTitle>증상 및 불편한 점을 알려주세요.</SectionTitle>
        <TextArea
          placeholder="증상에 대한 설명을 상세하게 적어주세요."
          value={draft.desc}
          onChange={(e) => setDraft((p) => ({ ...p, desc: e.target.value.slice(0, 300) }))}
        />
      </Section>

      {/* 날짜/시간 */}
      <Section>
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
        <Spacer h={8} />
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
      </Section>

      <Spacer h={12} />
      <Button text="완료하기" active={canComplete} onClick={onNext} />
    </StepWrap>
  );
}

/* =========================================================
 * STEP 3: 요약
 * ======================================================= */
function StepReview({ context, onEdit, onSubmit }) {
  return (
    <StepWrap>
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
      <Button text="제출하기" active={true} onClick={onSubmit} />
    </StepWrap>
  );
}

/* =========================================================
 * STEP 4: 완료
 * ======================================================= */
function StepDone({ onHome }) {
  return (
    <SuccessWrap>
      <Emoji>📝✅</Emoji>
      <SuccessTitle>수리 요청서를 제출했어요!</SuccessTitle>
      <SuccessSub>작성한 요청서를 바탕으로 견적서를 받으면 알림드릴게요.</SuccessSub>
      <Spacer h={12} />
      <Button text="홈으로 돌아가기" active={true} onClick={onHome} />
    </SuccessWrap>
  );
}

/* =========================================================
 * 메인
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

  const funnel = useFunnel({
    id: 'request-repair',
    initial: { step: 'Payer', context: {} },
    routes: (s) => `/request-repair/${s}`,
  });

  return (
    <>
      <TopBar
        title={funnel.step === 'Done' ? '' : '수리요청서 작성'}
        onBack={funnel.history.back}
      />
      <funnel.Render
        Payer={({ history }) => (
          <StepPayer
            draft={draft}
            setDraft={setDraft}
            onNext={() => history.push('Form', { ...draft })}
          />
        )}
        Form={({ history }) => (
          <StepForm
            draft={draft}
            setDraft={setDraft}
            days={days}
            onNext={() => history.push('Review', { ...draft })}
          />
        )}
        Review={({ history, context }) => (
          <StepReview
            context={context}
            onEdit={() => history.replace('Form', context)}
            onSubmit={() => history.push('Done')}
          />
        )}
        Done={() => <StepDone onHome={() => navigate('/')} />}
      />
    </>
  );
}

/* =========================================================
 * 스타일 (공통)
 * ======================================================= */
const StepWrap = styled.div`
  width: 390px;
  padding: 20px 16px 32px;
`;
const Section = styled.section`
  padding: 16px 0;
`;
const SectionTitle = styled.h3`
  ${typo('subtitle1')};
  color: ${color('grayscale.900')};
  margin: 0 0 8px;
`;
const Tip = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;
const Helper = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
  margin-bottom: 8px;
`;
const IconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${color('grayscale.100')};
  display: grid;
  place-items: center;
  font-size: 18px;
`;
const BoldText = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.900')};
  font-weight: 600;
`;
const SubBullets = styled.ul`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
  margin: 6px 0 0 0;
  padding-left: 18px;
  list-style: disc;
`;

const HeaderToggle = styled.div`
  border-radius: 12px;
  background: ${color('brand.primary/10')};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const ToggleLabel = styled.div`
  ${typo('subtitle2')};
  color: ${color('grayscale.900')};
`;
const ToggleHelp = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
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
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;
const Thumb = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
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

const UploadBox = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 12px;
  background: ${color('grayscale.100')};
  display: grid;
  place-items: center;
  label {
    ${typo('title2')};
    cursor: pointer;
  }
  input {
    display: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 108px;
  border: 1px solid ${color('grayscale.300')};
  border-radius: 12px;
  padding: 12px;
  ${typo('body2')};
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
  margin-top: 10px;
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
