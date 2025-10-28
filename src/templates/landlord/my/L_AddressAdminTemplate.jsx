import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Column, Row } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import { Page } from '../../../styles/layout';
import TopBar from '../../../components/common/TopBar';
import Toast from '../../../components/common/Toast';

import iconPlus from '../../../assets/my/address-admin/icon-plus.svg';
import iconBuilding from '../../../assets/my/address-admin/icon-building.svg';

/**
 * 집주인 주소관리
 * state: NONE(인증전), REGISTERED(입주민없음), MATCHED(입주민있음)
 */
export default function L_AddressAdminTemplate({
  items: itemsProp = [],
  onChangeCurrent,
  addPath = '/address/add/:step',
}) {
  const [items, setItems] = useState(itemsProp);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', icon: null });
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setItems(itemsProp);
  }, [itemsProp]);

  // add/patch/remove 반영
  useEffect(() => {
    const { patch, removeId, add } = location.state || {};
    if (!patch && !removeId && !add) return;

    setItems(prev => {
      let next = [...prev];
      if (removeId) next = next.filter(it => it.id !== removeId);
      if (patch) next = next.map(it => (it.id === patch.id ? { ...it, ...patch } : it));
      if (add) next = [...next, add];
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

  const goBack = () => nav('/my-page');
  const openAdd = () => nav(addPath);

  // ✅ NONE은 변경 불가, REGISTERED/MATCHED는 변경 가능
  const handleSelectAsCurrent = useCallback(
    async addr => {
      if (addr?.state === 'NONE') {
        setToast({ show: true, message: '인증 후 현재 주소로 설정이 가능해요.', icon: 'warning' });
        return;
      }
      if (addr?.isCurrent) return;

      try {
        await onChangeCurrent?.({
          currentAddress: addr.roadAddress,
          currentNumber: addr.buildingName,
        });
        setItems(prev => prev.map(it => ({ ...it, isCurrent: it.id === addr.id })));
        setToast({ show: true, message: '현재 설정된 주소를 변경했어요.' });
      } catch (e) {
        setToast({
          show: true,
          message: e?.message || '현재 주소 변경에 실패했습니다.',
          icon: 'warning',
        });
      }
    },
    [onChangeCurrent]
  );

  const removeItem = id => {
    setItems(prev => prev.filter(it => it.id !== id));
    setMenuOpenId(null);
  };

  return (
    <Page>
      <TopBar title="주소 관리" onBack={goBack} />

      <ButtonWrapper>
        <IconPlus src={iconPlus} alt="" />
        <AddButton type="button" onClick={openAdd}>
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
              onClickCard={() => handleSelectAsCurrent(addr)}
              onToggleMenu={e => {
                e.stopPropagation();
                setMenuOpenId(prev => (prev === addr.id ? null : addr.id));
              }}
              onDelete={() => removeItem(addr.id)}
            />
          ))}
        </Column>
      </Container>

      <Toast
        message={toast.message}
        show={toast.show}
        duration={1500}
        onClose={() => setToast(t => ({ ...t, show: false }))}
        {...(toast.icon ? { icon: toast.icon } : {})}
      />
    </Page>
  );
}

/* -------------------------
 * 카드 (배지 추가 / 디자인 유지)
 * ----------------------- */
function LandlordAddressItem({ data, onClickCard }) {
  const { roadAddress, buildingName, isCurrent, state } = data;

  const isCertDone = state === 'REGISTERED' || state === 'MATCHED';
  const badgeState = isCertDone ? 'done' : 'pending';
  const badgeText = isCertDone ? '인증 완료' : '인증 전';

  return (
    <Card $active={isCurrent} onClick={onClickCard}>
      <Row style={{ alignItems: 'center' }}>
        <Row $gap={16} $align="center" style={{ minWidth: 0, flex: 1 }}>
          <Icon src={iconBuilding} alt="건물아이콘" />
          <Column $gap={8}>
            <Column>
              <AddrTitle title={roadAddress}>{roadAddress?.split('(')[0]}</AddrTitle>
              {roadAddress?.includes('(') && (
                <AddrSubBracket>({roadAddress.split('(')[1]}</AddrSubBracket>
              )}
            </Column>
            <Row style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge $state={badgeState}>{badgeText}</Badge>
              {isCurrent && <NowBadge>현재 설정된 주소</NowBadge>}
            </Row>
            {!!buildingName && <AddrSub>{buildingName}</AddrSub>}
          </Column>
        </Row>
      </Row>
    </Card>
  );
}

/* -------------------------
 * 스타일 (그대로)
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
  padding: 12px 0px 12px 16px;
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
  ${typo('button3')};
  display: inline-flex;
  align-items: center;
  width: fit-content;
  align-self: flex-start;
  margin-top: 2px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(1, 210, 129, 0.15);
  color: ${color('brand.primary')};
`;

const AddrSub = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.500')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 86vw;
`;

const MoreBtn = styled.button`
  margin-left: auto;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;

  display: inline-flex;
  align-items: center;
  justify-content: center;
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

const AddrSubBracket = styled.div`
  ${typo('subtitle1')};
  color: ${color('black')};
`;
