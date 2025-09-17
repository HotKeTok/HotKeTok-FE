import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';
import { Column, Row } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';
import { PageNoBottomBar, BottomButtonContainer } from '../../styles/layout';

import { ADDRESS_LIST_MOCK, ALLOWED_NOTES } from '../../mocks/my/addresses';
import iconHouse from '../../assets/my/address-admin/icon-house.svg';
import iconCompany from '../../assets/my/address-admin/icon-building.svg';
import iconEtc from '../../assets/my/address-admin/icon-location.svg';
import iconPlus from '../../assets/my/address-admin/icon-plus.svg';
import iconX from '../../assets/my/address-admin/icon-x.svg';
import iconSpeechBubble from '../../assets/my/address-admin/icon-speech-bubble.svg';

import Tag10PMActive from '../../assets/my/address-admin/Tag_10PM_active.svg';
import Tag10PMDisactive from '../../assets/my/address-admin/Tag_10PM_disactive.svg';
import TagBabyActive from '../../assets/my/address-admin/Tag_Baby_active.svg';
import TagBabyDisactive from '../../assets/my/address-admin/Tag_Baby_disactive.svg';
import TagPetActive from '../../assets/my/address-admin/Tag_Pet_active.svg';
import TagPetDisactive from '../../assets/my/address-admin/Tag_Pet_disactive.svg';

const NOTE_ICONS = {
  SLEEP_AFTER_10: {
    active: Tag10PMActive,
    inactive: Tag10PMDisactive,
    alt: '10시 이후로는 잡니다',
  },
  HAS_BABY: {
    active: TagBabyActive,
    inactive: TagBabyDisactive,
    alt: '집에 아기가 있어요',
  },
  HAS_PET: {
    active: TagPetActive,
    inactive: TagPetDisactive,
    alt: '반려동물이 있어요',
  },
};

const PLACE_TYPES = [
  { key: 'HOME', label: '우리집', icon: iconHouse },
  { key: 'WORK', label: '회사', icon: iconCompany },
  { key: 'ETC', label: '기타', icon: iconEtc },
];

