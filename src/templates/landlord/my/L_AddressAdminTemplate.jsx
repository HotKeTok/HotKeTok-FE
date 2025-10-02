// src/templates/landlord/my/L_AddressAdminTemplate.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { Column, Row } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import { Page } from '../../../styles/layout';

import TopBar from '../../../components/common/TopBar';

import iconPlus from '../../../assets/my/address-admin/icon-plus.svg';
import iconBuilding from '../../../assets/my/address-admin/icon-building.svg'; // 건물 아이콘 고정

// ✅ 집주인 전용 목데이터
import { L_ADDRESS_LIST_MOCK } from '../../../mocks/landlord/addresses';

/**
 * 집주인 주소관리 (Detail 없음, 단순 선택형)
 * @param {object} props
 * @param {string} [props.addPath='/landlord/address/add/AddressKeyword'] 주소추가 플로우 시작 경로
 */
export default function L_AddressAdminTemplate({ addPath = '/address/add/:step' }) {
  const [items, setItems] = useState(L_ADDRESS_LIST_MOCK);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [toast, setToast] = useState('');
  const nav = useNavigate();
  const location = useLocation();

  // 현재 주소 설정
  const setCurrentAddress = id => {
    setItems(prev => prev.map(it => ({ ...it, isCurrent: it.id === id })));
    setToast('현재 설정된 주소를 변경했어요.');
    setTimeout(() => setToast(''), 1600);
  };

  // 삭제
  const removeItem = id => {
    setItems(prev => prev.filter(it => it.id !== id));
    setMenuOpenId(null);
  };

  // 상위 플로우(add/patch/remove) 반영
  useEffect(() => {
    const patch = location.state?.patch;
    const removeId = location.state?.removeId;
    const addItem = location.state?.add;

    if (!patch && !removeId && !addItem) return;

    setItems(prev => {
      let next = [...prev];
      if (removeId) next = next.filter(it => it.id !== removeId);
      if (patch) next = next.map(it => (it.id === patch.id ? { ...it, ...patch } : it));
      if (addItem) {
        // 집주인: 단순 추가
        next = [...next, addItem];
      }
      return next;
    });

    nav(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, nav]);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const onDoc = () => setMenuOpenId(null);
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <Page>
      <TopBar title="주소 관리" />
      <ButtonWrapper>
        <IconPlus src={iconPlus} alt="" />
        <AddButton type="button" onClick={() => nav(addPath)}>
          주소 등록하기
        </AddButton>
      </ButtonWrapper>

      <Container>
        <Column $gap={10}>
          {items.map(addr => (
            <LandlordAddressItem
              key={addr.id}
              data={addr}
              menuOpen={menuOpenId === addr.id}
              onClickCard={() => setCurrentAddress(addr.id)}
              onToggleMenu={e => {
                e.stopPropagation();
                setMenuOpenId(prev => (prev === addr.id ? null : addr.id));
              }}
              onDelete={() => removeItem(addr.id)}
            />
          ))}
        </Column>
      </Container>

      {toast && (
        <ToastWrap>
          <ToastDot />
          {toast}
        </ToastWrap>
      )}
    </Page>
  );
}

/* -------------------------
 * 카드 (집주인 전용)
 * ----------------------- */
// --- (그대로) 카드 렌더 부분만 교체 ---
function LandlordAddressItem({ data, onClickCard, menuOpen, onToggleMenu, onDelete }) {
  const { roadAddress, buildingName, isCurrent } = data;

  return (
    <Card $active={isCurrent} onClick={onClickCard}>
      <Row style={{ alignItems: 'center' }}>
        {/* ▶ 왼쪽 콘텐츠: 아이콘 + 주소 텍스트 */}
        <Row $gap={16} $align="center" style={{ minWidth: 0, flex: 1 }}>
          <Icon src={iconBuilding} alt="" />
          <Column $gap={8} style={{ minWidth: 0 }}>
            <AddrTitle title={roadAddress}>{roadAddress}</AddrTitle>
            {!!buildingName && <AddrSub>{buildingName}</AddrSub>}
            {isCurrent && <NowBadge>현재 설정된 주소</NowBadge>}
          </Column>
        </Row>

        {/* ▶ 오른쪽 ... 버튼 */}
        <MoreBtn aria-label="더보기" onClick={onToggleMenu} onMouseDown={e => e.stopPropagation()}>
          ⋯
        </MoreBtn>
      </Row>

      {menuOpen && (
        <Menu onClick={e => e.stopPropagation()}>
          <MenuItem onClick={onDelete}>삭제하기</MenuItem>
        </Menu>
      )}
    </Card>
  );
}

/* -------------------------
 * 스타일
 * ----------------------- */
const Container = styled.div`
  padding: 0 20px;
`;

const ButtonWrapper = styled.div`
  padding: 30px 20px 30px 20px;
  position: relative;
  background: #fff;
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
  position: relative;
  padding: 12px 16px;
  background: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 12px;
  cursor: pointer;

  ${p =>
    p.$active &&
    css`
      border-color: ${color('brand.primary')};
    `}
`;

const Icon = styled.img`
  width: 18px;
`;

const AddrTitle = styled.div`
  ${typo('subtitle1')};
  color: ${color('black')};
  white-space: nowrap;
`;

const NowBadge = styled.div`
  ${typo('button3')};
  display: inline-flex; /* ✅ 줄만큼만 */
  align-items: center;
  width: fit-content; /* ✅ 줄만큼만 */
  align-self: flex-start; /* ✅ 왼쪽 정렬 유지 */
  margin-top: 2px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(1, 210, 129, 0.15);
  color: ${color('brand.primary')};
`;

const AddrSub = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.500')};
  /* 한 줄 말줄임 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 86vw;
`;

const MoreBtn = styled.button`
  margin-left: auto; /* ✅ 카드 안 우측으로 쏙 */
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${color('grayscale.500')};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  flex: 0 0 auto;
`;

const Menu = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  transform: translateY(40px);
  min-width: 110px;
  background: #fff;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 6px;
  z-index: 10;
`;
const MenuItem = styled.button`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 8px;
  ${typo('body2')};
  color: ${color('grayscale.800')};
  cursor: pointer;

  &:hover {
    background: ${color('grayscale.100')};
  }
`;

/* 토스트 */
const toastIn = keyframes`
  from { transform: translate(-50%, 12px); opacity: 0; }
  to   { transform: translate(-50%, 0);    opacity: 1; }
`;
const ToastWrap = styled.div`
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(32, 32, 32, 0.9);
  color: #fff;
  ${typo('caption1')};
  animation: ${toastIn} 200ms ease both;
`;
const ToastDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: ${color('brand.primary')};
`;
