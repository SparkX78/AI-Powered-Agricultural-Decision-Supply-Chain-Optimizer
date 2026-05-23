import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom';


import CookieBannerErrorBoundary from '@/components/CookieBannerErrorBoundary';
import RootLayout from './layouts/RootLayout';
import Spinner from './components/Spinner';
import { routes } from './routes';

const CookieBanner = lazy(() =>
  import('@/components/CookieBanner').catch((error) => {
    console.warn('Failed to load CookieBanner:', error);
    return { default: () => null };
  })
);

const SpinnerFallback = () => (
  <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);

// Pages that manage their own full-screen layout (no shared header/footer)
const STANDALONE_PATHS = ['/login', '/farmer-dashboard', '/owner-dashboard', '/shipment-tracking'];

function LayoutWrapper() {
  const location = useLocation();
  const isStandalone = STANDALONE_PATHS.some((p) => location.pathname.startsWith(p));

  if (isStandalone) {
    return (
      <Suspense fallback={<SpinnerFallback />}>
        <Outlet />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<SpinnerFallback />}>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </Suspense>
  );
}

// Create router with layout wrapper

const router = createBrowserRouter([
	{
		path: '/',
		element: <LayoutWrapper />,
		children: routes,
	},
]);



export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <CookieBannerErrorBoundary>
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      </CookieBannerErrorBoundary>
    </>
  );
}
