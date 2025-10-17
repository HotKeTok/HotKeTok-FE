// src/templates/landlord/my/L_MyPageTemplate.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Column, Row } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import { Page } from '../../../styles/layout';

import AvatarImg from '../../../assets/my/img-profile.png';
import iconPencil from '../../../assets/my/icon-pencil.svg';
import iconPencilGreen from '../../../assets/my/icon-pencil-green.svg';
import iconChevron from '../../../assets/repair/icon-chevron.svg';

// 공통 컴포넌트
import BottomSheet from '../../../components/common/BottomSheet';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';

/**
 * 집주인 마이페이지 템플릿 (표시 전용)
 * @param {object} props
 * @param {{name:string, phoneNumber:string, logInId:string, address:string}} props.user
 * @param {boolean} props.loading
 * @param {any} props.error
 * @param {string} [props.addressManagePath='/address-admin'] - 주소관리 화면 라우팅 경로
 */
export default function L_MyPageTemplate({
  user = { name: '', phoneNumber: '', logInId: '', address: '' },
  loading = false,
  error = null,
  saving = false, // ✅ 추가
  onSaveProfile, // ✅ 추가
  onChangeCurrentAddress, // ✅ (선택) 추후 주소관리 연동용
  addressManagePath = '/address-admin',
}) {
  const nav = useNavigate();

  // 표시용 상태
  const [name, setName] = useState(user?.name || '집주인');
  const [avatar, setAvatar] = useState(AvatarImg);

  // 바텀시트 상태
  const [open, setOpen] = useState(false);

  // 편집값 (저장 전 분리)
  const [editName, setEditName] = useState(name);
  const [editAvatar, setEditAvatar] = useState(avatar);

  // 서버에서 내려온 user가 바뀌면 화면 표시값 동기화
  useEffect(() => {
    setName(user?.name || '집주인');
  }, [user?.name]);

  const openSheet = () => {
    setEditName(name);
    setEditAvatar(avatar);
    setOpen(true);
  };
  const closeSheet = () => setOpen(false);

  const handleSave = async () => {
    // 표시 반영
    setName(editName);
    setAvatar(editAvatar);

    // ✅ 서버 반영 (이름)
    if (typeof onSaveProfile === 'function') {
      await onSaveProfile(editName);
    }
    setOpen(false);
  };

  const moveAddressAdmin = () => nav(addressManagePath);

  // 로딩/에러 표시 (필요 시 스켈레톤 UI로 교체 가능)
  if (loading) {
    return (
      <Page>
        <PageWrapper>
          <Header>
            <RowForTopBar $justify="center" $align="center">
              <Title>마이페이지</Title>
            </RowForTopBar>
          </Header>
          <MiddleSection>
            <div>불러오는 중...</div>
          </MiddleSection>
        </PageWrapper>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <PageWrapper>
          <Header>
            <RowForTopBar $justify="center" $align="center">
              <Title>마이페이지</Title>
            </RowForTopBar>
          </Header>
          <MiddleSection>
            <div style={{ color: 'red' }}>정보를 불러오지 못했어요.</div>
          </MiddleSection>
        </PageWrapper>
      </Page>
    );
  }

  return (
    <Page>
      <PageWrapper>
        <Header>
          <RowForTopBar $justify="center" $align="center">
            <Title>마이페이지</Title>
          </RowForTopBar>
        </Header>

        <MiddleSection>
          <Avatar src={avatar} alt="프로필" />
          <Column $gap={20}>
            <Column $gap={24}>
              <Row $justify="space-between">
                <Label>이름</Label>
                <Content>{name || '-'}</Content>
              </Row>
              <Row $justify="space-between">
                <Label>휴대폰 번호</Label>
                <Content>{user?.phoneNumber || '-'}</Content>
              </Row>
              <Row $justify="space-between">
                <Label>아이디</Label>
                <Content>{user?.logInId || '-'}</Content>
              </Row>
            </Column>
            <EditButton onClick={openSheet}>프로필 편집</EditButton>
          </Column>
        </MiddleSection>

        <SectionDivider />

        <EndSection>
          <Column $gap={18}>
            <Row $justify="space-between" $align="center">
              <Label>주소</Label>
              <MoveText onClick={moveAddressAdmin}>
                주소관리 <img src={iconChevron} alt=">" />
              </MoveText>
            </Row>

            {/* 현재 설정된 기본 주소 프리뷰 */}
            <AddressPreview>
              <Badge>현재 설정한 주소</Badge>
              <CurrentAddress>{user?.address || '등록된 기본 주소가 없습니다'}</CurrentAddress>
              {/* 필요 시 동(건물명) 분리 필드가 생기면 Subline에 표시 */}
              {!!user?.address ? <Subline /> : <Subline>주소관리에서 등록해 주세요</Subline>}
            </AddressPreview>

            <Row $justify="space-between" $align="center" style={{ marginTop: 12 }}>
              <Label>수리내역</Label>
              <MoveText>
                조회하기 <img src={iconChevron} alt=">" />
              </MoveText>
            </Row>
          </Column>
        </EndSection>

        {/* ===== 프로필 편집 바텀시트 ===== */}
        <BottomSheet isOpen={open} onClose={closeSheet} height="100dvh">
          <SheetBody>
            <SheetHandle />
            <SheetTitle>프로필 편집</SheetTitle>

            <AvatarWrap>
              <AvatarBig src={editAvatar} alt="프로필" />
              <EditBubble as="label">
                <HiddenFile
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setEditAvatar(url);
                    }
                  }}
                />
                <PencilIconGreen src={iconPencilGreen} alt="편집" />
              </EditBubble>
            </AvatarWrap>

            <Form>
              <Field>
                <FieldLabel>이름</FieldLabel>
                <InputBox>
                  <Input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="이름 입력"
                  />
                  <InlineIcon>
                    <PencilIcon src={iconPencil} alt="편집" />
                  </InlineIcon>
                </InputBox>
              </Field>

              <Field>
                <Row $justify="space-between">
                  <FieldLabel>휴대폰 번호</FieldLabel>
                  <IdValue>{user?.phoneNumber || '-'}</IdValue>
                </Row>
              </Field>

              <Row $justify="space-between">
                <FieldLabel>아이디</FieldLabel>
                <IdValue>{user?.logInId || '-'}</IdValue>
              </Row>
            </Form>

            <FooterSticky>
              <Button
                text={saving ? '저장 중...' : '저장'}
                onClick={handleSave}
                disabled={saving}
              />
            </FooterSticky>
          </SheetBody>
        </BottomSheet>

        <div style={{ flex: 1, backgroundColor: '#fff' }} />
      </PageWrapper>
    </Page>
  );
}

