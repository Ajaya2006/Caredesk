import { Toaster } from 'sonner';

export const ToastProvider = () => {
  return (
    <Toaster
      richColors
      position="top-right"
      closeButton
      duration={4000}
      theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
    />
  );
};