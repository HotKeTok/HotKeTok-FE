
import Router from './Router';
import GlobalStyle from './styles/GlobalStyle';
import ResetStyle from "./styles/ResetStyle";
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ResetStyle />
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  );
}

export default App;
