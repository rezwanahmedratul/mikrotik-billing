import React, { useState, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Settings,
  Grid,
  User,
  LogOut,
  Sliders,
  Shield,
  Layers,
  ChevronDown,
  Activity,
  Terminal,
} from 'lucide-react';

interface UserInfo {
  name?: string;
  email?: string;
  profilePhoto?: string;
  role?: string;
  isSuperAdmin?: boolean;
}

declare global {
  interface Window {
    __TOPNAV_USER__?: UserInfo;
    applyGlobalTheme?: (theme: string) => string;
  }
}

export const TopNavbar: React.FC = () => {
  // Theme state
  const getResolvedTheme = (): 'dark' | 'light' => {
    if (typeof document === 'undefined') return 'dark';
    const attr = document.documentElement.getAttribute('data-bs-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    if (saved === 'auto' && typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  const [theme, setTheme] = useState<'dark' | 'light'>(getResolvedTheme);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);

  // Live Digital Clock state
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');
  const [utcOffset, setUtcOffset] = useState('+0600');

  // Read user info injected by Blade
  const user: UserInfo = typeof window !== 'undefined' ? (window.__TOPNAV_USER__ || {}) : {};

  // Initialize clock and theme
  useEffect(() => {
    // Determine initial theme
    setTheme(getResolvedTheme());

    const updateClock = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      let hours = now.getHours();
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeString(`${pad(hours)}:${minutes}:${seconds} ${ampm}`);

      setDateString(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );

      // UTC offset
      const offsetMin = -now.getTimezoneOffset();
      const sign = offsetMin >= 0 ? '+' : '-';
      const offH = pad(Math.floor(Math.abs(offsetMin) / 60));
      const offM = pad(Math.abs(offsetMin) % 60);
      setUtcOffset(`${sign}${offH}${offM}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Listen for theme change events
    const handleThemeChange = (e: any) => {
      if (e.detail && e.detail.theme) {
        setTheme(e.detail.theme);
      }
    };
    window.addEventListener('smartIspThemeChanged', handleThemeChange);

    const observer = new MutationObserver(() => {
      setTheme(getResolvedTheme());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });

    return () => {
      clearInterval(interval);
      window.removeEventListener('smartIspThemeChanged', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  // Theme toggle handler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (window.applyGlobalTheme) {
      window.applyGlobalTheme(nextTheme);
    } else {
      document.documentElement.setAttribute('data-bs-theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Open command palette
  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('openCommandPalette'));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setUserDropdownOpen(false);
      }
      if (!target.closest('.apps-menu-container')) {
        setAppsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header
      className="top-navbar-root d-flex align-items-center justify-content-between px-3.5"
      style={{
        height: 64,
        background: theme === 'dark' ? '#09090b' : '#ffffff',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 1020,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* ── LEFT: BREADCRUMB CONSOLE BADGE + COMMAND SEARCH INPUT ── */}
      <div className="d-flex align-items-center gap-3" style={{ flex: '1 1 auto', maxWidth: 620 }}>
        {/* Sleek Command Search Bar */}
        <div
          onClick={openCommandPalette}
          role="button"
          tabIndex={0}
          className="d-flex align-items-center justify-content-between px-3 py-1.5 rounded-pill w-100"
          style={{
            background: theme === 'dark' ? '#121216' : '#f4f5f8',
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            cursor: 'pointer',
            maxWidth: 380,
            transition: 'border-color 0.15s ease, background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <Search size={14} style={{ color: 'var(--mono-text-muted)' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--mono-text-muted)', fontWeight: 400 }}>
              Search or press ⌘K...
            </span>
          </div>
          <kbd
            className="font-mono rounded px-1.5 py-0.5 d-none d-sm-inline-block"
            style={{
              fontSize: '0.65rem',
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              color: 'var(--mono-text-secondary)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Console Telemetry Pill Badge */}
        <div
          className="d-none d-xl-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill"
          style={{
            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
            fontSize: '0.72rem',
            color: 'var(--mono-text-muted)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: theme === 'dark' ? '#ffffff' : '#09090b',
            }}
          />
          <span className="font-mono fw-medium" style={{ color: 'var(--mono-text-secondary)' }}>
            NOC Gateway
          </span>
        </div>
      </div>

      {/* ── RIGHT: LIVE DIGITAL CLOCK + THEME SWITCH + QUICK TOOLS + PROFILE ── */}
      <div className="d-flex align-items-center gap-2.5">
        {/* Live Digital Clock (Monochrome Minimalist) */}
        <div className="d-none d-md-flex flex-column align-items-end pe-2" style={{ lineHeight: 1.15 }}>
          <div className="d-flex align-items-center gap-1.5">
            <span
              className="font-mono fw-bold"
              style={{
                fontSize: '0.84rem',
                letterSpacing: '-0.02em',
                color: 'var(--mono-text-primary)',
              }}
            >
              {timeString || '12:00:00 PM'}
            </span>
            <span
              className="badge font-mono"
              style={{
                fontSize: '0.62rem',
                padding: '2px 5px',
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                color: 'var(--mono-text-secondary)',
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 4,
                fontWeight: 500,
              }}
            >
              UTC {utcOffset}
            </span>
          </div>
          <span
            style={{
              fontSize: '0.68rem',
              color: 'var(--mono-text-muted)',
              marginTop: 2,
            }}
          >
            {dateString || 'Today'}
          </span>
        </div>

        {/* Vertical Hairline Divider */}
        <div
          className="d-none d-md-block"
          style={{
            width: 1,
            height: 24,
            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        />

        {/* Theme Switcher Toggle (Solid Dark / Solid White) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="btn p-0 d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: 34,
            height: 34,
            background: theme === 'dark' ? '#141418' : '#f4f5f8',
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            color: 'var(--mono-text-primary)',
            transition: 'all 0.15s ease',
          }}
        >
          {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* Notifications Icon Link */}
        <a
          href="/billing/all-notifications"
          title="Notifications"
          className="btn p-0 d-flex align-items-center justify-content-center rounded-3 position-relative"
          style={{
            width: 34,
            height: 34,
            background: theme === 'dark' ? '#141418' : '#f4f5f8',
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            color: 'var(--mono-text-secondary)',
          }}
        >
          <Bell size={15} />
          <span
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: theme === 'dark' ? '#ffffff' : '#09090b',
            }}
          />
        </a>

        {/* Settings Offcanvas Trigger */}
        <button
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#settings-offcanvas"
          title="Settings Drawer"
          className="btn p-0 d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: 34,
            height: 34,
            background: theme === 'dark' ? '#141418' : '#f4f5f8',
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            color: 'var(--mono-text-secondary)',
          }}
        >
          <Settings size={15} />
        </button>

        {/* User Profile Dropdown */}
        <div className="position-relative user-menu-container">
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="btn p-0 d-flex align-items-center gap-1.5 rounded-pill ps-1 pe-2 py-1"
            style={{
              background: theme === 'dark' ? '#141418' : '#f4f5f8',
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              color: 'var(--mono-text-primary)',
            }}
          >
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name || 'User'}
                className="rounded-circle"
                style={{ width: 26, height: 26, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: 26,
                  height: 26,
                  background: theme === 'dark' ? '#ffffff' : '#09090b',
                  color: theme === 'dark' ? '#09090b' : '#ffffff',
                  fontSize: '0.74rem',
                }}
              >
                {(user.name ? user.name[0] : 'A').toUpperCase()}
              </div>
            )}
            <ChevronDown size={12} style={{ color: 'var(--mono-text-muted)' }} />
          </button>

          {/* User Menu Dropdown Panel */}
          {userDropdownOpen && (
            <div
              className="position-absolute end-0 mt-2 py-1 rounded-3 shadow-lg"
              style={{
                width: 220,
                background: theme === 'dark' ? '#121216' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                zIndex: 1050,
              }}
            >
              <div className="px-3 py-2.5 border-bottom" style={{ borderColor: 'var(--mono-card-border)' }}>
                <p className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.82rem', color: 'var(--mono-text-primary)' }}>
                  {user.name || 'Administrator'}
                </p>
                <p className="small mb-0 text-truncate" style={{ fontSize: '0.72rem', color: 'var(--mono-text-muted)' }}>
                  {user.email || 'admin@smartisp.com'}
                </p>
              </div>

              <div className="py-1">
                <a
                  href="/user/profile"
                  className="dropdown-item d-flex align-items-center gap-2 px-3 py-1.5"
                  style={{ fontSize: '0.8rem', color: 'var(--mono-text-primary)' }}
                >
                  <User size={14} style={{ color: 'var(--mono-text-muted)' }} />
                  Profile & Account
                </a>
                <a
                  href="/billing/site-settings"
                  className="dropdown-item d-flex align-items-center gap-2 px-3 py-1.5"
                  style={{ fontSize: '0.8rem', color: 'var(--mono-text-primary)' }}
                >
                  <Sliders size={14} style={{ color: 'var(--mono-text-muted)' }} />
                  Master Setup
                </a>
                <a
                  href="/billing/admin-roles"
                  className="dropdown-item d-flex align-items-center gap-2 px-3 py-1.5"
                  style={{ fontSize: '0.8rem', color: 'var(--mono-text-primary)' }}
                >
                  <Shield size={14} style={{ color: 'var(--mono-text-muted)' }} />
                  Access & Roles
                </a>
              </div>

              <div className="border-top py-1" style={{ borderColor: 'var(--mono-card-border)' }}>
                <form method="POST" action="/logout">
                  <input
                    type="hidden"
                    name="_token"
                    value={
                      typeof document !== 'undefined'
                        ? (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                        : ''
                    }
                  />
                  <button
                    type="submit"
                    className="dropdown-item d-flex align-items-center gap-2 px-3 py-1.5 w-100 text-start"
                    style={{ fontSize: '0.8rem', color: 'var(--mono-text-primary)' }}
                  >
                    <LogOut size={14} style={{ color: 'var(--mono-text-muted)' }} />
                    Log Out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
