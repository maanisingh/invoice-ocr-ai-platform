import { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  allowedRole?: 'admin' | 'client';
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Only navigate once per mount to avoid loops
    if (hasNavigated.current) return;

    if (!isAuthenticated) {
      hasNavigated.current = true;
      navigate('/login', { replace: true });
      return;
    }

    if (allowedRole && user?.role !== allowedRole) {
      hasNavigated.current = true;
      const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/client/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user?.role, allowedRole, navigate]);

  // ALWAYS return <Outlet /> - never return null or Navigate
  // This keeps the route tree stable
  return <Outlet />;
}
