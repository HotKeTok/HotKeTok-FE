// src/templates/my/AddressAdminTemplate.jsx
import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { Column, Row, Spacer } from '../../styles/flex';
import { color, typo } from '../../styles/tokens';
import { Page } from '../../styles/layout';

import TopBar from '../../components/common/TopBar';
import BottomSheet from '../../components/common/BottomSheet';
import Button from '../../components/common/Button';

import iconChevron from '../../assets/repair/icon-chevron.svg';
import iconPlus from '../../assets/my/address-admin/icon-plus.svg';
import iconHouse from '../../assets/my/address-admin/icon-house.svg';
import iconCompany from '../../assets/my/address-admin/icon-building.svg';
import iconEtc from '../../assets/my/address-admin/icon-location.svg';

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

function noteKeyToLabel(k) {
  const f = ALLOWED_NOTES.find(n => n.key === k);
  return f ? f.label : k;
}

// ----------------------------------------------------------
// 메인 컴포넌트
// ----------------------------------------------------------
export default function AddressAdminTemplate() {
  const [items, setItems] = useState(ADDRESS_LIST_MOCK);
  const [editId, setEditId] = useState(null);
  const editing = useMemo(() => items.find(x => x.id === editId) || null, [items, editId]);

  const openEdit = id => setEditId(id);
  const closeEdit = () => setEditId(null);

  const setCurrentAddress = id => {
    setItems(prev => prev.map(it => ({ ...it, isCurrent: it.id === id })));
  };

  const handleSaveEdit = draft => {
    setItems(prev => prev.map(it => (it.id === draft.id ? { ...it, ...draft } : it)));
    closeEdit();
  };

  const handleDeleteAddress = id => {
    setItems(prev => prev.filter(it => it.id !== id));
    closeEdit();
  };

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
              onClickEdit={() => openEdit(addr.id)}
            />
          ))}
        </Column>
      </Container>

      {/* 편집 시트 */}
      {editing && (
        <EditSheet
          data={editing}
          onClose={closeEdit}
          onSave={handleSaveEdit}
          onDelete={handleDeleteAddress}
        />
      )}
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

  const noteChips = [...neighborNotes.map(noteKeyToLabel), ...(extraNotes ? [extraNotes] : [])];

  return (
    <Card $active={isCurrent} onClick={onClickBox}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

          {noteChips.length > 0 && (
            <>
              <Spacer h={6} />
              <Row style={{ gap: 6, flexWrap: 'wrap' }}>
                {noteChips.map((t, i) => (
                  <NoteChip key={`${t}-${i}`}>{t}</NoteChip>
                ))}
              </Row>
            </>
          )}
        </Column>

        <EditBtn
          type="button"
          aria-label="주소 정보 수정"
          onClick={e => {
            e.stopPropagation();
            onClickEdit();
          }}
        >
          <img src={iconChevron} alt="" />
        </EditBtn>
      </Row>
    </Card>
  );
}

