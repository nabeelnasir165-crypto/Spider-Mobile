import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// ---------------------------------------------------------------------------
// BUILD TARGET
// ---------------------------------------------------------------------------
// 'site'  → customer-facing marketing + e-commerce site (deployed to the apex
//           domain, e.g. spidermobiles.co.uk). Admin routes are NOT bundled.
// 'admin' → Hybrid Repair Suite back-office (deployed to a separate subdomain,
//           e.g. admin.spidermobiles.co.uk). Customer routes are NOT bundled.
// 'all'   → both bundles in one app. Useful for local development with a
//           single dev server. This is the default if no env var is set.
// ---------------------------------------------------------------------------
const TARGET = import.meta.env.VITE_BUILD_TARGET || 'all';
const includeSite  = TARGET === 'site'  || TARGET === 'all';
const includeAdmin = TARGET === 'admin' || TARGET === 'all';

// ---------------------------------------------------------------------------
// Eager imports — only the shell + home + auth (needed on first paint)
// Everything else is code-split per route so the initial JS chunk stays small.
// ---------------------------------------------------------------------------
import SiteLayout       from './components/SiteLayout';
import ProtectedRoute   from './components/ProtectedRoute';
import Home             from './pages/Home';
import Login            from './pages/Login';

// ---------------------------------------------------------------------------
// Lazy-loaded site routes
// ---------------------------------------------------------------------------
const Repairs           = lazy(() => import('./pages/Repairs'));
const Refurbished       = lazy(() => import('./pages/Refurbished'));
const Accessories       = lazy(() => import('./pages/Accessories'));
const Track             = lazy(() => import('./pages/Track'));
const About             = lazy(() => import('./pages/About'));
const Contact           = lazy(() => import('./pages/Contact'));
const Privacy           = lazy(() => import('./pages/Privacy'));
const Terms             = lazy(() => import('./pages/Terms'));
const NotFound          = lazy(() => import('./pages/NotFound'));
const Signup            = lazy(() => import('./pages/Signup'));
const ForgotPassword    = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword     = lazy(() => import('./pages/ResetPassword'));
const Account           = lazy(() => import('./pages/Account'));
const Book              = lazy(() => import('./pages/Book'));
const Cart              = lazy(() => import('./pages/Cart'));
const Checkout          = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));

// ---------------------------------------------------------------------------
// Lazy-loaded admin routes (Hybrid Repair Suite)
// ---------------------------------------------------------------------------
const AdminLayout       = lazy(() => import('./components/Layout'));
const AdminRoute        = lazy(() => import('./components/AdminRoute'));
const Dashboard         = lazy(() => import('./pages/Dashboard'));
const AllRepairs        = lazy(() => import('./pages/AllRepairs'));
const CustomerDatabase  = lazy(() => import('./pages/CustomerDatabase'));
const NewRepairTicket   = lazy(() => import('./pages/NewRepairTicket'));
const TicketDetails     = lazy(() => import('./pages/TicketDetails'));
const AdminBookings     = lazy(() => import('./pages/Bookings'));
const Pricing           = lazy(() => import('./pages/Pricing'));
const CMS               = lazy(() => import('./pages/CMS'));
const Payments          = lazy(() => import('./pages/Payments'));
const Warranty          = lazy(() => import('./pages/Warranty'));
const Staff             = lazy(() => import('./pages/Staff'));
const AdminSettings     = lazy(() => import('./pages/Settings'));

// Lightweight fallback while a route chunk is fetched.
function RouteFallback() {
  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <div className="w-10 h-10 rounded-full border-2 border-ink-100 border-t-brand animate-spin" aria-label="Loading" role="status" />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* ===== Customer site ===== */}
            {includeSite && (
              <Route element={<SiteLayout />}>
                <Route index element={<Home />} />
                <Route path="/repairs"          element={<Repairs />} />
                <Route path="/refurbished"      element={<Refurbished />} />
                <Route path="/accessories"      element={<Accessories />} />
                <Route path="/track"            element={<Track />} />
                <Route path="/about"            element={<About />} />
                <Route path="/contact"          element={<Contact />} />
                <Route path="/privacy"          element={<Privacy />} />
                <Route path="/terms"            element={<Terms />} />

                <Route path="/login"            element={<Login />} />
                <Route path="/signup"           element={<Signup />} />
                <Route path="/forgot-password"  element={<ForgotPassword />} />
                <Route path="/reset-password"   element={<ResetPassword />} />

                {/* Open booking + shopping — guests complete without an account */}
                <Route path="/book"             element={<Book />} />
                <Route path="/cart"             element={<Cart />} />
                <Route path="/checkout"         element={<Checkout />} />
                <Route path="/order/:id"        element={<OrderConfirmation />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/account" element={<Account />} />
                </Route>

                {/* Catch-all on the public site → 404 */}
                {!includeAdmin && <Route path="*" element={<NotFound />} />}
              </Route>
            )}

            {/* ===== Admin dashboard ===== */}
            {includeAdmin && (
              <>
                {/* On the admin subdomain we want '/' to land on the dashboard.
                    Internal links still use '/admin/...' for navigation. */}
                {TARGET === 'admin' && <Route path="/" element={<Navigate to="/admin" replace />} />}

                {/* Auth pages — needed inside the admin bundle so AdminRoute
                    can redirect there when the user isn't signed in.
                    Rendered standalone (no SiteLayout) — AuthCard is full-screen. */}
                {TARGET === 'admin' && (
                  <>
                    <Route path="/login"           element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password"  element={<ResetPassword />} />
                  </>
                )}

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index                element={<Dashboard />} />
                    <Route path="repairs"       element={<AllRepairs />} />
                    <Route path="customers"     element={<CustomerDatabase />} />
                    <Route path="new-ticket"    element={<NewRepairTicket />} />
                    <Route path="ticket/:id"    element={<TicketDetails />} />
                    <Route path="bookings"      element={<AdminBookings />} />
                    <Route path="pricing"       element={<Pricing />} />
                    <Route path="cms"           element={<CMS />} />
                    <Route path="payments"      element={<Payments />} />
                    <Route path="warranty"      element={<Warranty />} />
                    <Route path="staff"         element={<Staff />} />
                    <Route path="settings"      element={<AdminSettings />} />
                  </Route>
                </Route>
                {/* In admin-only builds any unknown URL falls back to the dashboard */}
                {TARGET === 'admin' && <Route path="*" element={<Navigate to="/admin" replace />} />}
              </>
            )}
          </Routes>
        </Suspense>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
    </MotionConfig>
  );
}
