import styled, { css } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

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
  position: relative;
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

const OnboardingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 10; // NavItem 위에 위치하도록 z-index 설정
`;

const navItems = [
  {
    to: '/',
    label: '홈',
    Icon: HomeIcon,
    ActiveIcon: HomeIconActive,
    isActive: pathname =>
      pathname === '/' || pathname === '/welcome' || pathname.startsWith('/main'),
    roles: ['landlord', 'tenant'],
  },
  {
    to: '/repair',
    label: '뚝딱',
    Icon: RepairIcon,
    ActiveIcon: RepairIconActive,
    roles: ['landlord', 'tenant'],
  },
  {
    to: '/admin',
    label: '관리',
    Icon: AdminIcon,
    ActiveIcon: AdminIconActive,
    roles: ['landlord'],
  },
  {
    to: '/communication',
    label: '똑똑',
    Icon: CommunicationIcon,
    ActiveIcon: CommunicationIconActive,
    roles: ['tenant'],
  },
  {
    to: '/my-page',
    label: '마이',
    Icon: MyIcon,
    ActiveIcon: MyIconActive,
    roles: ['landlord', 'tenant'],
  },
];

export default function NavBar({ currentRole, onBoardingStageFlag }) {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const address = '서울특별시 강남구 영동대로 112길 46'; // TODO: 유저 주소로 변경
  const { pathname } = useLocation();

  const visibleNavItems = navItems.filter(item => item.roles.includes(currentRole));

  const renderNavItems = () =>
    visibleNavItems.map(({ to, label, Icon, ActiveIcon, isActive }) => {
      const active = isActive ? isActive(pathname) : pathname.startsWith(to);
      const IconComponent = active ? ActiveIcon : Icon;

      return (
        <NavItem key={to} to={to} $active={active} $role={currentRole}>
          <IconComponent />
          {label}
        </NavItem>
      );
    });

  return (
    <>
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        height="260px"
        children={<AuthModal address={address} currentRole={currentRole} />}
      />
      <Nav>
        {onBoardingStageFlag && <OnboardingOverlay onClick={() => setSheetOpen(true)} />}
        {renderNavItems()}
      </Nav>
    </>
  );
}
