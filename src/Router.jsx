// src/Router.jsx
import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';

// 공통 관련
import SignIn from './pages/common/SignIn';
import SignUp from './pages/common/SignUp';
import InitProcess from './pages/common/InitProcess';
import VendorProfile from './pages/common/VendorProfile';
import WriteReview from './pages/common/WriteReview';

// landlord(집주인) 관련
import AlarmLandlord from './pages/landlord/main/Alarm';
import MainLandlord from './pages/landlord/main/Index';
import RepairHomeLandlord from './pages/landlord/repair/L_RepairHome';
import RepairProgressLandlord from './pages/landlord/repair/L_RepairProgress';
import RepairHistoryLandlord from './pages/landlord/repair/L_RepairHistory';
import AdminAuth from './pages/landlord/admin/AdminAuth';
import AdminHome from './pages/landlord/admin/AdminHome';
import AdminNotice from './pages/landlord/admin/AdminNotice';
import AdminNoticeDetail from './pages/landlord/admin/AdminNoticeDetail';
import AdminNoticeWrite from './pages/landlord/admin/AdminNoticeWrite';
import AdminTenantsInfo from './pages/landlord/admin/AdminTenantsInfo';
import AdminTenantsDetail from './pages/landlord/admin/AdminTenantsDetail';
import AdminCommonBills from './pages/landlord/admin/AdminCommonBills';
import AdminCommonBillsWrite from './pages/landlord/admin/AdminCommonBillsWrite';
import ChatLandlord from './pages/landlord/communication/Chat';
import ChatRoomLandlord from './pages/landlord/communication/ChatRoom';
import MyPageLandlord from './pages/landlord/my/L_MyPage';
import AddressAdminLandlord from './pages/landlord/my/L_AddressAdmin';
import ExtraAddressRegisterLandlord from './pages/landlord/my/L_ExtraAddressRegister';

// tenant(입주민) 관련
import Main from './pages/tenant/main/Index';
import Bills from './pages/tenant/main/Bills';
import Notice from './pages/tenant/main/Notice';
import NoticeDetail from './pages/tenant/main/NoticeDetail';
import Alarm from './pages/tenant/main/Alarm';
import RepairHome from './pages/tenant/repair/RepairHome';
import RequestRepair from './pages/tenant/repair/RequestRepair';
import RepairProgress from './pages/tenant/repair/RepairProgress';
import RepairHistory from './pages/tenant/repair/RepairHistory';
import Communication from './pages/tenant/communication/Communication';
import Chat from './pages/tenant/communication/Chat';
import ChatRoom from './pages/tenant/communication/ChatRoom';
import Message from './pages/tenant/communication/Message';
import MessageDetail from './pages/tenant/communication/MessageDetail';
import MessageWrite from './pages/tenant/communication/MessageWrite';
import MyPage from './pages/tenant/my/MyPage';
import AddressAdmin from './pages/tenant/my/AddressAdmin';
import AddressAdminDetail from './pages/tenant/my/AddressAdminDetail';
import ExtraAddressRegister from './pages/tenant/my/ExtraAddressRegister';

// 공통 컴포넌트/스타일
import NavBar from './components/common/NavBar';
import IndexWelcome from './pages/tenant/main/IndexWelcome';
import { HIDE_BOTTOM_BAR_PATHS } from './styles/layout';
import { HIDE_HEADER_PATHS } from './styles/layout';
import { AppShell, MainContainer, BottomBar } from './styles/layout';

// 상태
import { useAuthStore } from './store/useAuthStore';
import { getAccessToken } from './utils/auth';
import useChatStore from './store/useChatStore';

import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/* ---------- 인증 보호 ---------- */
const ProtectedRoute = () => {
  const token = getAccessToken();
  if (!token) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
};

/* ---------- 공통 레이아웃 (UI 변경 없음) ---------- */
const Layout = ({ currentRole, onBoardingStageFlag }) => {
  const { pathname } = useLocation();

  const WHITE_BG_ROUTES = {
    common: [
      '/sign-in',
      '/sign-up',
      '/init-process',
      '/address-admin',
      '/repair-history',
      '/write-review',
      '/',
    ],
    tenant: ['/request-repair'],
    landlord: ['/repair', '/admin'],
  };
  const matchesAnyExactly = patterns => patterns.some(p => pathname === p);

  const isWhiteBg =
    matchesAnyExactly(WHITE_BG_ROUTES.common) ||
    matchesAnyExactly(WHITE_BG_ROUTES[currentRole] || []);
  const bgColor = isWhiteBg ? '#ffffff' : '#f9f9f9';

  // 🔎 로그인/회원가입에서도 바텀바/헤더가 안 뜨도록 명시적으로 제외
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  const hideBar =
    isAuthPage ||
    HIDE_BOTTOM_BAR_PATHS.map(path => pathname.startsWith(path)).includes(true) ||
    pathname.startsWith('/address-admin') ||
    pathname.startsWith('/address/add');

  const hasHeader = !isAuthPage && !HIDE_HEADER_PATHS.includes(pathname);
  const headerHeight = 100;

  return (
    <AppShell $bg={bgColor}>
      <MainContainer $hasBar={!hideBar} $hasHeader={hasHeader} $headerHeight={headerHeight}>
        <Outlet />
      </MainContainer>
      {!hideBar && currentRole !== 'none' && (
        <BottomBar>
          <NavBar currentRole={currentRole} onBoardingStageFlag={onBoardingStageFlag} />
        </BottomBar>
      )}
    </AppShell>
  );
};

