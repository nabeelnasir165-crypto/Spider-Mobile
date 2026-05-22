import React, { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TopNavBar = ({ onMenuClick }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { signOut, user, profile } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';
  const initials = (profile?.full_name || user?.email || 'A')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('') || 'A';

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-3 sm:px-md h-16 bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline">
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger — drawer toggle on screens below lg */}
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          aria-controls="admin-sidenav"
          className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors shrink-0"
        >
          <span aria-hidden="true" className="material-symbols-outlined">menu</span>
        </button>
        <Link to="/admin" className="flex items-center gap-sm cursor-pointer min-w-0">
          <span aria-hidden="true" className="material-symbols-outlined text-primary dark:text-primary-fixed" data-icon="handyman">handyman</span>
          <span className="text-title-md sm:text-title-lg font-title-lg font-bold text-primary dark:text-primary-fixed truncate">
            <span className="hidden sm:inline">Spider Mobiles · </span>Admin
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-md shrink-0">
        <div className="flex items-center gap-xs relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            aria-label="Notifications (1 unread)"
            aria-expanded={isNotificationOpen}
            aria-haspopup="dialog"
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80 relative"
          >
            <span aria-hidden="true" className="material-symbols-outlined" data-icon="notifications">notifications</span>
            <span aria-hidden="true" className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>

          {isNotificationOpen && (
            <div className="fixed sm:absolute top-16 sm:top-12 inset-x-2 sm:inset-x-auto sm:right-10 sm:w-80 bg-surface rounded-xl shadow-lg border border-outline-variant overflow-hidden flex flex-col z-50">
              <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                <h3 className="font-title-lg text-title-lg text-on-surface">Notifications</h3>
                <div className="flex items-center gap-sm">
                  <button className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer">Mark all as read</button>
                  <button onClick={() => setIsNotificationOpen(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer flex items-center justify-center" aria-label="Close notifications">
                    <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <Link to="/admin/repairs" onClick={() => setIsNotificationOpen(false)} className="p-md border-b border-outline-variant hover:bg-surface-container-lowest transition-colors cursor-pointer flex gap-sm items-start w-full text-left">
                  <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px]">error</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">Overdue Payment</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">You have tickets marked as completed but unpaid.</p>
                    <span className="font-label-sm text-label-sm text-primary mt-1 block">Just now</span>
                  </div>
                </Link>
                <Link to="/admin" onClick={() => setIsNotificationOpen(false)} className="p-md hover:bg-surface-container-lowest transition-colors cursor-pointer flex gap-sm items-start w-full text-left">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px]">build</span>
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

          <button aria-label="Help" className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <span aria-hidden="true" className="material-symbols-outlined" data-icon="help">help</span>
          </button>
        </div>
        <div className="hidden sm:block h-8 w-px bg-outline-variant mx-xs"></div>
        <div className="relative">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} aria-label={`Profile menu — ${displayName}`} aria-expanded={isProfileOpen} aria-haspopup="menu" className="flex items-center gap-sm px-2 sm:px-sm py-xs rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-tertiary text-on-primary flex items-center justify-center text-[12px] font-bold shadow-sm" aria-hidden="true">
              {initials}
            </div>
            <span className="hidden sm:block font-label-md text-label-md text-on-surface max-w-[140px] truncate">{displayName}</span>
            <span aria-hidden="true" className="hidden sm:block material-symbols-outlined text-on-surface-variant" data-icon="expand_more" style={{ fontSize: '16px' }}>expand_more</span>
          </button>

          {isProfileOpen && (
            <div className="absolute top-12 right-0 w-48 bg-surface rounded-xl shadow-lg border border-outline-variant overflow-hidden flex flex-col z-50">
              <div className="p-sm flex flex-col gap-xs">
                <Link to="/admin/settings" onClick={() => setIsProfileOpen(false)} className="px-md py-sm text-on-surface font-label-md text-label-md hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer text-left flex items-center gap-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </Link>
                <button onClick={() => { setIsProfileOpen(false); signOut(); }} className="px-md py-sm text-error font-label-md text-label-md hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer text-left flex items-center gap-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">logout</span>
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

const SideNavBar = ({ isOpen, onClose }) => {
  const drawerRef = useRef(null);

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

  // Esc to close + body scroll lock on mobile
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop — mobile only, visible when open */}
      <div
        onClick={onClose}
        className={`lg:hidden fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />
      <nav
        id="admin-sidenav"
        ref={drawerRef}
        aria-label="Admin navigation"
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-[260px] flex flex-col p-md z-40 overflow-y-auto bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-lg px-xs">
          <div className="flex items-center justify-between gap-md mb-md">
            <div className="flex items-center gap-md min-w-0">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                <span aria-hidden="true" className="material-symbols-outlined text-primary" data-icon="storefront">storefront</span>
              </div>
              <div className="min-w-0">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface leading-tight truncate">Spider Mobiles</h2>
                <span className="font-label-md text-label-md text-on-surface-variant">V1.0.4</span>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high shrink-0"
            >
              <span aria-hidden="true" className="material-symbols-outlined">close</span>
            </button>
          </div>
          <Link
            to="/admin/new-ticket"
            onClick={onClose}
            className="w-full h-10 bg-primary text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-sm hover:opacity-90 transition-opacity shadow-sm scale-95 active:scale-90 cursor-pointer"
          >
            <span aria-hidden="true" className="material-symbols-outlined" data-icon="add" style={{ fontSize: '18px' }}>add</span>
            New Repair
          </Link>
        </div>
        <ul className="flex flex-col gap-xs flex-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-md px-md py-sm rounded-lg scale-95 active:scale-90 transition-all duration-200 cursor-pointer ${
                    isActive
                    ? "bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
                    : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest"
                  }`
                }
              >
                <span aria-hidden="true" className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li className="mt-auto">
            <NavLink
              to="/admin/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-md px-md py-sm rounded-lg scale-95 active:scale-90 transition-all duration-200 cursor-pointer ${
                  isActive
                  ? "bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
                  : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest"
                }`
              }
            >
              <span aria-hidden="true" className="material-symbols-outlined" data-icon="settings">settings</span>
              <span className="font-label-md text-label-md">Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Auto-close drawer when route changes (in case any nav link missed onClick)
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <div className="pt-16 w-full min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#f4f5fb' }}>
      <a href="#admin-main" className="sr-only focus-visible:not-sr-only">Skip to main content</a>
      <TopNavBar onMenuClick={() => setMobileOpen(true)} />
      <SideNavBar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main
        id="admin-main"
        tabIndex={-1}
        className="w-full lg:ml-[260px] lg:w-[calc(100%-260px)] min-h-[calc(100vh-64px)]"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
