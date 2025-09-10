import React, { useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
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
import iconUnchecked from '../../../assets/repair/request-repair/icon_unchecked.svg';
import iconChecked from '../../../assets/repair/request-repair/icon_checked.svg';
import iconSubmit from '../../../assets/repair/request-repair/icon_request-submit.png';

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
    <Column $gap={6}>
      {note ? <Caption1_600 style={{ marginBottom: 8 }}>{note}</Caption1_600> : null}

      <TypeGrid>
        {REPAIR_TYPES.map((t) => {
          const selected = draft.typeKey === t.key;
          return (
            <TypeItem
              key={t.key}
              onClick={() => setDraft((p) => ({ ...p, typeKey: t.key }))}
              $selected={selected}
            >
              <TypeIcon src={selected ? iconChecked : iconUnchecked} alt="" />
              <TypeLabel $selected={selected}>{t.label}</TypeLabel>
            </TypeItem>
          );
        })}
      </TypeGrid>
    </Column>
  );
  // 사진 업로드 구역
  const ImgUploadSection = () => (
    <Column $gap={6}>
      <Caption2_800>증상 사진</Caption2_800>
      <ThumbGrid>
        {draft.images.map((url) => (
          <Thumb key={url} style={{ backgroundImage: `url(${url})` }}>
            <RemoveBtn
              onClick={() => setDraft((p) => ({ ...p, images: p.images.filter((u) => u !== url) }))}
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
  );

  return (
    <StepWrap>
      <TopBar title="수리요청서 작성" onBack={onBack} />

      <HeaderToggle>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Column>
            <SectionTitle>AI로 작성하기</SectionTitle>
            <Caption1_800>사진 한 장으로 간편하게 요청서를 완성해보세요.</Caption1_800>
          </Column>

          <ToggleSwitch
            $on={draft.useAI}
            onClick={() => setDraft((p) => ({ ...p, useAI: !p.useAI }))}
          >
            <span />
          </ToggleSwitch>
        </Row>
      </HeaderToggle>

      <Section>
        {/* ❗️AI OFF일 때는 수리분야를 사진 섹션 '위'에서 노출 */}
        {!draft.useAI && (
          <div>
            <SectionTitle style={{ marginBottom: '20px' }}>
              어떤 분야의 견적을 받고 싶으신가요?
            </SectionTitle>
            <TypePickerSection />
            <SectionTitle style={{ marginTop: '40px' }}>
              증상 및 불편한 점을 알려주세요.
            </SectionTitle>
            <Caption1_600 style={{ marginBottom: '12px' }}>
              상세하게 적으면 더 정확한 견적을 받아볼 수 있어요!
            </Caption1_600>
            <ImgUploadSection />
            <div style={{ height: '12px' }} />
          </div>
        )}
        <Column $gap={20}>
          {/* ✅ AI ON일 때는 수리분야를 사진 섹션 '아래'에서 노출 (선택 가능, 선택 시 요약에 반영) */}
          {draft.useAI && (
            <div>
              <Column $gap={2}>
                <SectionTitle>증상 사진을 업로드 해주세요.</SectionTitle>
                <Caption1_600 style={{ marginBottom: '12px' }}>
                  AI가 증상을 분석하고 요청서를 완성해드릴게요.
                </Caption1_600>
              </Column>
              <Column $gap={20}>
                <ImgUploadSection />
                <Column $gap={6}>
                  <Caption2_800>수리 분야</Caption2_800>
                  <TypePickerSection />
                </Column>
              </Column>
            </div>
          )}

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
        </Column>

        <div style={{ height: '40px' }} />

        {/* 날짜/시간 */}
        <Column $gap={2}>
          <SectionTitle>원하는 날짜와 시간을 선택해주세요.</SectionTitle>
          <Caption1_600>오늘부터 7일까지의 가능한 날짜를 선택해주세요.</Caption1_600>
        </Column>
        <Caption2_800 style={{ margin: '10px 0px' }}>수리 희망 날짜</Caption2_800>
        <DateRow>
          {days.map((d) => (
            <DateDot
              key={d.key}
              $active={draft.dateKey === d.key}
              onClick={() => setDraft((p) => ({ ...p, dateKey: d.key }))}
              aria-pressed={draft.dateKey === d.key}
            >
              {d.justDate}
            </DateDot>
          ))}
        </DateRow>

        <Column $gap={6}>
          <Caption2_800 style={{ marginTop: '10px' }}>수리 희망 시간</Caption2_800>
          <Dropdown $open={open} onClick={() => setOpen((v) => !v)}>
            <span>{draft.time || '시간 선택'}</span>
            <i>▾</i>
          </Dropdown>

          {open && (
            <DropdownList>
              {TIME_OPTIONS.map((t) => (
                <TimeItem
                  key={t}
                  $selected={draft.time === t}
                  onClick={() => {
                    setDraft((p) => ({ ...p, time: t }));
                    setOpen(false);
                  }}
                >
                  {t}
                </TimeItem>
              ))}
            </DropdownList>
          )}
        </Column>
      </Section>
      <Spacer />
      <div style={{ padding: '40px 24px' }}>
        <Button text="완료하기" active={canComplete} onClick={onNext} />
      </div>
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
      <SummarySection>
        <Row $justify="space-between" style={{ marginBottom: '30px' }}>
          <Column>
            <SectionTitle>수리요청서 작성을 완료했어요!</SectionTitle>
            <Caption1_600>작성한 요청서를 바탕으로 견적서를 받아볼 수 있어요.</Caption1_600>
          </Column>
          <EditLink onClick={onEdit}>수정하기</EditLink>
        </Row>

        <Column $gap={24}>
          <Row $justify="space-between">
            <ItemLabel>수리 분야</ItemLabel>
            <ItemValue>
              {context.typeKey
                ? REPAIR_TYPES.find((t) => t.key === context.typeKey)?.label
                : context.useAI
                ? 'AI로 분석 예정'
                : '미선택'}
            </ItemValue>
          </Row>

          <Row $justify="space-between">
            <ItemLabel>수리 희망 날짜</ItemLabel>
            <ItemValue>
              {context.dateKey && context.time
                ? (() => {
                    const d = new Date(context.dateKey);
                    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} / ${
                      context.time
                    }`;
                  })()
                : '-'}
            </ItemValue>
          </Row>

          <Row $justify="space-between">
            <ItemLabel>비용 부담</ItemLabel>
            <ItemValue>
              {context.payer === 'me'
                ? '본인 부담'
                : context.payer === 'landlord'
                ? '집주인 부담'
                : '-'}
            </ItemValue>
          </Row>

          <Row $justify="space-between">
            <ItemLabel>주소</ItemLabel>
            <ItemValue>동작 핫케톡 스테이 304호</ItemValue>
          </Row>

          {!!context.images.length && (
            <Column $gap={6}>
              <ItemLabel style={{ marginTop: 12 }}>증상 사진</ItemLabel>
              <ThumbRow>
                {context.images.map((url, idx) => (
                  <Thumb key={url + idx} style={{ backgroundImage: `url(${url})` }} />
                ))}
              </ThumbRow>
            </Column>
          )}
          <Column $gap={8}>
            <ItemLabel>증상 설명</ItemLabel>
            <DescBox>
              {context.desc
                ? context.desc
                : context.useAI
                ? 'AI가 작성한 설명이 여기에 표시됩니다.'
                : '작성된 설명이 없습니다.'}
            </DescBox>
          </Column>
        </Column>
      </SummarySection>
      <Spacer />
      <div style={{ padding: '40px 24px' }}>
        <Button text="제출하기" active onClick={onSubmit} />
      </div>
    </StepWrap>
  );
}

/* =========================================================
 * STEP 4: 완료
 * ======================================================= */
function StepDone({ onHome }) {
  return (
    <StepWrap>
      <Spacer />
      <Column $center={true} $gap={20}>
        <SubmitIcon src={iconSubmit} />
        <SuccessTitle>수리 요청서를 제출했어요!</SuccessTitle>
        <SuccessSub>
          작성한 요청서를 바탕으로
          <br />
          견적서를 받으면 알림을 보내드릴게요.
        </SuccessSub>
      </Column>
      <Spacer />
      <div style={{ padding: '40px 24px' }}>
        <FadeInWrap>
          <Button text="홈으로 돌아가기" active onClick={onHome} />
        </FadeInWrap>
      </div>
    </StepWrap>
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
    dateKey: days[0]?.key || null, // ✅ 오늘 날짜를 기본값으로 설정
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
  padding: 24px 24px;
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
  background: linear-gradient(90deg, #92ffcc 0%, #5cff9a 50.06%, #3dc279 100%);
  padding: 13px 24px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ToggleSwitch = styled.div`
  width: 52px;
  height: 28px;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  background: ${(p) => (p.$on ? color('grayscale.700') : color('grayscale.300'))};
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

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  row-gap: 8px;
  column-gap: 16px;
`;

const TypeItem = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  /* 터치 타겟 확보 */
  min-height: 32px;

  &:focus-visible {
    outline: 2px solid ${color('brand.primary')};
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

const TypeIcon = styled.img`
  width: 22px;
  height: 22px;
  flex: 0 0 28px;
`;

const TypeLabel = styled.span`
  ${typo('subtitle2')};
  color: ${({ $selected }) => ($selected ? color('grayscale.900') : color('grayscale.700'))};
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
  border-radius: 6px;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
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
  ${typo('body1')};
  height: 44px;
  border-radius: 50%;
  border: 0px;
  ${(p) =>
    p.$active &&
    css`
      color: white;
      background-color: black;
    `}
`;

const Dropdown = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  height: 44px;
  border-radius: 6px;
  border: 1px solid ${color('grayscale.400')};
  padding: 0px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${color('grayscale.100')};
  cursor: pointer;
`;
const DropdownList = styled.ul`
  margin-top: 6px;
  border: 1px solid ${color('grayscale.400')};
  background: ${color('grayscale.100')};
  border-radius: 10px;
  padding: 6px 15px;
  max-height: 240px;
  overflow: auto;
  li {
    padding: 10px 12px;
    cursor: pointer;
  }
  li:hover {
    background: ${color('grayscale.200')};
  }
`;

// 시간 아이템(선택/호버 스타일)
const TimeItem = styled.li`
  padding: 14px 16px;
  ${typo('body2')};
  color: ${color('grayscale.800')};
  cursor: pointer;
  border-radius: 8px; /* 스크롤 중 모서리 깔끔하게 */

  &:hover {
    background: ${color('grayscale.050')};
  }
  ${(p) =>
    p.$selected &&
    css`
      background: ${color('grayscale.100')};
      font-weight: 700;
    `}
`;

// STEP 3 관련 스타일

const EditLink = styled.div`
  ${typo('button2')};
  color: #3c66ff;
  cursor: pointer;
`;
const SummarySection = styled.div`
  padding: 30px 24px;
`;

const ItemLabel = styled.div`
  ${typo('button2')};
  color: ${color('grayscale.800')};
`;
const ItemValue = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;
const DescBox = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  background: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 6px;
  padding: 13px 15px;
`;

const ThumbRow = styled.div`
  display: flex;
  justify-content: flex-end; /* ✅ 오른쪽 정렬 */
  gap: 6px;
  flex-wrap: wrap; /* 폭이 모자라면 다음 줄로 */
`;

// STEP 4

const popBounce = keyframes`
  0%   { transform: scale(0.6) rotate(-6deg); opacity: 0; }
  60%  { transform: scale(1.08) rotate(2deg);  opacity: 1; }
  80%  { transform: scale(0.98) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const fadeUp = keyframes`
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
`;

const SubmitIcon = styled.img`
  width: 90px;
  animation: ${popBounce} 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both; /* mount 시 1회 재생 */
  will-change: transform, opacity;
`;

const SuccessTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
  animation: ${popBounce} 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both; /* mount 시 1회 재생 */
  will-change: transform, opacity;
  animation: ${fadeUp} 360ms ease 80ms both;
`;
const SuccessSub = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  text-align: center;
  animation: ${fadeUp} 360ms ease 120ms both;
`;

const FadeInWrap = styled.div`
  animation: ${fadeUp} 700ms ease both; /* 나타나는 속도 */
  animation-delay: 800ms; /* 아이콘/텍스트 뜬 후 '조금 있다가' */
`;
