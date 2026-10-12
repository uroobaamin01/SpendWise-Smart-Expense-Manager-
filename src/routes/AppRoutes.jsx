import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import PublicLayout from '../layouts/PublicLayout';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
import InfoPage from '../pages/InfoPage';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

// App screens are split into their own chunks so the landing page stays light.
const Overview = lazy(() => import('../pages/app/Overview'));
const Transactions = lazy(() => import('../pages/app/Transactions'));
const Income = lazy(() => import('../pages/app/Income'));
const Expenses = lazy(() => import('../pages/app/Expenses'));
const Budget = lazy(() => import('../pages/app/Budget'));
const Reports = lazy(() => import('../pages/app/Reports'));
const Categories = lazy(() => import('../pages/app/Categories'));
const Profile = lazy(() => import('../pages/app/Profile'));

/** Scrolls to #hash targets (e.g. /#features) or back to the top on navigation. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section has rendered.
      const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);

  return null;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<InfoPage page="about" />} />
            <Route path="contact" element={<InfoPage page="contact" />} />
            <Route path="privacy" element={<InfoPage page="privacy" />} />
            <Route path="terms" element={<InfoPage page="terms" />} />
          </Route>

          <Route element={<PublicOnlyRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
          </Route>

          <Route path="app" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Overview />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="income" element={<Income />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="budget" element={<Budget />} />
              <Route path="reports" element={<Reports />} />
              <Route path="categories" element={<Categories />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
