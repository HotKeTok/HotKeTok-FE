import { createGlobalStyle } from 'styled-components';
import { CONTAINER_WIDTH } from './layout';

const GlobalStyle = createGlobalStyle`
  /* Pretendard 웹폰트 (가능하면 index.html의 <link>로 교체 권장) */
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

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
    font-family: 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif;
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
`;

export default GlobalStyle;
