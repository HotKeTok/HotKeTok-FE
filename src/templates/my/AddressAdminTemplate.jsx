// src/templates/my/AddressAdminTemplate.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import styled, { css } from 'styled-components';
import { Column, Row, Spacer } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';
import { Page } from '../../styles/layout';

import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';

import iconChevron from '../../assets/repair/icon-chevron.svg';
import iconPlus from '../../assets/my/address-admin/icon-plus.svg';
import iconHouse from '../../assets/my/address-admin/icon-house.svg';
import iconCompany from '../../assets/my/address-admin/icon-building.svg';
import iconEtc from '../../assets/my/address-admin/icon-location.svg';

import Tag10PM from '../../assets/my/address-admin/Tag_10PM.svg';
import TagBaby from '../../assets/my/address-admin/Tag_Baby.svg';
import TagPet from '../../assets/my/address-admin/Tag_Pet.svg';

import iconSpeechBubble from '../../assets/my/address-admin/icon-speech-bubble.svg';

import { ADDRESS_LIST_MOCK, ALLOWED_NOTES } from '../../mocks/my/addresses';

// ----------------------------------------------------------
// 상수
// ----------------------------------------------------------
const PLACE_TYPES = [
  { key: 'HOME', label: '우리집' },
  { key: 'WORK', label: '회사' },
  { key: 'ETC', label: '기타' },
];

// placeType → icon 매핑
const PLACE_ICON = {
  HOME: iconHouse,
  WORK: iconCompany,
  ETC: iconEtc,
};

// NOTE 아이콘 매핑
const NOTE_ICONS = {
  SLEEP_AFTER_10: {
    tag: Tag10PM,
    alt: '10시 이후로는 잡니다',
  },
  HAS_BABY: { tag: TagBaby, alt: '집에 아기가 있어요' },
  HAS_PET: { tag: TagPet, alt: '반려동물이 있어요' },
};

