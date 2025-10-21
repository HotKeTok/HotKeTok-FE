import { createGlobalStyle } from 'styled-components';
import { CONTAINER_WIDTH } from './layout';

const GlobalStyle = createGlobalStyle`
  :root {
    --background: #ffffff;
    --foreground: #000000;
    --vh: 100%; 
    --container-w: ${CONTAINER_WIDTH};
  }

  /* 기본 reset */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  #root {
    width: 100%;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    font-family: 'Pretendard Variable', 'Apple SD Gothic Neo', Arial, sans-serif;
    background: var(--background);
    color: var(--foreground);
  }

  button {
    background: inherit;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    border: 0;
    overflow: visible;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  /* 링크 기본 스타일 */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* 이미지 최대폭 */
  img, video, canvas, svg {
    max-width: 100%;
    display: block;
  }
    /* 스크롤바 전체 */
    ::-webkit-scrollbar {
    width: 4px;  /* 스크롤바의 너비 */
  }

  /* 스크롤바 트랙(배경) */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 스크롤바 핸들(움직이는 막대) */
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.15);
  }

  /* 핸들을 호버했을 때 */
  ::-webkit-scrollbar-thumb:hover {
    background: #777777;
    border: 2px solid #777777;
  }
  
`;

export default GlobalStyle;
