// src/Router.jsx
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Home from './pages/Home';
import Communication from './pages/Communication';
import Repair from './pages/Repair';
import MyPage from './pages/MyPage';
import NavBar from './components/common/NavBar';
import SignIn from './pages/SignIn';
import SignUp from './templates/SignUpTemplate';
import InitProcess from './pages/InitProcess';

// 하단 바를 숨기고 싶은 경로
const HIDE_BOTTOM_BAR_PATHS = ['/splash', '/signIn', '/signUp', '/initprocess'];

const AppShell = styled.div`
  --bar-h: 56px;
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

const Layout = () => {
  const { pathname } = useLocation();
  const hideBar = HIDE_BOTTOM_BAR_PATHS.includes(pathname);

  // ✅ 특정 페이지 배경 조건
  const bgColor =
    pathname === '/signIn' || pathname === '/signUp' || pathname === '/initprocess'
      ? '#ffffff'
      : '#f9f9f9';

  return (
    <AppShell $bg={bgColor}>
      <Main $hasBar={!hideBar}>
        <Outlet />
      </Main>
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
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/initprocess" element={<InitProcess />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
