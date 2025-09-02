import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Pretendard 웹폰트 import */
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  :root {
    --background: #ffffff;
    --vh: 100%;
  }

  #root {
    width: 100%;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    height: 100%;
    font-family: 'Pretendard', 'Apple SD Gothic Neo', Arial, sans-serif;
  }

  html {
    font-size: 62.5%;
    background-color: var(--html-background);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  button {
    background: inherit;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    overflow: visible;
    cursor: pointer;
  }

  body {
    color: var(--foreground);
    background: var(--background);
    max-width: 390px;
    width: 100%;
    min-height: 100vh;
    display: flex;
  }

`;

export default GlobalStyle;