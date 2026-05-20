import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TopNavBar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline">
      <Link to="/admin" className="flex items-center gap-sm cursor-pointer">
        <span className="material-symbols-outlined text-primary dark:text-primary-fixed" data-icon="handyman">handyman</span>
        <span className="text-title-lg font-title-lg font-bold text-primary dark:text-primary-fixed">Spider Mobiles · Admin</span>
      </Link>
      <div className="flex items-center gap-md">
        <div className="flex items-center gap-xs relative">
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80 relative"
          >
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          
          {/* Notification Popup Modal */}
          {isNotificationOpen && (
            <div className="absolute top-12 right-10 w-80 bg-surface rounded-xl shadow-lg border border-outline-variant overflow-hidden flex flex-col z-50">
              <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                <h3 className="font-title-lg text-title-lg text-on-surface">Notifications</h3>
                <div className="flex items-center gap-sm">
                  <button className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer">Mark all as read</button>
                  <button onClick={() => setIsNotificationOpen(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer flex items-center justify-center" aria-label="Close notifications">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <Link to="/admin/repairs" onClick={() => setIsNotificationOpen(false)} className="p-md border-b border-outline-variant hover:bg-surface-container-lowest transition-colors cursor-pointer flex gap-sm items-start w-full text-left">
                  <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">Overdue Payment</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">You have tickets marked as completed but unpaid.</p>
                    <span className="font-label-sm text-label-sm text-primary mt-1 block">Just now</span>
                  </div>
                </Link>
                <Link to="/admin" onClick={() => setIsNotificationOpen(false)} className="p-md hover:bg-surface-container-lowest transition-colors cursor-pointer flex gap-sm items-start w-full text-left">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">build</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">System Update</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Welcome to Spider Mobiles!</p>
                    <span className="font-label-sm text-label-sm text-primary mt-1 block">1 hr ago</span>
                  </div>
                </Link>
              </div>
              <div className="p-sm border-t border-outline-variant bg-surface-bright text-center">
                <Link to="/admin/repairs" onClick={() => setIsNotificationOpen(false)} className="text-primary font-label-md text-label-md hover:underline cursor-pointer w-full block">View all activity</Link>
              </div>
            </div>
          )}

          <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined" data-icon="help">help</span>
          </button>
        </div>
        <div className="h-8 w-px bg-outline-variant mx-xs"></div>
        <div className="relative">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-sm px-sm py-xs rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline flex items-center justify-center overflow-hidden">
              <img alt="Manager Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9UwrXGOJwldL_QWKlemq3RouRrb5D3ruGW4YaZRCHZ4vD74NnaC6Rs_nCX-g6lKggTzgxRfQ3nyGtF84k9o9EvKzNOTBnZFdVlqlJ3E580qkmFVf_Ua3YGUIxYAegZWkHplfu4Wa_hkKBZzzC2zIK6Shvd9bwAc9CyCJ8f60P5MnbHTEge8NuXak2a3TtQ-ADoJ3Be_SehPr1SSRyP8hPvQL-5XKjk6kL_sd6GJoLhu9XbpuT9z83n8sck67zqmFJw7iRo90J0C0"/>
            </div>
            <span className="font-label-md text-label-md text-on-surface">Profile</span>
            <span className="material-symbols-outlined text-on-surface-variant" data-icon="expand_more" style={{ fontSize: '16px' }}>expand_more</span>
          </button>
          
          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-12 right-0 w-48 bg-surface rounded-xl shadow-lg border border-outline-variant overflow-hidden flex flex-col z-50">
              <div className="p-sm flex flex-col gap-xs">
                <Link to="/admin/settings" onClick={() => setIsProfileOpen(false)} className="px-md py-sm text-on-surface font-label-md text-label-md hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer text-left flex items-center gap-sm">
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </Link>
                <button onClick={() => { setIsProfileOpen(false); signOut(); }} className="px-md py-sm text-error font-label-md text-label-md hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer text-left flex items-center gap-sm">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const SideNavBar = () => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin', end: true },
    { icon: 'build', label: 'Repairs', path: '/admin/repairs' },
    { icon: 'group', label: 'Customers', path: '/admin/customers' },
    { icon: 'calendar_today', label: 'Bookings', path: '/admin/bookings' },
    { icon: 'payments', label: 'Pricing', path: '/admin/pricing' },
    { icon: 'language', label: 'CMS', path: '/admin/cms' },
    { icon: 'account_balance_wallet', label: 'Payments', path: '/admin/payments' },
    { icon: 'verified', label: 'Warranty', path: '/admin/warranty' },
    { icon: 'badge', label: 'Staff', path: '/admin/staff' },
  ];

  return (
    <nav className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[260px] flex flex-col p-md z-40 overflow-y-auto bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline">
      <div className="mb-lg px-xs">
        <div className="flex items-center gap-md mb-md">
          <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" data-icon="storefront">storefront</span>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface leading-tight">Spider Mobiles</h2>
            <span className="font-label-md text-label-md text-on-surface-variant">V1.0.4</span>
          </div>
        </div>
        <Link to="/admin/new-ticket" className="w-full h-10 bg-primary text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-sm hover:opacity-90 transition-opacity shadow-sm scale-95 active:scale-90 cursor-pointer">
          <span className="material-symbols-outlined" data-icon="add" style={{ fontSize: '18px' }}>add</span>
          New Repair
        </Link>
      </div>
      <ul className="flex flex-col gap-xs flex-1">
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-md px-md py-sm rounded-lg scale-95 active:scale-90 transition-all duration-200 cursor-pointer ${
                  isActive
                  ? "bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
                  : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest"
                }`
              }
            >
              <span className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </NavLink>
          </li>
        ))}
        <li className="mt-auto">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg scale-95 active:scale-90 transition-all duration-200 cursor-pointer ${
                isActive
                ? "bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
                : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest"
              }`
            }
          >
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

const Layout = () => {
  const location = useLocation();
  const isNewTicketPage = location.pathname === '/admin/new-ticket';

  return (
    <div className="pt-16 w-full min-h-screen bg-background relative overflow-x-hidden">
      <TopNavBar />
      <SideNavBar />
      <div className="ml-[260px] w-[calc(100%-260px)] min-h-[calc(100vh-64px)]">
        <Outlet />
      </div>

      {!isNewTicketPage && (
        <Link
          to="/admin/new-ticket"
          className="fixed bottom-6 right-6 h-14 pl-2 pr-6 rounded-full bg-primary text-on-primary shadow-[0_8px_16px_rgba(0,91,191,0.2)] hover:shadow-[0_12px_24px_rgba(0,91,191,0.3)] hover:bg-[#004ca3] flex items-center gap-2 transition-all duration-200 z-50 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
            <span className="material-symbols-outlined" data-icon="add">add</span>
          </div>
          <span className="text-sm font-bold tracking-wide">Create Ticket</span>
        </Link>
      )}
    </div>
  );
};

export default Layout;
