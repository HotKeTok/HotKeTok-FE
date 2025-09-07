// src/components/common/NavBar.jsx
import styled, { css } from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

import HomeIcon from '../../assets/common/icon-home.svg?react'
import CommunicationIcon from '../../assets/common/icon-communication.svg?react'
import RepairIcon from '../../assets/common/icon-repair.svg?react'
import MyIcon from '../../assets/common/icon-my.svg?react'

import {typo, color} from '../../styles/tokens'
import { useState } from 'react'

import BottomSheet from './BottomSheet'
import { CONTAINER_WIDTH } from '../../styles/layout'
import AuthModal from '../main/index/AuthModal'

const Nav = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
`

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: ${color('grayscale.100')};
  ${typo('caption1')}
  flex: 1;

  color: ${({ $active }) => ($active ? '#222' : '#323232')};

  svg { width: 22px; height: 22px; }
  svg [stroke] {
    stroke: ${({ $active }) => ($active ? '#222' : '#323232')} !important;
    transition: stroke .2s ease;
  }

  ${({ $active }) =>
    $active &&
    css`
      svg * { fill: ${color('brand.primary')} !important; transition: fill .2s ease; }
    `}
`

export default function NavBar() {
  // TODO: 인증상태 확인 후 미인증 상태이면 바텀 시트 open
  const [open, setOpen] = useState(false);

  const address= "서울특별시 강남구 영동대로 112길 46"; // TODO: 유저 주소로 변경

  const { pathname } = useLocation()
  return (
    <Nav>
      <BottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        height="260px"          
        children={<AuthModal address={address}/>}
      ></BottomSheet>
      <NavItem to="/" $active={pathname === '/' || pathname === 'welcome'}>
        <HomeIcon />
        홈
      </NavItem>
      <NavItem to="/repair" $active={pathname === '/repair'}>
        <RepairIcon />
        뚝딱
      </NavItem>
      <NavItem to="/communication" $active={pathname === '/communication'}>
        <CommunicationIcon />
        똑똑
      </NavItem>
      <NavItem to="/my-page" $active={pathname === '/my-page'}>
        <MyIcon />
        마이
      </NavItem>
    </Nav>
  )
}
