// src/templates/landlord/repair/L_WriteReviewTemplate.jsx
import React, { useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSearchParams } from 'react-router-dom';

import TopBar from '../../../components/common/TopBar';
import Button from '../../../components/common/Button';
import { Column } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';

import iconChecked from '../../../assets/repair/request-repair/icon_checked.svg';
import iconUnchecked from '../../../assets/repair/request-repair/icon_unchecked.svg';
import cameraIcon from '../../../assets/repair/request-repair/icon-camera.svg';
import starYellow from '../../../assets/repair/contractor-profile/icon-star-yellow.svg';
import starGray from '../../../assets/repair/contractor-profile/icon-star-gray.svg';

const MAX_TEXT = 300;
const MAX_PHOTOS = 8;

const REPAIR_TYPES = [
  { key: 'appliance', label: '가전' },
  { key: 'door_window', label: '문/창문' },
  { key: 'water_boiler', label: '수도/보일러' },
  { key: 'electric', label: '전기/조명' },
  { key: 'etc', label: '기타' },
];

export default function L_WriteReviewTemplate({ contractorName: propName }) {
  const [sp] = useSearchParams();
  const contractorName = useMemo(() => propName || sp.get('name') || '업체', [propName, sp]);

  const [rating, setRating] = useState(0);
  const [types, setTypes] = useState(new Set());
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const fileRef = useRef(null);

  const canSubmit = useMemo(() => {
    const hasType = types.size > 0;
    const hasContent = photos.length > 0 || text.trim().length > 0;
    return rating > 0 && hasType && hasContent;
  }, [rating, types, photos, text]);

  const toggleType = key =>
    setTypes(prev => {
      if (prev.has(key)) return new Set();
      return new Set([key]);
    });

  const handlePick = () => fileRef.current?.click();

  const handleFiles = e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remain = MAX_PHOTOS - photos.length;
    const selected = files.slice(0, remain);
    if (files.length > remain) alert(`사진은 최대 ${MAX_PHOTOS}장까지 첨부할 수 있어요.`);

    const readers = selected.map(
      file =>
        new Promise((res, rej) => {
          const fr = new FileReader();
          fr.onload = () => res({ url: fr.result, file });
          fr.onerror = rej;
          fr.readAsDataURL(file);
        })
    );
    Promise.all(readers).then(items => setPhotos(p => [...p, ...items]));
    e.target.value = '';
  };

  const removePhoto = idx => setPhotos(p => p.filter((_, i) => i !== idx));

  const onSubmit = () => {
    const payload = {
      role: 'LANDLORD', // ✅ 집주인 후기
      contractorName,
      rating,
      types: Array.from(types),
      text: text.trim(),
      photosCount: photos.length,
    };
    alert(`리뷰 제출\n${JSON.stringify(payload, null, 2)}`);
  };

  return (
    <Screen>
      <TopBar title={contractorName} />
      <Content>
        <Column $gap={40}>
          {/* 안내: 집주인 후기 */}
          <Notice>※ 집주인 후기입니다. 관리/결제 관점에서 솔직한 경험을 남겨주세요.</Notice>

          {/* 별점 */}
          <RateRow>
            {[1, 2, 3, 4, 5].map(n => (
              <StarBtn key={n} onClick={() => setRating(n)} aria-label={`${n}점`}>
                <StarIcon src={n <= rating ? starYellow : starGray} alt="" />
              </StarBtn>
            ))}
          </RateRow>

          {/* 수리 분야 */}
          <Column $gap={20}>
            <SectionTitle>어떤 분야의 수리를 받으셨나요?</SectionTitle>
            <TypeGrid>
              {REPAIR_TYPES.map(t => {
                const selected = types.has(t.key);
                return (
                  <TypeItem key={t.key} onClick={() => toggleType(t.key)}>
                    <TypeIcon src={selected ? iconChecked : iconUnchecked} alt="" />
                    <TypeLabel $selected={selected}>{t.label}</TypeLabel>
                  </TypeItem>
                );
              })}
            </TypeGrid>
          </Column>

          {/* 가이드 + 사진 업로드 */}
          <Column $gap={12}>
            <Column $gap={2}>
              <SectionTitle>후기를 작성해 보세요!</SectionTitle>
              <Caption>비용/커뮤니케이션/시간 준수 등 관리 관점도 적어주시면 좋아요.</Caption>
            </Column>

            <Column $gap={6}>
              <SubTitle>후기 사진</SubTitle>
              <ThumbGrid>
                <UploadCard onClick={handlePick}>
                  <img src={cameraIcon} alt="" />
                  <small>
                    사진 {photos.length}/{MAX_PHOTOS}
                  </small>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    style={{ display: 'none' }}
                  />
                </UploadCard>

                {photos.map((p, idx) => (
                  <Thumb key={idx}>
                    <img src={p.url} alt={`review-${idx}`} />
                    <ThumbRemove onClick={() => removePhoto(idx)} aria-label="사진 삭제">
                      ×
                    </ThumbRemove>
                  </Thumb>
                ))}
              </ThumbGrid>
            </Column>

            {/* 상세 후기 */}
            <Column $gap={6}>
              <SubTitle>상세 후기</SubTitle>
              <TextArea
                value={text}
                onChange={e => setText(e.target.value.slice(0, MAX_TEXT))}
                placeholder="집주인 입장에서 도움이 될 경험을 남겨주세요. (예: 공사 일정 준수, 비용 투명성, 소통 등)"
                maxLength={MAX_TEXT}
              />
              <CharCounter>
                {text.length}/{MAX_TEXT}
              </CharCounter>
            </Column>
          </Column>
        </Column>
      </Content>

      <BottomBar>
        <Button text="작성 완료" active={canSubmit} onClick={onSubmit} />
      </BottomBar>
    </Screen>
  );
}

