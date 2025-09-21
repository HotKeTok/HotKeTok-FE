import styled, { css } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

// Import your icons
import HomeIcon from '../../assets/common/icon-home.svg?react';
import CommunicationIcon from '../../assets/common/icon-communication.svg?react';
import RepairIcon from '../../assets/common/icon-repair.svg?react';
import AdminIcon from '../../assets/common/icon-admin.svg?react';
import MyIcon from '../../assets/common/icon-my.svg?react';
import HomeIconActive from '../../assets/common/icon-home-active.svg?react';
import CommunicationIconActive from '../../assets/common/icon-communication-active.svg?react';
import RepairIconActive from '../../assets/common/icon-repair-active.svg?react';
import AdminIconActive from '../../assets/common/icon-admin-active.svg?react';
import MyIconActive from '../../assets/common/icon-my-active.svg?react';

import { typo, color } from '../../styles/tokens';
import { BOTTOM_BAR_HEIGHT } from '../../styles/layout';
import BottomSheet from './BottomSheet';
import AuthModal from '../main/index/AuthModal';

const Nav = styled.nav`
  width: 100%;
  height: ${BOTTOM_BAR_HEIGHT};
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  flex: 1;
  ${({ $role }) =>
    $role === 'landlord'
      ? css`
          ${typo('button2')}
        `
      : css`
          ${typo('caption1')}
        `}

  color: ${({ $active }) => ($active ? color('brand.primary') : color('grayscale.700'))};

  svg {
    width: 22px;
    height: 22px;
  }
`;

export default function NavBar({ currentRole }) {
  const [open, setOpen] = useState(false);
  const address = '서울특별시 강남구 영동대로 112길 46'; // TODO: 유저 주소로 변경
  const { pathname } = useLocation();

  // Define active states for clarity
  const isHomeActive = pathname === '/' || pathname === '/welcome' || pathname.startsWith('/main');
  const isRepairActive = pathname.startsWith('/repair');
  const isAdminActive = pathname.startsWith('/admin');
  const isCommunicationActive = pathname.startsWith('/communication');
  const isChatActive = pathname.startsWith('/chat');
  const isMyPageActive = pathname.startsWith('/my-page');

  return (
    <Nav>
      <BottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        height="260px"
        children={<AuthModal address={address} />}
      />

      <NavItem to="/" $active={isHomeActive} $role={currentRole}>
        {isHomeActive ? <HomeIconActive /> : <HomeIcon />}홈
      </NavItem>

      <NavItem to="/repair" $active={isRepairActive} $role={currentRole}>
        {isRepairActive ? <RepairIconActive /> : <RepairIcon />}
        뚝딱
      </NavItem>

      {currentRole === 'landlord' && (
        <NavItem to="/admin" $active={isAdminActive} $role={currentRole}>
          {isAdminActive ? <AdminIconActive /> : <AdminIcon />}
          관리
        </NavItem>
      )}

      {currentRole === 'tenant' ? (
        <NavItem to="/communication" $active={isCommunicationActive} $role={currentRole}>
          {isCommunicationActive ? <CommunicationIconActive /> : <CommunicationIcon />}
          똑똑
        </NavItem>
      ) : (
        <NavItem to="/chat" $active={isChatActive} $role={currentRole}>
          {isChatActive ? <CommunicationIconActive /> : <CommunicationIcon />}
          채팅
        </NavItem>
      )}

      <NavItem to="/my-page" $active={isMyPageActive} $role={currentRole}>
        {isMyPageActive ? <MyIconActive /> : <MyIcon />}
        마이
      </NavItem>
    </Nav>
  );
}