/* ===== 스타일 ===== */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: ${color('grayscale.0')};
`;

const Header = styled.div`
  width: 100%;
  padding-top: 52px;
  background-color: #fff;
`;

const RowForTopBar = styled(Row)`
  padding: 0 6px 4.5px 6px;
`;

const Title = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;

const MiddleSection = styled.div`
  display: flex;
  padding: 30px 24px 16px 24px;
  flex-direction: column;
  gap: 34px;
  background: #fff;
  margin-top: 6px;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 100px;
  border: 2.5px solid ${color('brand.primary')};
  align-self: center;
  object-fit: cover;
`;

const Label = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

const Content = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.800')};
`;

const EditButton = styled.button`
  display: flex;
  height: 42px;
  justify-content: center;
  align-items: center;
  ${typo('button2')};
  color: ${color('grayscale.600')};
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  cursor: pointer;
`;

const SectionDivider = styled.div`
  height: 8px;
  background: ${color('grayscale.100')};
`;

const EndSection = styled.div`
  display: flex;
  padding: 18px 24px 0 24px;
  background: #fff;
  flex-direction: column;
`;

const MoveText = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`;

const AddressPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 12px;
  border-radius: 12px;
  border: 1px solid ${color('grayscale.200')};
  background: ${color('grayscale.50')};
`;

const Badge = styled.span`
  align-self: flex-start;
  ${typo('caption2')};
  color: ${color('brand.primary')};
  border: 1px solid ${color('brand.primary')};
  background: #fff;
  padding: 2px 8px;
  border-radius: 999px;
`;

const CurrentAddress = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;

const Subline = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;

/* ===== 바텀시트 내부 ===== */
const SheetBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px 25px 16px 25px;
`;

const SheetHandle = styled.div`
  width: 60px;
  height: 5px;
  background: ${color('grayscale.300')};
  border-radius: 999px;
  align-self: center;
  margin: 5px 0 10px;
  cursor: pointer;
`;

const SheetTitle = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.600')};
  text-align: center;
  margin: 6px 0 18px;
`;

const AvatarWrap = styled.div`
  position: relative;
  align-self: center;
  z-index: 1;
`;

const AvatarBig = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid ${color('brand.primary')};
  align-self: center;
  z-index: 0;
`;

const EditBubble = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  right: 0px;
  bottom: -10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${color('brand.primary')};
  place-items: center;
  cursor: pointer;
  border: 2px solid #fff;
`;

const HiddenFile = styled.input`
  display: none;
`;

const PencilIcon = styled.img`
  width: 12px;
`;

const PencilIconGreen = styled.img`
  width: 18px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 22px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
`;

const InputBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: ${color('grayscale.100')};
  ${typo('body2')};
  color: ${color('grayscale.800')};
  border-radius: 6px;
  border: 1px solid ${color('grayscale.200')};
  display: flex;
  padding: 13px 15px;
  justify-content: center;
  align-items: center;
`;

const InlineIcon = styled.span`
  position: absolute;
  right: 12px;
  display: inline-flex;
  color: ${color('grayscale.500')};
`;

const IdValue = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  text-align: right;
`;

const FooterSticky = styled.div`
  margin-top: auto;
  background: #fff;
  padding-bottom: 30px;
`;
