import { type ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

import Footer from '@/layouts/parts/Footer';
import Header from '@/layouts/parts/Header';
import Website from '@/layouts/Website';

// Pages that manage their own full-screen layout (no shared header/footer)
const DASHBOARD_PATHS = ['/farmer-dashboard', '/owner-dashboard', '/shipment-tracking'];

interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { pathname } = useLocation();
  const isDashboard = DASHBOARD_PATHS.some((p) => pathname.startsWith(p));

  if (isDashboard) {
    return <Website>{children}</Website>;
  }

  return (
    <Website>
      <Header />
      {children}
      <Footer />
    </Website>
  );
}
