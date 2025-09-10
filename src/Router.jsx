// src/Router.jsx
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

<<<<<<< HEAD
import SignIn from './pages/onboard/SignIn';
import SignUp from './templates/onboard/SignUpTemplate';
import InitProcess from './pages/onboard/InitProcess';

import Home from './pages/Home';

import RepairHome from './pages/repair/RepairHome';
import RequestRepair from './pages/repair/RequestRepair';

import Communication from './pages/Communication';

import MyPage from './pages/MyPage';
import NavBar from './components/common/NavBar';

// 하단 바를 숨기고 싶은 경로
const HIDE_BOTTOM_BAR_PATHS = [
  '/splash',
  '/sign-in',
  '/sign-up',
  '/init-process',
  '/request-repair',
];

const AppShell = styled.div`
  --bar-h: 74px;
  --container-w: 390px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ $bg }) => $bg}; // ✅ 동적 배경
  border: 1px solid black; // 배경 하얀색인경우 경계가 안 보여서 border 임시로 추가(배포전 삭제예정))
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  ${({ $hasBar }) =>
    $hasBar
      ? css`
          padding-bottom: calc(var(--bar-h) + env(safe-area-inset-bottom));
        `
      : css`
          padding-bottom: 0;
        `}
`;

const BottomBar = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: min(100%, var(--container-w));
  height: 74px;
  display: flex;
  align-items: center;
  background: #fff;
  border-top: 1px solid #eee;
  z-index: 100;
`;
=======
// 로그인 관련
import SignIn from './pages/SignIn';
import SignUp from './templates/SignUpTemplate';
import InitProcess from './pages/InitProcess';
// main 관련
import Main from './pages/main/index'
import Bills from './pages/main/Bills'
import Notice from './pages/main/Notice'
import NoticeDetail from './pages/main/NoticeDetail'
import Alarm from './pages/main/Alarm'
// 뚝딱 관련
import Repair from './pages/Repair'
// 똑똑 관련
import Communication from './pages/Communication'
// 마이 관련
import MyPage from './pages/MyPage'
// 컴포넌트
import NavBar from './components/common/NavBar'
import IndexWelcome from './pages/main/IndexWelcome';

import { AppShell, MainContainer, BottomBar, HIDE_BOTTOM_BAR_PATHS, BOTTOM_BAR_HEIGHT } from './styles/layout';
>>>>>>> develop

const Layout = () => {
  const { pathname } = useLocation();
  const hideBar = HIDE_BOTTOM_BAR_PATHS.includes(pathname);

  // ✅ 특정 페이지 배경 조건
  const bgColor =
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/init-process' ||
    pathname === '/request-repair'
      ? '#ffffff'
      : '#f9f9f9';

  return (
    <AppShell $bg={bgColor}>
      <MainContainer $hasBar={!hideBar}>
        <Outlet />
      </MainContainer>
      {!hideBar && (
        <BottomBar>
          <NavBar />
        </BottomBar>
      )}
    </AppShell>
  );
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
<<<<<<< HEAD
          {/* 메인페이지 */}
          <Route path="/" element={<Home />} />

          {/* 온보딩 */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/init-process" element={<InitProcess />} />

          {/* 똑똑 */}
=======
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/" element={<Main />} />
          <Route path="/welcome" element={<IndexWelcome />} />
          <Route path="/main/bills" element={<Bills />} />
          <Route path="/main/alarm" element={<Alarm />} />
          <Route path="/main/notice" element={<Notice />} />
          <Route path="/main/notice/:id" element={<NoticeDetail />} />
>>>>>>> develop
          <Route path="/communication" element={<Communication />} />

          {/* 뚝딱 */}
          <Route path="/repair" element={<RepairHome />} />
          <Route path="/request-repair" element={<RequestRepair />} />

          {/* 마이페이지 */}
          <Route path="/my-page" element={<MyPage />} />

          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
