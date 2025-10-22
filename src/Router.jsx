// src/Router.jsx
import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';

// 공통 관련
import SignIn from './pages/common/SignIn';
import SignUp from './pages/common/SignUp';
import InitProcess from './pages/common/InitProcess';

import VendorProfile from './pages/common/VendorProfile'; // 수리업체 정보 확인
import WriteReview from './pages/common/WriteReview'; // 후기 작성

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

// 공통 컴포넌트
import NavBar from './components/common/NavBar';
import IndexWelcome from './pages/tenant/main/IndexWelcome';
import { HIDE_BOTTOM_BAR_PATHS } from './styles/layout';
import { HIDE_HEADER_PATHS } from './styles/layout';
import { AppShell, MainContainer, BottomBar } from './styles/layout';

// ✅ Zustand 전역 상태
import { useAuthStore } from './store/useAuthStore';
import useChatStore from './store/useChatStore';

import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Layout = ({ currentRole }) => {
  const { pathname } = useLocation();

  const WHITE_BG_ROUTES = {
    common: [
      '/sign-in',
      '/sign-up',
      '/init-process',
      '/address-admin',
      '/address/add',
      '/repair-history',
      '/write-review',
    ],
    tenant: ['/request-repair'],
    landlord: ['/repair', '/admin'],
  };

  const startsWithAny = patterns => patterns.some(p => pathname === p || pathname.startsWith(p));
  const isWhiteBg =
    startsWithAny(WHITE_BG_ROUTES.common) || startsWithAny(WHITE_BG_ROUTES[currentRole] || []);
  const bgColor = isWhiteBg ? '#ffffff' : '#f9f9f9';

  const hideBar =
    HIDE_BOTTOM_BAR_PATHS.map(path => pathname.startsWith(path)).includes(true) ||
    pathname.startsWith('/address-admin') ||
    pathname.startsWith('/address/add');

  const hasHeader = !HIDE_HEADER_PATHS.includes(pathname);
  const headerHeight = 100;

  return (
    <AppShell $bg={bgColor}>
      <MainContainer $hasBar={!hideBar} $hasHeader={hasHeader} $headerHeight={headerHeight}>
        <Outlet />
      </MainContainer>
      {!hideBar && (
        <BottomBar>
          <NavBar currentRole={currentRole} />
        </BottomBar>
      )}
    </AppShell>
  );
};

export default function AppRouter() {
  // ✅ 하드코딩 제거, 전역 role 사용
  const { accessToken, currentRole, hydrated } = useAuthStore();
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

  // ✅ persist 복원 완료 전에는 렌더 지연(초기 깜빡임 방지)
  if (!hydrated) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout currentRole={currentRole} />}>
          {/* 공통 onboard 관련 */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/init-process" element={<InitProcess />} />

          {/* ✅ 현재 역할(role)에 따라 "같은 경로"를 다른 트리로 렌더링 (경로 변경 없음) */}
          {currentRole === 'landlord' ? (
            <>
              {/* 집주인 main */}
              <Route path="/" element={<MainLandlord />} />
              <Route path="/alarm" element={<AlarmLandlord />} />

              {/* 집주인 뚝딱 */}
              <Route path="/repair" element={<RepairHomeLandlord />} />
              <Route path="/repair-progress" element={<RepairProgressLandlord />} />
              <Route path="/repair-history" element={<RepairHistoryLandlord />} />
              {/* 공통 VendorProfile, WriteReview 사용 */}
              <Route path="/vendor-profile" element={<VendorProfile />} />
              <Route path="/write-review" element={<WriteReview />} />

              {/* 집주인 어드민 */}
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/auth" element={<AdminAuth />} />
              <Route path="/notice" element={<AdminNotice />} />
              <Route path="/notice/:id" element={<AdminNoticeDetail />} />
              <Route path="/notice/write" element={<AdminNoticeWrite />} />
              <Route path="/admin/tenants" element={<AdminTenantsInfo />} />
              <Route path="/admin/tenants/detail/:id" element={<AdminTenantsDetail />} />
              <Route path="/admin/common-bills" element={<AdminCommonBills />} />
              <Route path="/admin/common-bills/write" element={<AdminCommonBillsWrite />} />

              {/* 집주인 채팅 */}
              <Route path="/chat" element={<ChatLandlord />} />
              <Route path="/chat/chat-room/:id" element={<ChatRoomLandlord />} />

              {/* 집주인 마이 */}
              <Route path="/my-page" element={<MyPageLandlord />} />
              <Route path="/address-admin" element={<AddressAdminLandlord />} />
              <Route path="/address/add/:step" element={<ExtraAddressRegisterLandlord />} />
            </>
          ) : (
            <>
              {/* 입주민 main */}
              <Route path="/" element={<Main />} />
              <Route path="/welcome" element={<IndexWelcome />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/alarm" element={<Alarm />} />
              <Route path="/notice" element={<Notice />} />
              <Route path="/notice/:id" element={<NoticeDetail />} />

              {/* 입주민 뚝딱 */}
              <Route path="/repair" element={<RepairHome />} />
              <Route path="/request-repair" element={<RequestRepair />} />
              <Route path="/repair-progress" element={<RepairProgress />} />
              <Route path="/repair-history" element={<RepairHistory />} />
              {/* 공통 VendorProfile, WriteReview 사용 */}
              <Route path="/vendor-profile" element={<VendorProfile />} />
              <Route path="/write-review" element={<WriteReview />} />

              {/* 입주민 똑똑 */}
              <Route path="/communication" element={<Communication />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/chat-room/:id" element={<ChatRoom />} />
              <Route path="/message" element={<Message />} />
              <Route path="/message/detail/:id" element={<MessageDetail />} />
              <Route path="/message/write" element={<MessageWrite />} />

              {/* 입주민 마이 */}
              <Route path="/my-page" element={<MyPage />} />
              <Route path="/address-admin" element={<AddressAdmin />} />
              <Route path="/address-admin/:id" element={<AddressAdminDetail />} />
              <Route path="/address/add/:step" element={<ExtraAddressRegister />} />
            </>
          )}

          {/* Not Found */}
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
