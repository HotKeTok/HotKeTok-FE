// src/Router.jsx
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';

// onboard 관련
import SignIn from './pages/onboard/SignIn';
import SignUp from './templates/onboard/SignUpTemplate';
import InitProcess from './pages/onboard/InitProcess';
// main 관련
import Main from './pages/main/index';
import Bills from './pages/main/Bills';
import Notice from './pages/main/Notice';
import NoticeDetail from './pages/main/NoticeDetail';
import Alarm from './pages/main/Alarm';
// 뚝딱 관련
import RepairHome from './pages/repair/RepairHome';
import RequestRepair from './pages/repair/RequestRepair';
import RepairProgress from './pages/repair/RepairProgress';
// 똑똑 관련
import Communication from './pages/Communication';
// 마이 관련
import MyPage from './pages/MyPage';
// 컴포넌트
import NavBar from './components/common/NavBar';
import IndexWelcome from './pages/main/IndexWelcome';

import {
  AppShell,
  MainContainer,
  BottomBar,
  HIDE_BOTTOM_BAR_PATHS,
  BOTTOM_BAR_HEIGHT,
} from './styles/layout';

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
          {/* onboard 관련 */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/init-process" element={<InitProcess />} />

          {/* main 관련 */}
          <Route path="/" element={<Main />} />
          <Route path="/welcome" element={<IndexWelcome />} />
          <Route path="/main/bills" element={<Bills />} />
          <Route path="/main/alarm" element={<Alarm />} />
          <Route path="/main/notice" element={<Notice />} />
          <Route path="/main/notice/:id" element={<NoticeDetail />} />

          {/* 뚝딱 관련*/}
          <Route path="/repair" element={<RepairHome />} />
          <Route path="/request-repair" element={<RequestRepair />} />
          <Route path="/repair-progress" element={<RepairProgress />} />

          {/* 똑똑 관련*/}
          <Route path="/communication" element={<Communication />} />

          {/* 마이 관련*/}
          <Route path="/my-page" element={<MyPage />} />

          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
