import Router from './Router';
import GlobalStyle from './styles/GlobalStyle';
import ResetStyle from './styles/ResetStyle';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ResetStyle />
      <GlobalStyle />
      <ToastProvider>
        <Router />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
