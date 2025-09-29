import { Page, PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
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
 *
 * @param {Function} onConfirm 입주민 승인 요청 확인 핸들러
 * @param {Function} onDelete 입주민 승인 요청 삭제(거절) 핸들러
 */
export default function AdminAuthTemplate({ onConfirm, onDelete }) {
  const [modal, setModal] = useState(false); // 모달 상태 관리
  const [modalContent, setModalContent] = useState({}); // 모달 상태 종류(승인 | 거절)과 클릭된 아이템의 값

  const MODAL_STATE = [
    {
      state: 'confirm',
      label: '승인',
      onClick: onConfirm,
    },
    {
      state: 'delete',
      label: '삭제',
      onClick: onDelete,
    },
  ];

  // 승인 혹은 거절 버튼을 눌렀을 때
  // key: 승인 요청 id
  const onConfirmBtnClick = key => {
    if (modalContent.state === 'confirm') {
      onConfirm(key); // key 값 전달하여 api 호출
      setModal(false);
    } else if (modalContent.state === 'delete') {
      onDelete(key); // key 값 전달하여 api 호출
      setModal(false);
    } else {
      return null;
    }
  };

  // (승인/삭제) state 값에 따라 모달 open
  const openModal = (modalContent, key, name, address) => {
    if (modalContent.state === 'confirm') {
      setModalContent({ ...modalContent, key: key, name: name, address: address });
      setModal(true);
    } else if (modalContent.state === 'delete') {
      setModalContent({ ...modalContent, key: key, name: name, address: address });
      setModal(true);
    } else {
      return null;
    }
  };

  return (
    <PageWithoutBottomBar>
      {modal && (
        <ConfirmModal
          isOpen={modal}
          title={`${modalContent.name} - ${modalContent.address} 님의`}
          description={`입주민 요청을 ${modalContent.label}하시겠어요?`}
          onClose={() => setModal(false)}
          onConfirm={onConfirmBtnClick}
          cancelText="아니요"
          confirmText="승인하기"
        />
      )}
      <Topbar title="입주민 인증" />
      <ScrollableNoBottomBarContent style={{ backgroundColor: '#f5f6f6' }}>
        {EXAMPLE_AUTH_REQUEST.length == 0 ? (
          <Column $justify="center" $align="center" style={{ height: '100%' }}>
            <AuthEmpty />
            <H2 style={{ marginTop: 16 }}>입주민 승인 요청</H2>
            <Body1>입주민 승인 요청을 받으면 여기에 표시됩니다.</Body1>
          </Column>
        ) : (
          <div style={{ padding: '30px 20px' }}>
            <Title>입주민 승인 요청</Title>
            <Column $justify="flex-start" $align="center" style={{ gap: 6, marginTop: 20 }}>
              {EXAMPLE_AUTH_REQUEST.map(item => (
                <AuthItem
                  key={item.id}
                  name={item.name}
                  address={item.address}
                  phone={item.phone}
                  onConfirm={() => openModal(MODAL_STATE[0], item.id, item.name, item.address)}
                  onDelete={() => openModal(MODAL_STATE[1], item.id, item.name, item.address)}
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
