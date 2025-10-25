import { useState } from 'react';
import { typo, color } from '../../../styles/tokens';
import styled from 'styled-components';
import OptionsMenu from '../../../components/common/OptionsMenu';
import Button from '../../../components/common/Button';
import ButtonSmall from '../../../components/common/ButtonSmall';
import {
  BottomButtonContainer,
  PageWithoutBottomBar,
  ScrollableNoBottomBarContent,
} from '../../../styles/layout';
import TopBar from '../../../components/common/TopBar';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { Column, Row } from '../../../styles/flex';
import ProfileDefault from '../../../assets/common/icon-profile-default.svg?react';
import { useNavigate } from 'react-router-dom';
import { formatPhoneNumber } from '../../../utils/number';

export default function AdminTenantsDetailTemplate({ tenantNumber, tenantInfo, updateTenantInfo }) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [callModal, setCallModal] = useState(false);
  const [memo, setMemo] = useState(tenantInfo?.houseMemo || '');
  const navigate = useNavigate();

  const menuOptions = [
    {
      label: '입주민 삭제',
      onClick: () => setDeleteModal(true),
    },
  ];

  const infoItems = [
    {
      label: '호수',
      text: tenantNumber,
    },
    {
      label: '이름',
      text: tenantInfo?.tenantInfo?.name,
    },
    {
      label: '휴대폰 번호',
      text: formatPhoneNumber(tenantInfo?.tenantInfo?.phoneNumber),
    },
  ];

  const handleDeleteConfirm = () => {
    setDeleteModal(false);
    navigate(-1);
  };

  const isMemoChanged = memo !== (tenantInfo.houseMemo || '');

  if (!tenantInfo) {
    return null;
  }

  const { name, phoneNumber, profileImageUrl } = tenantInfo.tenantInfo;
  return (
    <>
      <PageWithoutBottomBar
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        {deleteModal && (
          <ConfirmModal
            isOpen={deleteModal}
            title={`${name} - ${tenantNumber} 님을`}
            description="입주민 목록에서 삭제하시겠어요?"
            onClose={() => setDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            confirmText="삭제하기"
          />
        )}
        {callModal && (
          <ConfirmModal
            isOpen={callModal}
            title={`${name} - ${tenantNumber} 님에게\n 전화할까요?`}
            onClose={() => setCallModal(false)}
            onConfirm={() => {
              window.location.href = `tel:${phoneNumber}`;
              setCallModal(false);
            }}
            confirmText="전화하기"
          />
        )}
        <TopBar title="입주민 정보" rightComponent={<OptionsMenu options={menuOptions} />} />
        <ScrollableNoBottomBarContent>
          <Column>
            {/* 프로필 사진 */}
            <Row $justify="center" style={{ width: '100%', margin: '16px 0 34px 0' }}>
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={`${name}의 프로필`}
                  width={100}
                  height={100}
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <ProfileDefault width={100} height={100} />
              )}
            </Row>
            <Column $gap={24} style={{ width: '100%', padding: '0 24px' }}>
              {infoItems.map((item, index) => (
                <Row $justify="space-between" $align="center" key={index} style={{}}>
                  <Label>{item.label}</Label>
                  <Text style={{ marginTop: '8px' }}>{item.text}</Text>
                </Row>
              ))}
              {/* 메모 & 편집 영역 */}
              <Column $gap={6} style={{ width: '100%' }}>
                <Label>메모</Label>
                <Column>
                  <TextArea
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                    placeholder="입주민에 대한 메모를 남겨주세요."
                  />
                  <TextLength>{memo.length}/300</TextLength>
                </Column>
                {/* 텍스트 에리아 */}
                <Column style={{ width: '100%', alignItems: 'flex-end' }}>
                  <ButtonSmall
                    style={{ width: '100%' }}
                    text="편집 완료"
                    width={80}
                    active={isMemoChanged}
                    onClick={() => updateTenantInfo(tenantNumber, { houseMemo: memo })}
                  />
                </Column>
              </Column>
            </Column>
          </Column>
        </ScrollableNoBottomBarContent>
      </PageWithoutBottomBar>
      <BottomButtonContainer style={{ justifyContent: 'space-between' }}>
        <ButtonSmall text="전화하기" width="48%" height={50} onClick={() => setCallModal(true)} />
        <Button text="1:1 채팅하기" width="48%" height={50} />
      </BottomButtonContainer>
    </>
  );
}

const Label = styled.div`
  ${typo('body1')}
  color: ${color('grayscale.600')}
`;

const Text = styled.div`
  ${typo('subtitle1')}
  color: ${color('grayscale.800')}
`;

const TextArea = styled.textarea`
  background-color: ${color('grayscale.100')};
  width: 100%;
  height: 96px;
  padding: 12px 16px;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 10px;
  resize: none;
  ${typo('body1')}
  color: ${color('grayscale.800')};

  &::placeholder {
    color: ${color('grayscale.400')};
  }

  &:focus {
    outline: none;
    border: 1px solid ${color('primary.500')};
  }
`;

const TextLength = styled.div`
  width: 100%;
  text-align: end;

  ${typo('caption2')}
  color: ${color('grayscale.400')}
`;