// ----------------------------------------------------------
// 메인 컴포넌트
// ----------------------------------------------------------
export default function AddressAdminTemplate() {
  const [items, setItems] = useState(ADDRESS_LIST_MOCK);
  const nav = useNavigate();
  const location = useLocation();

  const setCurrentAddress = id => {
    setItems(prev => prev.map(it => ({ ...it, isCurrent: it.id === id })));
  };

  // 상세에서 온 patch/remove를 목록에 즉시 반영 (서버 없이)
  useEffect(() => {
    const patch = location.state?.patch;
    const removeId = location.state?.removeId;
    if (!patch && !removeId) return;

    setItems(prev => {
      if (removeId) return prev.filter(it => it.id !== removeId);
      if (patch) return prev.map(it => (it.id === patch.id ? { ...it, ...patch } : it));
      return prev;
    });

    // 중복 반영 방지: state 초기화
    nav(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, nav]);

  return (
    <Page>
      <TopBar title="주소 관리" />
      <ButtonWrapper>
        <IconPlus src={iconPlus} />
        <AddButton type="button">주소 등록하기</AddButton>
      </ButtonWrapper>

      <Container>
        <Column $gap={10}>
          {items.map(addr => (
            <AddressItem
              key={addr.id}
              data={addr}
              onClickBox={() => setCurrentAddress(addr.id)}
              onClickEdit={() => nav(`/address-admin/${addr.id}`, { state: { item: addr } })}
            />
          ))}
        </Column>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------
// 하위: 주소 카드
// ----------------------------------------------------------
function AddressItem({ data, onClickBox, onClickEdit }) {
  const { alias, address1, verified, isCurrent, neighborNotes, extraNotes } = data;

  // ✅ placeType 기반 아이콘 선택
  const currentIcon = PLACE_ICON[data.placeType] || iconEtc;

  // extraNotes는 문자열/배열 혼용 가능성을 정규화
  const extraList = Array.isArray(extraNotes) ? extraNotes : extraNotes ? [extraNotes] : [];

  return (
    <Card $active={isCurrent} onClick={onClickBox}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Row $gap={20}>
          <Icon src={currentIcon} alt="" />
          <Column style={{ gap: 6, flex: 1, minWidth: 0 }}>
            <Row style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <Alias>{alias}</Alias>
              <Badge $state={verified ? 'done' : 'pending'}>
                {verified ? '인증 완료' : '인증 전'}
              </Badge>
              {isCurrent && <NowBadge>현재 설정된 주소</NowBadge>}
            </Row>
            <AddrLine title={address1}>{address1}</AddrLine>
            {/* 메모 태그: 기본 아이콘 + 커스텀 태그 */}
            <Row style={{ gap: 8, flexWrap: 'wrap' }}>
              {neighborNotes.map(key => {
                const imgs = NOTE_ICONS[key];
                if (!imgs) return null;
                return (
                  <NoteIcon key={key}>
                    <img src={imgs.tag} alt={imgs.alt} />
                  </NoteIcon>
                );
              })}

              {extraList.map(txt => (
                <CustomNoteTag key={txt}>
                  <SpeechIcon src={iconSpeechBubble} alt="" />
                  <span>{txt}</span>
                </CustomNoteTag>
              ))}
            </Row>
          </Column>
        </Row>

        <EditBtn
          type="button"
          aria-label="주소 정보 수정"
          onClick={e => {
            e.stopPropagation();
            onClickEdit();
          }}
        >
          <img src={iconChevron} />
        </EditBtn>
      </Row>
    </Card>
  );
}

// ----------------------------------------------------------
// 스타일
// ----------------------------------------------------------
const Container = styled.div`
  padding: 0px 25px;
`;

const ButtonWrapper = styled.div`
  padding: 30px 20px 40px 20px;
  position: relative;
`;

const IconPlus = styled.img`
  position: absolute;
  left: 40px;
  top: 50px;
  width: 12px;
`;

const AddButton = styled.div`
  ${typo('button2')}
  color: ${color('grayscale.600')};
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  cursor: pointer;
`;

const Card = styled.div`
  width: 100%;
  text-align: left;
  padding: 12px 0px 12px 16px;
  background: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 10px;
  cursor: pointer;

  ${p =>
    p.$active &&
    css`
      border-color: ${color('brand.primary')};
    `}
`;

const Alias = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')};
`;

const Badge = styled.div`
  ${typo('button3')}
  padding: 1px 6px;
  border-radius: 30px;
  background: ${p => (p.$state === 'done' ? color('brand.primary') : color('transparent'))};
  color: ${p => (p.$state === 'done' ? color('white') : color('brand.primary'))};
  border: 1px solid ${p => (p.$state === 'done' ? color('transparent') : color('brand.primary'))};
  opacity: ${p => (p.$state === 'done' ? 1 : 0.5)};
`;

const NowBadge = styled.div`
  ${typo('button3')}
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(1, 210, 129, 0.15);
  color: ${color('brand.primary')};
`;

const AddrLine = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.500')};
  white-space: nowrap;
`;

const AddrSub = styled.p`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LotLine = styled.p`
  ${typo('caption2')}
  color: ${color('grayscale.500')};
  margin: 0;
`;

const Icon = styled.img`
  width: 20px;
`;

const NoteChip = styled.span`
  ${typo('caption1')}
  padding: 6px 10px;
  background: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 999px;
  color: ${color('grayscale.700')};
`;

const EditBtn = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 7px;
    height: 12px;
  }
`;

/* ===== Sheet ===== */

const SheetWrap = styled.div`
  padding: 16px 16px 28px;
`;

const SheetTitle = styled.h3`
  ${typo('subtitle1')}
  color: ${color('grayscale.900')};
  margin-bottom: 10px;
`;

const AddressBox = styled.div`
  padding: 12px;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 12px;
  background: ${color('grayscale.50')};
`;

const AddrMain = styled.p`
  ${typo('body2')}
  color: ${color('grayscale.900')};
  margin: 0;
`;

const AddrSubText = styled.p`
  ${typo('caption1')}
  color: ${color('grayscale.700')};
  margin: 2px 0 0 0;
`;

const AddrLotText = styled.p`
  ${typo('caption2')}
  color: ${color('grayscale.500')};
  margin: 2px 0 0 0;
`;

const Section = styled.section`
  margin-top: 16px;
`;

const SecTitle = styled.p`
  ${typo('subtitle2')}
  color: ${color('grayscale.900')};
  margin: 0 0 8px 0;
`;

const HelpText = styled.p`
  ${typo('caption2')}
  color: ${color('grayscale.600')};
  margin: 0;
`;

const SelectBtn = styled.button`
  ${typo('button2')}
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  color: ${color('grayscale.800')};

  ${p =>
    p.$active &&
    css`
      border-color: ${color('brand.500')};
      background: ${color('brand.50')};
      color: ${color('brand.700')};
    `}
`;

const EtcInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${color('grayscale.300')};
  border-radius: 12px;
  ${typo('body2')}
  color: ${color('grayscale.900')};

  &:focus {
    outline: none;
    border-color: ${color('brand.500')};
    box-shadow: 0 0 0 3px ${color('brand.50')};
  }
`;

const ToggleChip = styled.button`
  ${typo('caption1')}
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  color: ${color('grayscale.800')};

  ${p =>
    p.$active &&
    css`
      background: ${color('green.50')};
      color: ${color('green.700')};
      border-color: ${color('green.300')};
    `}
`;

const ExtraInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  border: 1px solid ${color('grayscale.300')};
  border-radius: 10px;
  ${typo('caption1')}
  color: ${color('grayscale.900')};
  &:focus {
    outline: none;
    border-color: ${color('brand.500')};
    box-shadow: 0 0 0 2px ${color('brand.50')};
  }
`;

const SmallBtn = styled.button`
  ${typo('caption1')}
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${color('brand.500')};
  background: ${color('brand.500')};
  color: #fff;
`;

const SmallGhost = styled.button`
  ${typo('caption1')}
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  color: ${color('grayscale.700')};
`;

const DangerBtn = styled.button`
  ${typo('button2')}
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${color('red.300')};
  background: ${color('red.50')};
  color: ${color('red.700')};
`;

const Fullscreen = styled.div`
  position: fixed;
  inset: 0;

  display: flex;
  flex-direction: column;
  background: #fff;

  /* ✅ 앱 크기에 맞추기 */
  max-width: var(--container-w);
  margin: 0 auto;
`;

const FullscreenBody = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px 16px 24px;
`;

// 상세와 비슷한 크기/여백으로 아이콘만 표시
const NoteIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  img {
    display: block;
    height: 34px; /* 필요시 조절 */
    width: 100%;
  }
`;

const SpeechIcon = styled.img`
  width: 16px;
  height: 16px;
`;

// 커스텀(직접입력) 태그 — 상세 페이지의 초록 칩 스타일 차용
const CustomNoteTag = styled.div`
  ${typo('button3')}
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 30px;
  background: ${color('grayscale.200')};
  color: ${color('grayscale.600')};
`;
