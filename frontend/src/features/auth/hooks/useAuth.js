import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { login as apiLogin } from '../../../api/auth';

export const useAuth = () => {
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ username, password }) => apiLogin(username, password),
    onSuccess: (data) => {
      const token = data.data?.access_token;
      if (token) {
        localStorage.setItem('token', token);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('No token received');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Login failed');
      throw new Error(error.response?.data?.detail || 'Login failed');
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out');
    navigate('/login');
  };

  return { login, logout, isPending };
};