import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';

// Lazy load components for code splitting (except HomePage for instant loading)
const NotFoundPage       = lazy(() => import('./pages/_404'));
const LoginPage          = lazy(() => import('./pages/login'));
const FarmerDashboard    = lazy(() => import('./pages/farmer-dashboard'));
const OwnerDashboard     = lazy(() => import('./pages/owner-dashboard'));
const ShipmentTracking   = lazy(() => import('./pages/shipment-tracking'));
const AboutPage          = lazy(() => import('./pages/about'));
const ContactPage        = lazy(() => import('./pages/contact'));
const PostProduce        = lazy(() => import('./pages/post-produce'));
const SellerMarketplace  = lazy(() => import('./pages/seller-marketplace'));
const TransportJobs      = lazy(() => import('./pages/transport-jobs'));

export const routes: RouteObject[] = [
  { path: '/',                    element: <HomePage /> },
  { path: '/login',               element: <LoginPage /> },
  { path: '/farmer-dashboard',    element: <FarmerDashboard /> },
  { path: '/owner-dashboard',     element: <OwnerDashboard /> },
  { path: '/shipment-tracking',   element: <ShipmentTracking /> },
  { path: '/about',               element: <AboutPage /> },
  { path: '/contact',             element: <ContactPage /> },
  { path: '/post-produce',        element: <PostProduce /> },
  { path: '/seller-marketplace',  element: <SellerMarketplace /> },
  { path: '/transport-jobs',      element: <TransportJobs /> },
  { path: '*',                    element: <NotFoundPage /> },
];

// Types for type-safe navigation
export type Path =
  | '/'
  | '/login'
  | '/farmer-dashboard'
  | '/owner-dashboard'
  | '/shipment-tracking'
  | '/about'
  | '/contact'
  | '/post-produce'
  | '/seller-marketplace'
  | '/transport-jobs';

export type Params = Record<string, string | undefined>;
