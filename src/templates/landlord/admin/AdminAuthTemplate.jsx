import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
import AuthEmpty from '../../../assets/landlord/admin/Empty_Auth.svg?react';
import Topbar from '../../../components/common/TopBar';
import styled from 'styled-components';
import { typo, color } from '../../../styles/tokens';
import { Column } from '../../../styles/flex';
import AuthItem from '../../../components/admin/AuthItem';
import { useState } from 'react';
import ConfirmModal from '../../../components/common/ConfirmModal';

/**
 * @param {Array}    items   - 입주민 요청 목록 [{houseId,name,phoneNumber,houseNumber,profileImageUrl}]
 * @param {boolean}  loading - 로딩 여부
 * @param {Function} onConfirm - 승인 요청 핸들러 (houseId) => void
 * @param {Function} onDelete  - 거절 요청 핸들러 (houseId) => void
 * @param {Function} onRefresh - 새로고침 핸들러
 */
export default function AdminAuthTemplate({
  items = [],
  loading = false,
  onConfirm,
  onDelete,
  onRefresh,
}) {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState({}); // {state:'confirm'|'delete', key, name, address, label}

  const MODAL_STATE = [
    { state: 'confirm', label: '승인', onClick: onConfirm, confirmText: '승인하기' },
    { state: 'delete', label: '거절', onClick: onDelete, confirmText: '거절하기' },
  ];

  const onConfirmBtnClick = key => {
    if (modalContent.state === 'confirm') {
      onConfirm?.(key);
    } else if (modalContent.state === 'delete') {
      onDelete?.(key);
    }
    setModal(false);
  };

  const openModal = (modalState, key, name, address) => {
    setModalContent({ ...modalState, key, name, address });
    setModal(true);
  };

  // 전화번호 하이픈 포맷 함수
  function formatPhone(p) {
    if (!p) return '';
    const only = String(p).replace(/\D/g, '');
    if (only.length === 11) return `${only.slice(0, 3)}-${only.slice(3, 7)}-${only.slice(7)}`;
    if (only.length === 10) return `${only.slice(0, 3)}-${only.slice(3, 6)}-${only.slice(6)}`;
    return p;
  }

  return (
    <PageWithoutBottomBar>
      {modal && (
        <ConfirmModal
          isOpen={modal}
          title={`${modalContent?.name} - ${modalContent?.address} 님의`}
          description={`입주민 요청을 ${modalContent?.label}하시겠어요?`}
          onClose={() => setModal(false)}
          onConfirm={() => onConfirmBtnClick(modalContent?.key)}
          cancelText="아니요"
          confirmText={modalContent?.confirmText || '확인'}
        />
      )}

      <Topbar
        title="입주민 인증"
        right={onRefresh ? { text: '새로고침', onClick: onRefresh } : undefined}
      />

      <ScrollableNoBottomBarContent style={{ backgroundColor: '#f5f6f6' }}>
        {loading ? (
          <Column $justify="center" $align="center" style={{ height: '100%' }}>
            <Body1>불러오는 중...</Body1>
          </Column>
        ) : items.length === 0 ? (
          <Column $justify="center" $align="center" style={{ height: '100%' }}>
            <AuthEmpty />
            <H2 style={{ marginTop: 16 }}>입주민 승인 요청</H2>
            <Body1>입주민 승인 요청을 받으면 여기에 표시됩니다.</Body1>
          </Column>
        ) : (
          <div style={{ padding: '30px 20px' }}>
            <Title>입주민 승인 요청</Title>
            <Column $justify="flex-start" $align="center" style={{ gap: 6, marginTop: 20 }}>
              {items.map(item => (
                <AuthItem
                  key={item.houseId}
                  name={item.name}
                  address={item.houseNumber}
                  phone={formatPhone(item.phoneNumber)}
                  onConfirm={() =>
                    openModal(MODAL_STATE[0], item.houseId, item.name, item.houseNumber)
                  }
                  onDelete={() =>
                    openModal(MODAL_STATE[1], item.houseId, item.name, item.houseNumber)
                  }
                />
              ))}
            </Column>
          </div>
        )}
      </ScrollableNoBottomBarContent>
    </PageWithoutBottomBar>
  );
}

const Title = styled.div`
  ${typo('h2')}
`;

const H2 = styled.div`
  ${typo('h2')}
  color: ${color('grayscale.600')};
`;

const Body1 = styled.div`
  ${typo('body1')}
  color: ${color('grayscale.600')};
`;
