// frontend/src/App.jsx

import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { AuthInitializer } from './components/AuthInitializer';
import { router } from './routes';
import './styles/globals.css';
import './styles/theme.css';
import './styles/components.css';
import './styles/dark-mode.css';
import './styles/animations.css';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider />
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;