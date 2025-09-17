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
import ContractorProfile from './pages/repair/ContractorProfile';
import WriteReview from './pages/repair/WriteReview';

// 똑똑 관련
<<<<<<< HEAD
import Communication from './pages/Communication';
=======
import Communication from './pages/communication/Communication';
import Chat from './pages/communication/Chat';
import ChatRoom from './pages/communication/ChatRoom';
import Message from './pages/communication/Message';
import MessageDetail from './pages/communication/MessageDetail';
import MessageWrite from './pages/communication/MessageWrite';
>>>>>>> develop

// 마이 관련
import MyPage from './pages/my/MyPage';
import AddressAdmin from './pages/my/AddressAdmin';
import AddressAdminDetail from './pages/my/AddressAdminDetail';
import ExtraAddressRegister from './pages/my/ExtraAddressRegister';

// 컴포넌트
import NavBar from './components/common/NavBar';
import IndexWelcome from './pages/main/IndexWelcome';
import RepairHistory from './pages/repair/RepairHistory';

import { HIDE_BOTTOM_BAR_PATHS } from './styles/layout';
import { HIDE_HEADER_PATHS } from './styles/layout';
import { AppShell, MainContainer, BottomBar } from './styles/layout';

const Layout = () => {
  const { pathname } = useLocation();
  const hideBar = HIDE_BOTTOM_BAR_PATHS.map((path)=> pathname.startsWith(path)).includes(true)||
  pathname.startsWith('/address-admin') ||
  pathname.startsWith('/address/add');

  const isWhiteBg =
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/init-process' ||
    pathname === '/request-repair' ||
    pathname === '/repair-history' ||
    pathname === '/write-review' ||
    pathname.startsWith('/address-admin') ||
    pathname.startsWith('/address/add');
  const bgColor = isWhiteBg ? '#ffffff' : '#f9f9f9';

  // 헤더 유무/높이는 각 페이지 성격에 맞게 결정
  const hasHeader = !HIDE_HEADER_PATHS.includes(pathname);
  const headerHeight = 100; // 헤더 컴포넌트 높이(px)

  return (
    <AppShell $bg={bgColor}>
      <MainContainer $hasBar={!hideBar} $hasHeader={hasHeader} $headerHeight={headerHeight}>
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
          <Route path="/bills" element={<Bills />} />
          <Route path="/alarm" element={<Alarm />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />

          {/* 뚝딱 관련*/}
          <Route path="/repair" element={<RepairHome />} />
          <Route path="/request-repair" element={<RequestRepair />} />
          <Route path="/repair-progress" element={<RepairProgress />} />
          <Route path="/repair-history" element={<RepairHistory />} />
          <Route path="/contractor-profile" element={<ContractorProfile />} />
          <Route path="/write-review" element={<WriteReview />} />

          {/* 똑똑 관련*/}
          <Route path="/communication" element={<Communication />} />
          <Route path="/communication/chat" element={<Chat />} />
          <Route path="/communication/chat-room" element={<ChatRoom />} />
          <Route path="/message" element={<Message />} />
          <Route path="/message/detail/:id" element={<MessageDetail />} />
          <Route path="/message/write" element={<MessageWrite />} />

          {/* 마이 관련*/}
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/address-admin" element={<AddressAdmin />} />
          <Route path="/address-admin/:id" element={<AddressAdminDetail />} />
          <Route path="/address/add/:step" element={<ExtraAddressRegister />} />

          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