export default function AddressAdminDetailTemplate() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state } = useLocation();

  const initial = useMemo(() => {
    if (state?.item) return state.item;
    return ADDRESS_LIST_MOCK.find(x => x.id === id) || ADDRESS_LIST_MOCK[0];
  }, [id, state]);

  const [placeType, setPlaceType] = useState(initial.placeType);
  const [customPlaceName, setCustomPlaceName] = useState(initial.customPlaceName || '');
  const [neighborNotes, setNeighborNotes] = useState(initial.neighborNotes || []);
  const [extraNotes, setExtraNotes] = useState(
    Array.isArray(initial.extraNotes)
      ? initial.extraNotes
      : initial.extraNotes
      ? [initial.extraNotes]
      : []
  );
  const [extraDraft, setExtraDraft] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const toggleNote = key => {
    setNeighborNotes(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
  };

  const addExtra = () => {
    const v = (extraDraft || '').trim();
    if (!v) return;
    // 중복 방지
    setExtraNotes(prev => (prev.includes(v) ? prev : [...prev, v]));
    setExtraDraft('');
  };

  const removeExtra = val => {
    setExtraNotes(prev => prev.filter(x => x !== val));
  };

  const handleSave = () => {
    const alias =
      placeType === 'HOME'
        ? '우리집'
        : placeType === 'WORK'
        ? '공유오피스'
        : customPlaceName || '기타';

    const payload = {
      ...initial,
      placeType,
      placeTypeLabel: PLACE_TYPES.find(p => p.key === placeType)?.label || '기타',
      customPlaceName: placeType === 'ETC' ? customPlaceName : '',
      alias,
      neighborNotes,
      extraNotes,
    };
    // 목록 페이지로 패치 전달 (서버 없이 즉시 반영)
    nav('/address-admin', {
      replace: true,
      state: { patch: payload },
    });
  };

  const handleDelete = () => {
    // 삭제 전달
    nav('/address-admin', {
      replace: true,
      state: { removeId: initial.id },
    });
  };

  return (
    <PageNoBottomBar>
      <TopBar title="주소 상세" onBack={() => nav(-1)} />

      <Body>
        <Column $gap={30}>
          {/* 주소 박스 */}
          <AddressBox>
            <AddrMain>{initial.address1}</AddrMain>
            {initial.address2 ? <AddrSubText>{initial.address2}</AddrSubText> : null}
            {initial.lot ? (
              <Row $gap={8} $align={'center'} style={{ marginTop: 10 }}>
                <LotTag>지번</LotTag>
                <AddrLotText>{initial.lot}</AddrLotText>
              </Row>
            ) : null}
          </AddressBox>

          {/* 주소 분류 */}
          <Section>
            <Column $gap={6}>
              <SecTitle>주소 분류</SecTitle>
              <Row style={{ gap: 10 }}>
                {PLACE_TYPES.map(p => (
                  <Segment
                    key={p.key}
                    $active={placeType === p.key}
                    onClick={() => setPlaceType(p.key)}
                  >
                    <SegIcon src={p.icon} alt="" />
                    <SegLabel>{p.label}</SegLabel>
                  </Segment>
                ))}
              </Row>
            </Column>

            {placeType === 'ETC' && (
              <div style={{ marginTop: '30px' }}>
                <SecTitle>주소 별칭</SecTitle>
                <EtcInput
                  placeholder="어떤 장소인가요?"
                  value={customPlaceName}
                  onChange={e => setCustomPlaceName(e.target.value)}
                  maxLength={15}
                />
              </div>
            )}
          </Section>

          {/* 이웃에게 한마디 */}
          <Section>
            <Column $gap={10}>
              <Column $gap={4}>
                <SecTitle>이웃에게 한마디</SecTitle>
                <HelpText>다중선택이 가능해요.</HelpText>
              </Column>

              <Row style={{ gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(NOTE_ICONS).map(([key, imgs]) => {
                  const active = neighborNotes.includes(key);
                  return (
                    <NoteIconButton
                      key={key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleNote(key)}
                      title={imgs.alt}
                    >
                      <img src={active ? imgs.active : imgs.inactive} alt={imgs.alt} />
                    </NoteIconButton>
                  );
                })}

                {/* 커스텀 태그들 */}
                {extraNotes.map(tag => (
                  <CustomTag key={tag}>
                    <IconSpeechBubble src={iconSpeechBubble} />
                    <span>{tag}</span>
                    <RemoveBtn
                      src={iconX}
                      aria-label={`${tag} 삭제`}
                      onClick={() => removeExtra(tag)}
                    />
                  </CustomTag>
                ))}

                {/* 입력 칩은 항상 표시 */}
                <InlineInputChip>
                  <PlusIcon src={iconPlus} />
                  <ChipInput
                    autoComplete="off"
                    placeholder="직접 입력"
                    value={extraDraft}
                    onChange={e => setExtraDraft(e.target.value)}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    onKeyDown={e => {
                      // 한글/일본어 등 IME 조합 중 Enter는 무시
                      if (e.key === 'Enter' && !isComposing && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        addExtra();
                      }
                    }}
                  />
                </InlineInputChip>
              </Row>
            </Column>
          </Section>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <SmallOutline type="button" onClick={handleDelete}>
              주소 삭제
            </SmallOutline>
          </div>
        </Column>
      </Body>

      {/* 하단 고정 CTA */}
      <BottomButtonContainer>
        <Button text={'수정하기'} onClick={handleSave} />
      </BottomButtonContainer>
    </PageNoBottomBar>
  );
}

/* ===================== styles ===================== */

const Body = styled.div`
  padding: 20px 25px;
`;

const AddressBox = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
`;

const AddrMain = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.800')};
  margin: 0;
`;
const AddrSubText = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.800')};
  margin: 4px 0 0 0;
`;
const AddrLotText = styled.div`
  ${typo('caption2')}
  color: ${color('grayscale.600')};
`;
const LotTag = styled.span`
  ${typo('caption2')}
  padding: 2px 6px;
  border-radius: 4px;
  color: ${color('grayscale.400')};
  border: 0.5px solid ${color('grayscale.400')};
`;

const Section = styled.section``;

const SecTitle = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.700')};
`;

const HelpText = styled.div`
  ${typo('caption2')}
  color: ${color('grayscale.600')};
`;

/* 세그먼트 버튼(우리집/회사/기타) */
const Segment = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 110px;
  height: 80px;
  border-radius: 10px;
  padding: auto;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;

  gap: 10px;

  cursor: pointer;

  ${p =>
    p.$active &&
    css`
      background: ${color('brand.primary')};
      border-color: ${color('brand.500')};
      & ${SegLabel} {
        color: #fff;
      }
      & ${SegIcon} {
        filter: brightness(0) invert(1);
      }
    `}
`;
const SegIcon = styled.img`
  width: 17px;
  height: 17px;
`;
const SegLabel = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.800')};

  white-space: nowrap;
`;

/* 기타 입력 */
const EtcInput = styled.input`
  margin-top: 4px;
  width: 100%;
  padding: 13px 15px;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 6px;
  ${typo('body2')}
  color: ${color('grayscale.800')};
  outline: none;
  background: ${color('grayscale.100')};
  &::placeholder {
    color: ${color('grayscale.400')};
  }
`;

const NoteIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* 인라인 입력 칩 (노션 라벨 생성 느낌) */
const InlineInputChip = styled.label`
  display: flex;
  max-width: 32%;
  height: 40px;
  padding: 6px 16px;
  align-items: center;
  gap: 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 30px;
  background: ${color('grayscale.200')};
`;

const PlusIcon = styled.img`
  width: 10px;
`;

const ChipInput = styled.input`
  width: 100%;
  color: ${color('grayscale.800')};
  ${typo('button3')}
  border: none;
  background: transparent;
  outline: none;
  color: ${color('grayscale.800')};
  &::placeholder {
    color: ${color('grayscale.400')};
  }
`;

const IconSpeechBubble = styled.img`
  width: 18px;
`;

/* 생성된 커스텀 태그(선택된 상태) */
const CustomTag = styled.div`
  position: relative;
  ${typo('button3')}
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 12px;
  border-radius: 30px;
  background: ${color('brand.primary')};
  color: #fff;
`;

const RemoveBtn = styled.img`
  cursor: pointer;
`;

const SmallOutline = styled.button`
  ${typo('button3')}
  padding: 12px 18px;
  border-radius: 10px;
  border: 1px solid ${color('brand.primary')};
  color: ${color('brand.primary')};
`;
