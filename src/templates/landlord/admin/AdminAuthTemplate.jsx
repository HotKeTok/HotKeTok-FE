import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
import AuthEmpty from '../../../assets/landlord/admin/Empty_Auth.svg?react';
import { EXAMPLE_AUTH_REQUEST } from '../../../mocks/landlord/AdminAuth';
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
 * @param {Function} onRefresh - (선택) 새로고침
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

  // 데이터 소스: props.items 우선, 비어있으면 기존 mock fallback
  const data = Array.isArray(items) && items.length > 0 ? items : EXAMPLE_AUTH_REQUEST;

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
        ) : data.length === 0 ? (
          <Column $justify="center" $align="center" style={{ height: '100%' }}>
            <AuthEmpty />
            <H2 style={{ marginTop: 16 }}>입주민 승인 요청</H2>
            <Body1>입주민 승인 요청을 받으면 여기에 표시됩니다.</Body1>
          </Column>
        ) : (
          <div style={{ padding: '30px 20px' }}>
            <Title>입주민 승인 요청</Title>
            <Column $justify="flex-start" $align="center" style={{ gap: 6, marginTop: 20 }}>
              {data.map(item => (
                <AuthItem
                  key={item.houseId ?? item.id}
                  name={item.name}
                  address={item.houseNumber ?? item.address}
                  phone={item.phoneNumber ?? item.phone}
                  onConfirm={() =>
                    openModal(
                      MODAL_STATE[0],
                      item.houseId ?? item.id,
                      item.name,
                      item.houseNumber ?? item.address
                    )
                  }
                  onDelete={() =>
                    openModal(
                      MODAL_STATE[1],
                      item.houseId ?? item.id,
                      item.name,
                      item.houseNumber ?? item.address
                    )
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
  ${typo('h2')};
  color: ${color('grayscale.600')};
`;
const Body1 = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.600')};
`;
