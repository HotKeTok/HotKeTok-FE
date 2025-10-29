// src/templates/tenant/my/MyPageTemplate.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Column, Row } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import { Page } from '../../../styles/layout';

import AvatarImg from '../../../assets/common/icon-profile-default.svg';
import iconPencil from '../../../assets/my/icon-pencil.svg';
import iconPencilGreen from '../../../assets/my/icon-pencil-green.svg';
import iconChevron from '../../../assets/repair/icon-chevron.svg';

// ✅ 공통 바텀시트
import BottomSheet from '../../../components/common/BottomSheet';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../../store/useAuthStore';
import useChatStore from '../../../store/useChatStore';

/**
 * ✅ API 연동 버전 (UI 변경 없음)
 * props:
 * - user: { name, phoneNumber, logInId, address }
 * - loading, error, saving
 * - onSaveProfile(nextName, imageFile)
 * - onChangeCurrentAddress(payload)
 */
export default function MyPageTemplate({
  user = { name: '', phoneNumber: '', logInId: '', address: '', profileImage: '' },
  loading = false,
  error = null,
  saving = false,
  onSaveProfile,
}) {
  const logout = useAuthStore(s => s.logout);
  const disconnect = useChatStore(s => s.disconnect);
  const [name, setName] = useState(user?.name || '핫케톡');
  const [avatar, setAvatar] = useState(user?.profileImage || AvatarImg);
  const [avatarFile, setAvatarFile] = useState(null);

  // 바텀시트 상태
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editAvatar, setEditAvatar] = useState(avatar);

  const nav = useNavigate();

  //  API로부터 유저정보 들어오면 UI 반영
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  //  서버에서 넘어온 프로필 이미지가 바뀌면 즉시 반영
  useEffect(() => {
    if (user?.profileImage) {
      setAvatar(user.profileImage);
    } else {
      setAvatar(AvatarImg);
    }
  }, [user?.profileImage]);

  //  objectURL 메모리 누수 방지 (파일 미리보기 사용 후 revoke)
  useEffect(() => {
    return () => {
      if (avatarFile && typeof avatar === 'string' && avatar.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(avatar);
        } catch {}
      }
    };
  }, [avatar, avatarFile]);

  const openSheet = () => {
    setEditName(name);
    setEditAvatar(avatar);
    setOpen(true);
  };
  const closeSheet = () => setOpen(false);

  // ✅ 저장 클릭 시 API 호출 연결
  const handleSave = async () => {
    setName(editName);
    setAvatar(editAvatar);
    setOpen(false);

    if (typeof onSaveProfile === 'function') {
      await onSaveProfile(editName, avatarFile);
    }
  };

  const moveAddressAdmin = () => {
    nav('/address-admin');
  };

  const handleLogout = () => {
    disconnect(); // 채팅 연결 해제
    logout(); // 로그아웃
    nav('/sign-in');
  };

  // ✅ 로딩 상태
  if (loading)
    return (
      <Page>
        <PageWrapper>
          <Header>
            <RowForTopBar $justify="center" $align="center">
              <Title>마이페이지</Title>
            </RowForTopBar>
          </Header>
          <MiddleSection>
            <Content>불러오는 중...</Content>
          </MiddleSection>
        </PageWrapper>
      </Page>
    );

  // ✅ 에러 상태
  if (error)
    return (
      <Page>
        <PageWrapper>
          <Header>
            <RowForTopBar $justify="center" $align="center">
              <Title>마이페이지</Title>
            </RowForTopBar>
          </Header>
          <MiddleSection>
            <Content style={{ color: 'red' }}>정보를 불러오지 못했습니다.</Content>
          </MiddleSection>
        </PageWrapper>
      </Page>
    );

  return (
    <Page>
      <PageWrapper>
        <Header>
          <RowForTopBar $justify="center" $align="center">
            <Title>마이페이지</Title>
          </RowForTopBar>
        </Header>

        <MiddleSection>
          <Avatar src={avatar} />
          <Column $gap={20}>
            <Column $gap={24}>
              <Row $justify="space-between">
                <Label>이름</Label>
                <Content>{user?.name || name}</Content>
              </Row>
              <Row $justify="space-between">
                <Label>휴대폰 번호</Label>
                <Content>{user?.phoneNumber || '010-1234-1234'}</Content>
              </Row>
              <Row $justify="space-between">
                <Label>아이디</Label>
                <Content>{user?.logInId || 'soongsil123'}</Content>
              </Row>
            </Column>
            <EditButton onClick={openSheet}>프로필 편집</EditButton>
          </Column>
        </MiddleSection>

        <EndSection>
          <Column $gap={30}>
            <Column $gap={10}>
              <Row $justify="space-between">
                <Label>주소</Label>
                <MoveText onClick={moveAddressAdmin}>
                  주소관리 <img src={iconChevron} alt=">" />
                </MoveText>
              </Row>
              <CurrentAddress>{user?.address}</CurrentAddress>
            </Column>
            <Row $justify="space-between">
              <Label>수리내역</Label>
              <MoveText
                onClick={() => {
                  nav('/repair-history');
                }}
              >
                조회하기 <img src={iconChevron} alt=">" />
              </MoveText>
            </Row>
          </Column>
          <Column style={{ marginTop: 30, cursor: 'pointer' }} onClick={handleLogout}>
            <div>로그아웃</div>
          </Column>
        </EndSection>

        {/* ===== 바텀시트 ===== */}
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
                      setAvatarFile(file);
                    }
                  }}
                />
                <PencilIconGreen src={iconPencilGreen} />
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
                    <PencilIcon src={iconPencil} />
                  </InlineIcon>
                </InputBox>
              </Field>

              <Field>
                <Row $justify="space-between">
                  <FieldLabel>휴대폰 번호</FieldLabel>
                  <IdValue>{user?.phoneNumber || '010-1234-1234'}</IdValue>
                </Row>
              </Field>

              <Row $justify="space-between">
                <FieldLabel>아이디</FieldLabel>
                <IdValue>{user?.logInId || 'soongsil123'}</IdValue>
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
        <div style={{ flex: '1', backgroundColor: '#fff' }} />
      </PageWrapper>
    </Page>
  );
}
/* ===== 스타일 ===== */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const Header = styled.div`
  width: 100%;
  padding-top: 52px;
  background-color: white;
`;

const RowForTopBar = styled(Row)`
  padding: 0px 6px 4.5px 6px;
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
  margin-bottom: 8px;
`;

const Avatar = styled.img`
  display: flex;
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

const EditButton = styled.div`
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

const EndSection = styled.div`
  display: flex;
  padding: 24px 24px 0px 24px;
  background: #fff;
  flex-direction: column;
`;

const MoveText = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
  cursor: pointer;
  display: inline-flex; // ✅ 텍스트 + 이미지 줄바꿈 방지
  align-items: center;
  gap: 4px; // ✅ 아이콘 간격 조정
  white-space: nowrap; // ✅ 전체 줄바꿈 방지
`;

const CurrentAddress = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
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
  margin-top: auto; // ✅ 남은 공간 밀어내기
  background: #fff;
  padding-bottom: 30px;
`;

const SaveButton = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 14px;
  background: ${color('brand.primary')};
  color: #fff;
  ${typo('button1')};
  cursor: pointer;
`;
