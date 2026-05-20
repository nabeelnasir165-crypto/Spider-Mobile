import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import SiteLayout from './components/SiteLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/Layout';

// Customer site pages
import Home from './pages/Home';
import Repairs from './pages/Repairs';
import Refurbished from './pages/Refurbished';
import Accessories from './pages/Accessories';
import Track from './pages/Track';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Account from './pages/Account';
import Book from './pages/Book';

// Admin dashboard pages (Hybrid Repair Suite)
import Dashboard from './pages/Dashboard';
import AllRepairs from './pages/AllRepairs';
import CustomerDatabase from './pages/CustomerDatabase';
import NewRepairTicket from './pages/NewRepairTicket';
import TicketDetails from './pages/TicketDetails';
import AdminBookings from './pages/Bookings';
import Pricing from './pages/Pricing';
import CMS from './pages/CMS';
import Payments from './pages/Payments';
import Warranty from './pages/Warranty';
import Staff from './pages/Staff';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer-facing site */}
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="/repairs" element={<Repairs />} />
            <Route path="/refurbished" element={<Refurbished />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/track" element={<Track />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<Account />} />
              <Route path="/book" element={<Book />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin dashboard (Hybrid Repair Suite — local mock data) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="repairs" element={<AllRepairs />} />
            <Route path="customers" element={<CustomerDatabase />} />
            <Route path="new-ticket" element={<NewRepairTicket />} />
            <Route path="ticket/:id" element={<TicketDetails />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="cms" element={<CMS />} />
            <Route path="payments" element={<Payments />} />
            <Route path="warranty" element={<Warranty />} />
            <Route path="staff" element={<Staff />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