/* ===== styled ===== */
const Screen = styled.div`
  min-height: 100vh;
  background: ${color('grayscale.000')};
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  padding: 16px 24px;
`;
const Notice = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
  text-align: center;
`;
const SectionTitle = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;
const SubTitle = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.800')};
`;
const Caption = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;
const RateRow = styled.div`
  display: flex;
  justify-content: center;
`;
const StarBtn = styled.button`
  all: unset;
  cursor: pointer;
  padding: 6px;
`;
const StarIcon = styled.img`
  width: 28px;
  height: 28px;
  display: block;
`;
const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 10px;
  column-gap: 16px;
`;
const TypeItem = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 0;
  padding: 0;
  min-height: 32px;
  cursor: pointer;
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
  grid-gap: 8px;
`;
const UploadCard = styled.button`
  position: relative;
  border: 1px dashed ${color('grayscale.300')};
  border-radius: 8px;
  background: ${color('grayscale.050')};
  height: 72px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: 22px;
    height: 22px;
    opacity: 0.8;
  }
  small {
    ${typo('caption2')};
    margin-top: 6px;
    color: ${color('grayscale.500')};
  }
`;
const Thumb = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  height: 72px;
  background: ${color('grayscale.100')};
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`;
const ThumbRemove = styled.button`
  position: absolute;
  right: 4px;
  top: 4px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
`;
const TextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  resize: none;
  border-radius: 6px;
  border: 1px solid ${color('grayscale.200')};
  padding: 13px 15px;
  ${typo('body2')};
  color: ${color('grayscale.900')};
  outline: none;
  background: ${color('grayscale.100')};
  ::placeholder {
    color: ${color('grayscale.400')};
  }
`;
const CharCounter = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
  text-align: right;
`;
const fadeUp = keyframes` from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } `;
const BottomBar = styled.div`
  background: ${color('grayscale.000')};
  padding: 33px 25px;
  margin-top: auto;
  animation: ${fadeUp} 320ms ease both;
`;
