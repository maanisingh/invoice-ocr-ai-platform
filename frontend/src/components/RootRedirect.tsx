import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/client/dashboard';
  return <Navigate to={redirectPath} replace />;
}
