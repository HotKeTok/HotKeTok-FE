import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';

import TopBar from '../../../components/common/TopBar';
import Button from '../../../components/common/Button';
import { Row, Column } from '../../../styles/flex';
import { PageWithoutBottomBar, BottomButtonContainer } from '../../../styles/layout';
import { getAccessToken } from '../../../utils/auth';
import { apiGenerateRepairText } from '../../../api/requestform-service';

import cameraIcon from '../../../assets/repair/request-repair/icon-camera.svg';
import iconUnchecked from '../../../assets/repair/request-repair/icon_unchecked.svg';
import iconChecked from '../../../assets/repair/request-repair/icon_checked.svg';

import { REPAIR_TYPES, TIME_OPTIONS } from './constants';

import {
  ScrollableNoBottomBarContent2,
  Section,
  SectionTitle,
  Caption1_600,
  Caption1_800,
  Caption2_800,
  HeaderToggle,
  ToggleSwitch,
  TypeGrid,
  TypeItem,
  TypeIcon,
  TypeLabel,
  ThumbGrid,
  Thumb,
  RemoveBtn,
  UploadBox,
  CameraIcon,
  UploadText,
  TextArea,
  CharCount,
  DateRow,
  DateDot,
  Dropdown,
  DropdownList,
  TimeItem,
} from './styles';
import { color, typo } from '../../../styles/tokens';

import ActionGuideModal from '../../../components/common/ActionGuideModal';
import AISearchTitle from '../../../components/repair/request-repair/AISearchTitle';

export default function StepForm({ draft, setDraft, days, onNext, onBack, onImageFilesSelected }) {
  const [open, setOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const accessToken = useMemo(() => getAccessToken(), []);

  // ✅ AI 작성 로직
  const handleGenerateAIText = useCallback(
    async images => {
      if (!images || images.length === 0) return;
      try {
        setLoadingAI(true);
        const res = await apiGenerateRepairText(accessToken, images);
        if (res.success && res.data?.text) {
          setDraft(p => ({ ...p, desc: res.data.text }));
        } else {
          alert(res.message || 'AI 분석에 실패했어요. 다시 시도해주세요.');
        }
      } catch (e) {
        console.error(e);
        alert('AI 분석 중 오류가 발생했어요.');
      } finally {
        setLoadingAI(false);
      }
    },
    [accessToken, setDraft]
  );

  const canComplete = useMemo(() => {
    const hasDateTime = !!draft.dateKey && !!draft.time;
    if (draft.useAI) {
      const hasType = !!draft.typeKey;
      return draft.images.length >= 1 && hasType && hasDateTime;
    }
    const hasDesc = draft.desc && draft.desc.trim().length > 0 && draft.desc.length <= 300;
    return !!draft.typeKey && hasDesc && hasDateTime;
  }, [draft]);

  const TypePickerSection = ({ note }) => (
    <Column $gap={6}>
      {note ? <Caption1_600 style={{ marginBottom: 8 }}>{note}</Caption1_600> : null}
      <TypeGrid>
        {REPAIR_TYPES.map(t => {
          const selected = draft.typeKey === t.key;
          return (
            <TypeItem
              key={t.key}
              onClick={() => setDraft(p => ({ ...p, typeKey: t.key }))}
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

  const ImgUploadSection = () => (
    <Column $gap={6}>
      <Caption2_800>증상 사진</Caption2_800>
      <ThumbGrid>
        {draft.images.map((url, idx) => (
          <Thumb key={url} style={{ backgroundImage: `url(${url})` }}>
            <RemoveBtn
              onClick={() =>
                setDraft(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))
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
              onChange={async e => {
                const arr = Array.from(e.target.files);
                const remain = Math.max(0, 8 - draft.images.length);
                const next = arr.slice(0, remain).map(f => URL.createObjectURL(f));
                if (arr.length > remain) alert('사진은 최대 8장까지 첨부할 수 있어요.');
                setDraft(p => ({ ...p, images: [...p.images, ...next] }));

                if (typeof onImageFilesSelected === 'function') {
                  const files = arr.slice(0, remain);
                  onImageFilesSelected(files);
                  // ✅ AI 자동작성
                  if (draft.useAI) await handleGenerateAIText(files);
                }
              }}
            />
          </UploadBox>
        )}
      </ThumbGrid>
    </Column>
  );

  return (
    <PageWithoutBottomBar>
      <TopBar title="수리요청서 작성" onBack={onBack} />
      <ScrollableNoBottomBarContent2>
        <HeaderToggle>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Column>
              <SectionTitle>AI로 작성하기</SectionTitle>
              <Caption1_800>사진 한 장으로 간편하게 요청서를 완성해보세요.</Caption1_800>
            </Column>
            <ToggleSwitch
              $on={draft.useAI}
              onClick={() => setDraft(p => ({ ...p, useAI: !p.useAI }))}
            >
              <span />
            </ToggleSwitch>
          </Row>
        </HeaderToggle>

        <Section>
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

            <Column $gap={6}>
              <Caption2_800>증상 설명</Caption2_800>
              <TextArea
                placeholder="증상에 대한 설명을 상세하게 적어주세요."
                value={draft.desc}
                onChange={e => setDraft(p => ({ ...p, desc: e.target.value.slice(0, 300) }))}
              />
              <CharCount $over={draft.desc.length >= 300}>{draft.desc.length} / 300</CharCount>
            </Column>
          </Column>

          <div style={{ height: '40px' }} />

          <Column $gap={2}>
            <SectionTitle>원하는 날짜와 시간을 선택해주세요.</SectionTitle>
            <Caption1_600>오늘부터 7일까지의 가능한 날짜를 선택해주세요.</Caption1_600>
          </Column>
          <Caption2_800 style={{ margin: '10px 0px' }}>수리 희망 날짜</Caption2_800>
          <DateRow>
            {days.map(d => (
              <DateDot
                key={d.key}
                $active={draft.dateKey === d.key}
                onClick={() => setDraft(p => ({ ...p, dateKey: d.key }))}
                aria-pressed={draft.dateKey === d.key}
              >
                {d.justDate}
              </DateDot>
            ))}
          </DateRow>

          <Column $gap={6}>
            <Caption2_800 style={{ marginTop: '10px' }}>수리 희망 시간</Caption2_800>
            <Dropdown $open={open} onClick={() => setOpen(v => !v)}>
              <span>{draft.time || '시간 선택'}</span>
              <i>▾</i>
            </Dropdown>
            {open && (
              <DropdownList>
                {TIME_OPTIONS.map(t => (
                  <TimeItem
                    key={t}
                    $selected={draft.time === t}
                    onClick={() => {
                      setDraft(p => ({ ...p, time: t }));
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
      </ScrollableNoBottomBarContent2>

      <BottomButtonContainer>
        <Button text="완료하기" active={canComplete} onClick={onNext} />
      </BottomButtonContainer>

      {loadingAI && (
        <ActionGuideModal
          isOpen
          titleComponent={<AISearchTitle />}
          description={''} // 본문 설명은 비워두기 (사진처럼 타이틀만)
          onClose={() => {}} // 닫히지 않게 no-op
          onConfirm={() => {}} // 버튼 숨길 거면 의미 없음
          confirmText={''} // 3번 수정 반영 시 버튼 숨김
          showClose={false} // X 버튼 숨김
          width="70%"
        />
      )}
    </PageWithoutBottomBar>
  );
}

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${color('grayscale.300')};
  border-top: 4px solid ${color('brand.primary')};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  margin-top: 16px;
  ${typo('button1')};
  color: ${color('grayscale.600')};
`;
