// src/templates/tenant/my/AddressAdminTemplate.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import styled, { css } from 'styled-components';
import { Column, Row, Spacer } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import { Page } from '../../../styles/layout';

import TopBar from '../../../components/common/TopBar';

import iconChevron from '../../../assets/repair/icon-chevron.svg';
import iconPlus from '../../../assets/my/address-admin/icon-plus.svg';
import iconHouse from '../../../assets/my/address-admin/icon-house.svg';
import iconCompany from '../../../assets/my/address-admin/icon-building.svg';
import iconEtc from '../../../assets/my/address-admin/icon-location.svg';

import Tag10PM from '../../../assets/my/address-admin/Tag_10PM.svg';
import TagBaby from '../../../assets/my/address-admin/Tag_Baby.svg';
import TagPet from '../../../assets/my/address-admin/Tag_Pet.svg';

import iconSpeechBubble from '../../../assets/my/address-admin/icon-speech-bubble.svg';

// ✅ 목데이터/상수 데이터 import 제거 (디자인 관련 아이콘/색상은 유지)
// import { ADDRESS_LIST_MOCK, ALLOWED_NOTES } from '../../../mocks/my/addresses';

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
// ✅ 페이지에서 내려주는 items만 사용 (디자인/마크업 변경 없음)
export default function AddressAdminTemplate({ items: itemsProp = [] }) {
  // 로컬 상태는 UI 상호작용(현재주소 토글, 상세/추가에서 온 패치)을 위해 유지
  const [items, setItems] = useState(itemsProp);
  const nav = useNavigate();
  const location = useLocation();

  // 페이지에서 내려준 최신 데이터로 동기화
  useEffect(() => {
    setItems(itemsProp);
  }, [itemsProp]);

  const setCurrentAddress = id => {
    setItems(prev => prev.map(it => ({ ...it, isCurrent: it.id === id })));
  };

  // ✅ 상세/추가에서 온 patch/remove/add를 목록에 즉시 반영 (기존 동작 유지)
  useEffect(() => {
    const patch = location.state?.patch;
    const removeId = location.state?.removeId;
    const addItem = location.state?.add;
    const replaceHome = Boolean(location.state?.replaceHome);

    if (!patch && !removeId && !addItem) return;

    setItems(prev => {
      let next = [...prev];
      if (removeId) {
        next = next.filter(it => it.id !== removeId);
      }
      if (patch) {
        next = next.map(it => (it.id === patch.id ? { ...it, ...patch } : it));
      }
      if (addItem) {
        // 1) '우리집' 교체 시 기존 HOME의 현재주소 해제
        if (replaceHome && addItem.placeType === 'HOME') {
          next = next.map(it => (it.placeType === 'HOME' ? { ...it, isCurrent: false } : it));
        }

        // 2) 중복 판별(주소1+주소2+타입 기준) → 있으면 업데이트, 없으면 '아래에' 추가
        const norm = s => (s || '').trim();
        const keyOf = a => [a.placeType, norm(a.address1), norm(a.address2)].join('|');
        const idx = next.findIndex(it => keyOf(it) === keyOf(addItem));

        if (idx >= 0) {
          // 같은 주소가 이미 있으면 그 항목만 갱신 (id는 기존 유지)
          next[idx] = { ...next[idx], ...addItem };
        } else {
          // 새 주소는 목록 '맨 아래'에 붙이기
          next = [...next, addItem];
        }
      }
      return next;
    });

    // 중복 반영 방지
    nav(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, nav]);

  return (
    <Page>
      <TopBar title="주소 관리" />
      <ButtonWrapper>
        <IconPlus src={iconPlus} />
        <AddButton
          type="button"
          onClick={() => {
            const hasHomeAlready = items.some(it => it.placeType === 'HOME');
            nav('/address/add/AddressKeyword', { state: { hasHomeAlready } });
          }}
        >
          주소 등록하기
        </AddButton>
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
              {(neighborNotes || []).map(key => {
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
// 스타일 (기존 그대로 유지)
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
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(1, 210, 129, 0.15);
  color: ${color('brand.primary')};
`;

const AddrLine = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.500')};
  /* 2줄까지 표시 + 말줄임 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  /* 한국어 줄바꿈 안정화 */
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const Icon = styled.img`
  width: 20px;
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
