import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { router } from './routes';
import './styles/globals.css';
import './styles/theme.css';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;