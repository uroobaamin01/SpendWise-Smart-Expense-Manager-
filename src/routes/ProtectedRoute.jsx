import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

/** Only renders nested routes for signed-in users; everyone else is sent to the login page. */
export function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <LoadingSpinner fullPage label="Loading your finances…" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

/** Login / register pages: signed-in users go straight to the app. */
export function PublicOnlyRoute() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) return <LoadingSpinner fullPage />;
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return <Outlet />;
}
