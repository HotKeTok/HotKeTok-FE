import styled from "styled-components";

// 공통 스타일 컴포넌트를 정의합니다.

// 웹 앱 고정 너비
export const CONTAINER_WIDTH = '390px';

// 하단 바를 숨기고 싶은 경로
export const HIDE_BOTTOM_BAR_PATHS = ['/splash', '/signIn', '/signUp', '/initprocess'];

// 하단 바 높이
export const BOTTOM_BAR_HEIGHT = '74px';

export const AppShell = styled.div`
  --bar-h: ${BOTTOM_BAR_HEIGHT};
  --inset-b: env(safe-area-inset-bottom);
  --bar-safe-h: calc(var(--bar-h) + var(--inset-b));

  --container-w: 390px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ $bg }) => $bg}; // ✅ 동적 배경
  border: 1px solid black; // 배경 하얀색인경우 경계가 안 보여서 border 임시로 추가(배포전 삭제예정))

  overflow: hidden;
`;

export const MainContainer = styled.main`
  flex: 1 1 auto;
  overflow: auto;
  width: 100%;
`;

export const BottomBar = styled.footer`
  flex: 0 0 auto;
  height: var(--bar-safe-h);
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
  padding-bottom: env(safe-area-inset-bottom);

  width: min(100%, var(--container-w));

  background: #fff;
  border-top: 1px solid #eee;
  z-index: 100;
`;

/**
 * 템플릿의 최상위 부모 컨테이너입니다.
 * @params {boolean} $scroll - 
 * true일 경우 스크롤 가능한 컨테이너
 * false일 경우 스크롤 비활성화 컨테이너
 */
export const Page=  styled.section`
  ${({$scroll}) => ($scroll ? 'overflow: auto;' : 'overflow: hidden;')};
`