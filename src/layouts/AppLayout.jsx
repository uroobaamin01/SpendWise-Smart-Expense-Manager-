import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FinanceProvider } from '../context/FinanceContext';

/** Signed-in shell: navigation, shared finance context and an animated page container. */
export default function AppLayout() {
  const { pathname } = useLocation();

  return (
    <FinanceProvider>
      <div className="app-shell">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AppNavbar />
        <main id="main" className="app-main">
          <div className="container page-enter" key={pathname}>
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </FinanceProvider>
  );
}