/* ---------- 라우터 ---------- */
export default function AppRouter() {
  const { accessToken, currentRole, hydrated, onBoardingStageFlag } = useAuthStore();
  const { connect, disconnect } = useChatStore(); // 웹소켓 연결 액션

  useEffect(() => {
    // accessToken이 존재하면 (로그인 성공 시) 웹소켓 연결
    if (accessToken !== '' && hydrated) {
      connect(accessToken);
    }

    // accessToken이 사라지면 (로그아웃 시) 웹소켓 연결 해제
    // useEffect의 클린업 함수를 활용
    return () => {
      disconnect();
    };
  }, [accessToken, connect, disconnect]);

  if (!hydrated) return null;

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 비로그인 허용이지만 GlobalStyle/Theme 그대로 적용되도록 Layout 안에서 렌더 */}
        <Route
          element={<Layout currentRole={currentRole} onBoardingStageFlag={onBoardingStageFlag} />}
        >
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        {/* 🔒 그 외 모든 경로 보호 */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={<Layout currentRole={currentRole} onBoardingStageFlag={onBoardingStageFlag} />}
          >
            {/* 공통 온보딩(보호됨) */}
            <Route path="/init-process" element={<InitProcess />} />

            {/* role === none */}
            {currentRole === 'none' && <Route path="/" element={<IndexWelcome />} />}

            {/* 집주인 */}
            {currentRole === 'landlord' && (
              <>
                <Route path="/" element={<MainLandlord />} />
                <Route path="/alarm" element={<AlarmLandlord />} />
                <Route path="/repair" element={<RepairHomeLandlord />} />
                <Route path="/repair-progress" element={<RepairProgressLandlord />} />
                <Route path="/repair-history" element={<RepairHistoryLandlord />} />
                <Route path="/vendor-profile" element={<VendorProfile />} />
                <Route path="/write-review" element={<WriteReview />} />
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/auth" element={<AdminAuth />} />
                <Route path="/notice" element={<AdminNotice />} />
                <Route path="/notice/:id" element={<AdminNoticeDetail />} />
                <Route path="/notice/write" element={<AdminNoticeWrite />} />
                <Route path="/admin/tenants" element={<AdminTenantsInfo />} />
                <Route path="/admin/tenants/detail/:id" element={<AdminTenantsDetail />} />
                <Route path="/admin/common-bills" element={<AdminCommonBills />} />
                <Route path="/admin/common-bills/write" element={<AdminCommonBillsWrite />} />
                <Route path="/chat" element={<ChatMainLandlord />} />
                <Route path="/chat/chat-room/:id" element={<ChatRoomLandlord />} />
                <Route path="/my-page" element={<MyPageLandlord />} />
                <Route path="/address-admin" element={<AddressAdminLandlord />} />
                <Route path="/address/add/:step" element={<ExtraAddressRegisterLandlord />} />
              </>
            )}

            {/* 입주민 */}
            {currentRole === 'tenant' && (
              <>
                <Route path="/" element={<Main />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/alarm" element={<Alarm />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/notice/:id" element={<NoticeDetail />} />
                <Route path="/repair" element={<RepairHome />} />
                <Route path="/request-repair" element={<RequestRepair />} />
                <Route path="/repair-progress" element={<RepairProgress />} />
                <Route path="/repair-history" element={<RepairHistory />} />
                <Route path="/vendor-profile" element={<VendorProfile />} />
                <Route path="/write-review" element={<WriteReview />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/chat-room" element={<ChatRoom />} />
                <Route path="/message" element={<Message />} />
                <Route path="/message/detail/:id" element={<MessageDetail />} />
                <Route path="/message/write" element={<MessageWrite />} />
                <Route path="/my-page" element={<MyPage />} />
                <Route path="/address-admin" element={<AddressAdmin />} />
                <Route path="/address-admin/:id" element={<AddressAdminDetail />} />
                <Route path="/address/add/:step" element={<ExtraAddressRegister />} />
              </>
            )}

            {/* Not Found */}
            <Route path="*" element={<div>Not Found</div>} />
          </Route>
        </Route>

        {/* 혹시 모를 예외 */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
