// src/templates/tenant/my/AddressAdminTemplate.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import styled, { css } from 'styled-components';
import { Column, Row, Spacer } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import { Page } from '../../../styles/layout';

import TopBar from '../../../components/common/TopBar';
import Toast from '../../../components/common/Toast';

import iconChevron from '../../../assets/repair/icon-chevron.svg';
import iconPlus from '../../../assets/my/address-admin/icon-plus.svg';
import iconHouse from '../../../assets/my/address-admin/icon-house.svg';
import iconCompany from '../../../assets/my/address-admin/icon-building.svg';
import iconEtc from '../../../assets/my/address-admin/icon-location.svg';

import Tag10PM from '../../../assets/my/address-admin/Tag_10PM.svg';
import TagBaby from '../../../assets/my/address-admin/Tag_Baby.svg';
import TagPet from '../../../assets/my/address-admin/Tag_Pet.svg';

import iconSpeechBubble from '../../../assets/my/address-admin/icon-speech-bubble.svg';

// ----------------------------------------------------------
const PLACE_TYPES = [
  { key: 'HOME', label: '우리집' },
  { key: 'COMPANY', label: '회사' },
  { key: 'ETC', label: '기타' },
];

const PLACE_ICON = { HOME: iconHouse, COMPANY: iconCompany, ETC: iconEtc };

const NOTE_ICONS = {
  SLEEP_AFTER_10: { tag: Tag10PM, alt: '10시 이후로는 잡니다' },
  HAS_BABY: { tag: TagBaby, alt: '집에 아기가 있어요' },
  HAS_PET: { tag: TagPet, alt: '반려동물이 있어요' },
};

// ----------------------------------------------------------
// 메인
// ----------------------------------------------------------
export default function AddressAdminTemplate({
  items: itemsProp = [],
  loading = false,
  error = '',
  onRefresh, // 선택
  onChangeCurrent, // ⬅️ 페이지에서 주입된 API 호출 핸들러
}) {
  const [items, setItems] = useState(itemsProp);
  const [toast, setToast] = useState({ show: false, message: '', icon: null });
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setItems(itemsProp);
  }, [itemsProp]);

  const goMypage = () => nav('/my-page');

  // ✅ 카드 클릭 시: 검증 → API 호출 → 성공 시 토스트 + 로컬상태 갱신
  const handleSelectAsCurrent = useCallback(
    async addr => {
      // 인증 전 주소는 불가
      if (!addr?.verified) {
        setToast({ show: true, message: '인증 후 현재 주소로 설정이 가능해요.', icon: 'warning' });
        return;
      }
      // 이미 현재주소면 무시
      if (addr?.isCurrent) return;

      try {
        await onChangeCurrent?.({
          currentAddress: addr.address1,
          currentNumber: addr.address2, // "104동"/"402호" 등
        });

        // 로컬 UI 반영 (대표주소 토글)
        setItems(prev => prev.map(it => ({ ...it, isCurrent: it.id === addr.id })));

        setToast({ show: true, message: '현재 설정된 주소를 변경했어요.' });

        // 필요 시 서버 재조회
        // onRefresh?.();
      } catch (e) {
        // 서버가 USER400 등 반환 시에도 사용자 친화적으로 처리
        setToast({
          show: true,
          message: e?.message || '현재 주소 변경에 실패했습니다.',
          icon: 'warning',
        });
      }
    },
    [onChangeCurrent]
  );

  // 상세/추가에서 온 patch/remove/add 반영 (기존 유지)
  useEffect(() => {
    const patch = location.state?.patch;
    const removeId = location.state?.removeId;
    const addItem = location.state?.add;
    const replaceHome = Boolean(location.state?.replaceHome);
    if (!patch && !removeId && !addItem) return;

    setItems(prev => {
      let next = [...prev];
      if (removeId) next = next.filter(it => it.id !== removeId);
      if (patch) next = next.map(it => (it.id === patch.id ? { ...it, ...patch } : it));
      if (addItem) {
        if (replaceHome && addItem.placeType === 'HOME') {
          next = next.map(it => (it.placeType === 'HOME' ? { ...it, isCurrent: false } : it));
        }
        const norm = s => (s || '').trim();
        const keyOf = a => [a.placeType, norm(a.address1), norm(a.address2)].join('|');
        const idx = next.findIndex(it => keyOf(it) === keyOf(addItem));
        if (idx >= 0) next[idx] = { ...next[idx], ...addItem };
        else next = [...next, addItem];
      }
      return next;
    });

    nav(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, nav]);

  return (
    <Page>
      <TopBar title="주소 관리" onBack={goMypage} />
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
              onClickBox={() => handleSelectAsCurrent(addr)}
              onClickEdit={() => nav(`/address-admin/${addr.id}`, { state: { item: addr } })}
            />
          ))}
        </Column>
      </Container>

      {/* ✅ 토스트 (디자인 유지) */}
      <Toast
        message={toast.message}
        show={toast.show}
        duration={1500}
        onClose={() => setToast(t => ({ ...t, show: false }))}
        {...(toast.icon ? { icon: toast.icon } : {})} // ✅ warning일 때만 icon prop 전달
      />
    </Page>
  );
}

// ----------------------------------------------------------
// 하위: 주소 카드 (디자인 그대로)
// ----------------------------------------------------------
function AddressItem({ data, onClickBox, onClickEdit }) {
  const { alias, address1, verified, isCurrent, neighborNotes, extraNotes, placeType } = data;
  const currentIcon = PLACE_ICON[placeType] || iconEtc;
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
// 스타일 (그대로)
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const NoteIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  img {
    display: block;
    height: 34px;
    width: 100%;
  }
`;

const SpeechIcon = styled.img`
  width: 16px;
  height: 16px;
`;

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
