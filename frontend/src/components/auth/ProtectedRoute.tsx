import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const ProtectedRoute = () => {
  const { user } = useAppStore();

  if (!user) {
    // Redirect them to login, but replace the history stack so they can't hit "Back" to bypass
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes (which will be the AppLayout)
  return <Outlet />;
};