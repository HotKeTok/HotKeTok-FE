import styled from 'styled-components';

/** 공통 상수 */

export const HIDE_BOTTOM_BAR_PATHS = [
  '/splash',
  '/sign-in',
  '/sign-up',
  '/init-process',
  '/notice',
  '/notice/:id',
  '/request-repair',
  '/repair-progress',
  '/repair-history',
  '/contractor-profile',
  '/write-review',
  '/message',
  '/alarm',
  '/admin/',
  '/chat',
];
export const HIDE_HEADER_PATHS = [];

export const CONTAINER_WIDTH = '390px';
export const BOTTOM_BAR_HEIGHT = '74px';
export const TOP_BAR_HEIGHT = '100px'; // 필요시 사용

export const AppShell = styled.div`
  --top-bar-h: ${TOP_BAR_HEIGHT};
  --inset-b: env(safe-area-inset-bottom, 0px);
  --bar-h: ${BOTTOM_BAR_HEIGHT};
  --bar-safe-h: calc(var(--bar-h) + var(--inset-b));

  --container-w: ${CONTAINER_WIDTH};

  min-height: 100vh;

  display: flex;
  flex-direction: column;

  /* 가운데 정렬 + 고정 폭 */
  width: 100%;
  max-width: var(--container-w);
  margin: 0 auto;

  background: ${({ $bg }) => $bg || '#fff'};

  /* 개발 중 경계 확인용 (배포 전 제거 예정) */
  border: 1px solid black;

  overflow: hidden;
`;

export const MainContainer = styled.main`
  flex: 1 1 auto;
  width: 100%;
  height: 100vh; // 높이 고정
  overflow: hidden;

  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 0px; // 스크롤바 숨김
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.15);
  }
`;

/**
 * 하단 네비게이션 바 컨테이너
 */
export const BottomBar = styled.footer`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);

  /* 고정 폭 컨테이너와 동일하게 */
  width: var(--container-w);
  height: var(--bar-h);

  display: flex;
  align-items: center;
  justify-content: stretch;

  background: #fff;
  border-top: 1px solid #eee;

  /* 컨텐츠 위에 떠 있게 */
  z-index: 1000;
`;

// 1-1. 페이지에서 import하여 사용하는 최상단 컴포넌트
// 추가: 바텀바가 있는 페이지에 한해 사용
export const Page = styled.section`
  width: 100%;
  padding-bottom: ${BOTTOM_BAR_HEIGHT}; // 전체 페이지에서 바텀바를 가리지 않기 위함
`;

// 1-2. 페이지에서 import하여 사용하는 최상단 컴포넌트
// 추가: 바텀바가 없는 페이지에 한해 사용
export const PageWithoutBottomBar = styled.section`
  width: 100%;
`;

// 2-1. 바텀바 있는 페이지에서 스크롤 필요한 경우 사용
// 주의: Page로 감싸고, 헤더와 같은 레벨에 import하여 사용.
export const ScrollableContent = styled.section`
  flex: 1 1 auto;
  height: calc(100vh - ${TOP_BAR_HEIGHT}); // 헤더 높이 고려한 높이
  padding-bottom: ${BOTTOM_BAR_HEIGHT}; // 바텀바 고려 하단 패딩

  overflow: auto;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.15);
  }
`;

// 2-2. 바텀바 없는 페이지에서 스크롤 가능한 컨테이너로 사용
// 주의: Page로 감싸고, 헤더와 같은 레벨에 import하여 사용.
export const ScrollableNoBottomBarContent = styled.section`
  flex: 1 1 auto;
  height: calc(100vh - ${TOP_BAR_HEIGHT}); // 헤더 높이 고려한 높이
  padding-bottom: 0;

  overflow: auto;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.15);
  }
`;

// 3-1. 바텀바가 없는 페이지에서 하단의 fixed된 버튼 컨테이너가 필요한 경우 사용
// 헤더, 페이지 컨테이너와 동일한 레벨에 import하여 사용.
// 주의: fixed이므로, 스크롤 컨텐츠 위에 떠 있게 됨.
export const BottomButtonContainer = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);

  /* 고정 폭 컨테이너와 동일하게 */
  width: var(--container-w);
  height: var(--bar-h);

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;
  border-top: 1px solid #eee;
  padding: 30px 25px;

  /* 컨텐츠 위에 떠 있게 */
  z-index: 1000;
`;