// ----------------------------------------------------------
// 하위: 편집 바텀시트
// ----------------------------------------------------------
function EditSheet({ data, onClose, onSave, onDelete }) {
  const [placeType, setPlaceType] = useState(data.placeType);
  const [customPlaceName, setCustomPlaceName] = useState(data.customPlaceName || '');
  const [neighborNotes, setNeighborNotes] = useState(data.neighborNotes || []);
  const [extraNotes, setExtraNotes] = useState(data.extraNotes || '');
  const [extraDraft, setExtraDraft] = useState('');

  const applyPlace = key => setPlaceType(key);

  const toggleNote = key => {
    setNeighborNotes(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
  };

  const addExtra = () => {
    const v = (extraDraft || '').trim();
    if (!v) return;
    setExtraNotes(v);
    setExtraDraft('');
  };

  const handleSave = () => {
    const alias =
      placeType === 'HOME'
        ? '우리집'
        : placeType === 'WORK'
        ? '공유오피스'
        : customPlaceName || '기타';

    onSave({
      ...data,
      placeType,
      placeTypeLabel: PLACE_TYPES.find(p => p.key === placeType)?.label || '기타',
      customPlaceName: placeType === 'ETC' ? customPlaceName : '',
      alias,
      neighborNotes,
      extraNotes,
    });
  };

  return (
    <BottomSheet isOpen={true} onClose={onClose} height="70dvh">
      <SheetWrap>
        <SheetTitle>주소 상세</SheetTitle>

        {/* 주소 고정표시 */}
        <AddressBox>
          <AddrMain>{data.address1}</AddrMain>
          {data.address2 ? <AddrSubText>{data.address2}</AddrSubText> : null}
          {data.lot ? <AddrLotText>{data.lot}</AddrLotText> : null}
        </AddressBox>

        <Section>
          <SecTitle>주소 분류</SecTitle>
          <Row style={{ gap: 8 }}>
            {PLACE_TYPES.map(p => (
              <SelectBtn
                key={p.key}
                $active={placeType === p.key}
                onClick={() => applyPlace(p.key)}
              >
                {p.label}
              </SelectBtn>
            ))}
          </Row>

          {placeType === 'ETC' && (
            <>
              <Spacer h={8} />
              <EtcInput
                placeholder="장소명을 입력하세요 (예: 본가, 학원)"
                value={customPlaceName}
                onChange={e => setCustomPlaceName(e.target.value)}
                maxLength={15}
              />
            </>
          )}
        </Section>

        <Section>
          <SecTitle>이웃에게 한마디</SecTitle>
          <HelpText>다중 선택이 가능해요.</HelpText>
          <Spacer h={8} />
          <Row style={{ gap: 8, flexWrap: 'wrap' }}>
            {ALLOWED_NOTES.map(n => (
              <ToggleChip
                key={n.key}
                type="button"
                $active={neighborNotes.includes(n.key)}
                onClick={() => toggleNote(n.key)}
              >
                {n.label}
              </ToggleChip>
            ))}
          </Row>

          <Spacer h={10} />
          <Row style={{ gap: 8, alignItems: 'center' }}>
            <ToggleChip as="div" $active={Boolean(extraNotes)}>
              직접 입력
            </ToggleChip>
            <ExtraInput
              placeholder="예: 8시 이후 소음 자제 부탁"
              value={extraDraft}
              onChange={e => setExtraDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addExtra();
              }}
            />
            <SmallBtn type="button" onClick={addExtra}>
              추가
            </SmallBtn>
            {extraNotes && (
              <SmallGhost
                type="button"
                onClick={() => setExtraNotes('')}
                aria-label="직접입력 제거"
              >
                제거
              </SmallGhost>
            )}
          </Row>

          {extraNotes && (
            <>
              <Spacer h={8} />
              <Row style={{ gap: 6, flexWrap: 'wrap' }}>
                <NoteChip>{extraNotes}</NoteChip>
              </Row>
            </>
          )}
        </Section>

        <Spacer h={16} />
        <Button onClick={handleSave}>수정하기</Button>
        <Spacer h={10} />
        <DangerBtn onClick={() => onDelete(data.id)}>주소 삭제</DangerBtn>
      </SheetWrap>
    </BottomSheet>
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
  padding: 14px 14px 12px;
  background: #fff;
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
  padding: 2px 6px;
  border-radius: 30px;
  background: ${p => (p.$state === 'done' ? color('grayscale.700') : color('orange.400'))};
  color: ${p => (p.$state === 'done' ? color('white') : color('grayscale.500'))};
  border: 1px solid ${p => (p.$state === 'done' ? color('grayscale.800') : color('grayscale.500'))};
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
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  flex: 0 0 auto;

  img {
    width: 20px;
    height: 20px;
    transform: rotate(-90deg); /* 오른쪽 화살표 느낌 */
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
