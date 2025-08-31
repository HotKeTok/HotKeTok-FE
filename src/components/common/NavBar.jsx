// src/components/common/NavBar.jsx
import styled, { css } from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

import HomeIcon from '../../assets/common/icon-home.svg?react'
import CommunicationIcon from '../../assets/common/icon-communication.svg?react'
import RepairIcon from '../../assets/common/icon-repair.svg?react'
import MyIcon from '../../assets/common/icon-my.svg?react'

import {typo, color} from '../../styles/tokens'

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
  const { pathname } = useLocation()
  return (
    <Nav>
      <NavItem to="/" $active={pathname === '/'}>
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
