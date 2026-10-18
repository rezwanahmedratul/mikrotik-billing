import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Server,
  Wrench,
  Wifi,
  UserPlus,
  Users,
  MessageSquare,
  Coins,
  FileText,
  Wallet,
  TrendingUp,
  MapPin,
  Package,
  ShoppingCart,
  UserCheck,
  ShieldAlert,
  Star,
  MessageCircle,
  ChevronDown,
  Ticket,
  Search,
  X,
  Radio,
  Receipt,
  FileSpreadsheet,
  User
} from 'lucide-react';
import { NavSection, NavItem, NavSubItem } from '../types/navigation';

// Lucide icon mapping
const ICON_MAP: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  mikrotikSync: Server,
  mikrotikSetup: Wrench,
  hotspot: Wifi,
  newCustomer: UserPlus,
  customers: Users,
  tickets: MessageSquare,
  collection: Coins,
  reports: FileText,
  expenses: Wallet,
  profit: TrendingUp,
  address: MapPin,
  package: Package,
  purchaseRequests: ShoppingCart,
  resellers: UserCheck,
  logs: ShieldAlert,
  reviews: Star,
  sms: MessageCircle,
  wallet: Wallet,
  vouchers: Ticket,
  profile: User,
};

interface WindowConfig {
  currentPath?: string;
  currentUrl?: string;
  isReseller?: boolean;
  isSuperAdmin?: boolean;
  permissions?: string[];
  routes?: Record<string, string>;
  siteName?: string;
}

declare global {
  interface Window {
    __SIDEBAR_CONFIG__?: WindowConfig;
    Livewire?: {
      navigate: (url: string) => void;
    };
  }
}

export const SidebarNavigation: React.FC = () => {
  // Read config injected from Blade
  const config = typeof window !== 'undefined' ? (window.__SIDEBAR_CONFIG__ || {}) : {};
  const routes = useMemo(() => config.routes || {}, [config.routes]);
  const isReseller = !!config.isReseller;
  const isSuperAdmin = !!config.isSuperAdmin;
  const permissions = useMemo(() => new Set(config.permissions || []), [config.permissions]);

  // Current active path tracking across browser history & Livewire navigations
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return config.currentPath || '/billing/dashboard';
  });

  // Track theme changes (dark/light)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.getAttribute('data-bs-theme') !== 'light';
  });

  // Quick filter query state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keep theme and active path synchronized with Livewire & browser navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('livewire:navigated', handleLocationChange);

    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-bs-theme');
      setIsDark(theme !== 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('livewire:navigated', handleLocationChange);
      observer.disconnect();
    };
  }, []);

  // Helper to check user permission
  const hasPermission = useCallback((permissionName?: string | string[]) => {
    if (isSuperAdmin) return true;
    if (!permissionName) return true;
    if (Array.isArray(permissionName)) {
      return permissionName.some(p => permissions.has(p));
    }
    return permissions.has(permissionName);
  }, [isSuperAdmin, permissions]);

  // Build Navigation Sections with pure monochrome structure
  const rawSections: NavSection[] = useMemo(() => {
    if (isReseller) {
      return [
        {
          id: 'reseller-overview',
          title: 'RESELLER PANEL',
          items: [
            {
              id: 'reseller-dashboard',
              label: 'Dashboard',
              href: routes.resellerDashboard || routes.dashboard || '/billing/reseller/dashboard',
              icon: 'dashboard',
              exact: true,
            },
          ],
        },
        {
          id: 'reseller-customers-sec',
          title: 'CUSTOMERS',
          items: [
            {
              id: 'reseller-customer-list',
              label: 'Customer List',
              href: routes.resellerCustomers || routes.customersIndex || '/billing/reseller/customers',
              icon: 'customers',
              exact: true,
            },
            {
              id: 'reseller-new-customer',
              label: 'New Customer',
              href: routes.resellerNewCustomer || routes.newCustomer || '/billing/reseller/customers/create',
              icon: 'newCustomer',
            },
          ],
        },
        {
          id: 'reseller-billing-sec',
          title: 'BILLING & PAYMENTS',
          items: [
            {
              id: 'reseller-payment-collection',
              label: 'Payment Collection',
              href: routes.paymentCollection || '/billing/payment-collection',
              icon: 'collection',
            },
            {
              id: 'reseller-collection-edit',
              label: 'Collection Edit',
              href: routes.collectionEdit || '/billing/collection-edit',
              icon: 'collection',
            },
            {
              id: 'reseller-payment-invoice',
              label: 'Payment Invoice',
              href: routes.paymentInvoice || '/billing/payment-invoice',
              icon: 'reports',
            },
            {
              id: 'reseller-collection-report',
              label: 'Collection Report',
              href: routes.collectionReportIndex || '/billing/collection-report',
              icon: 'reports',
            },
          ],
        },
        {
          id: 'reseller-account-sec',
          title: 'MY ACCOUNT',
          items: [
            {
              id: 'reseller-wallet',
              label: 'Wallet & Earnings',
              href: routes.resellerWallet || '/billing/reseller/wallet',
              icon: 'wallet',
            },
            {
              id: 'reseller-vouchers',
              label: 'Vouchers',
              href: routes.resellerVouchers || '/billing/reseller/vouchers',
              icon: 'vouchers',
            },
            {
              id: 'reseller-packages',
              label: 'Packages',
              href: routes.resellerPackages || '/billing/reseller/packages',
              icon: 'package',
            },
          ],
        },
      ];
    }

    return [
      {
        id: 'main-sec',
        title: 'OVERVIEW',
        items: [
          {
            id: 'admin-dashboard',
            label: 'Dashboard',
            href: routes.dashboard || '/billing/dashboard',
            icon: 'dashboard',
            exact: true,
          },
        ],
      },
      {
        id: 'mikrotik-sec',
        title: 'MIKROTIK ROUTEROS',
        items: [
          {
            id: 'mikrotik-sync',
            label: 'Mikrotik Sync',
            href: routes.mikrotikSync || '/billing/mikrotik',
            icon: 'mikrotikSync',
          },
          {
            id: 'mikrotik-setup-dropdown',
            label: 'Mikrotik Setup',
            icon: 'mikrotikSetup',
            children: [
              { id: 'ip-setup', label: 'IP & Pool', href: routes.mikrotikIpSetup || '/billing/mikrotik-setup/ip' },
              { id: 'pppoe-setup', label: 'PPPoE Server', href: routes.mikrotikPppoeSetup || '/billing/mikrotik-setup/pppoe' },
              { id: 'radius-setup', label: 'RADIUS', href: routes.mikrotikRadiusSetup || '/billing/mikrotik-setup/radius' },
              { id: 'firewall-setup', label: 'Firewall', href: routes.mikrotikFirewallSetup || '/billing/mikrotik-setup/firewall' },
              { id: 'walled-garden', label: 'Walled Garden', href: routes.mikrotikWalledGarden || '/billing/mikrotik-setup/walled-garden', badge: { text: 'New' } },
              { id: 'queue-setup', label: 'Queues', href: routes.mikrotikQueueSetup || '/billing/mikrotik-setup/queue' },
              { id: 'vpn-setup', label: 'VPN Server', href: routes.mikrotikVpnSetup || '/billing/mikrotik-setup/vpn' },
              { id: 'interface-setup', label: 'Interfaces & VLAN', href: routes.mikrotikInterfaceSetup || '/billing/mikrotik-setup/interface' },
              { id: 'traffic-monitor', label: 'Live Traffic', href: routes.mikrotikTrafficMonitor || '/billing/mikrotik-setup/traffic', badge: { text: 'Live' } },
              { id: 'backup-setup', label: 'Backup & Restore', href: routes.mikrotikBackupSetup || '/billing/mikrotik-setup/backup', badge: { text: 'Admin' } },
            ],
          },
          {
            id: 'hotspot-mgr',
            label: 'Hotspot Manager',
            href: routes.mikrotikHotspotManager || '/billing/mikrotik-setup/hotspot-manager',
            icon: 'hotspot',
          },
        ],
      },
      {
        id: 'customers-sec',
        title: 'CUSTOMERS & BILLING',
        items: [
          {
            id: 'new-cust',
            label: 'New Customer',
            href: routes.newCustomer || '/billing/create-customer',
            icon: 'newCustomer',
          },
          {
            id: 'all-cust',
            label: 'Customer List',
            href: routes.customersIndex || '/billing/customers',
            icon: 'customers',
            exact: true,
          },
          {
            id: 'tickets',
            label: 'Support Tickets',
            href: routes.adminTickets || '/billing/support-tickets',
            icon: 'tickets',
          },
          {
            id: 'collections-dropdown',
            label: 'Collection',
            icon: 'collection',
            children: [
              { id: 'pay-col', label: 'Payment Collection', href: routes.paymentCollection || '/billing/payment-collection' },
              { id: 'col-edit', label: 'Collection Edit', href: routes.collectionEdit || '/billing/collection-edit' },
              { id: 'pay-inv', label: 'Payment Invoice', href: routes.paymentInvoice || '/billing/payment-invoice' },
            ],
          },
        ],
      },
      {
        id: 'reports-sec',
        title: 'REPORTS & FINANCE',
        items: [
          {
            id: 'reports-dropdown',
            label: 'Reports',
            icon: 'reports',
            children: [
              { id: 'col-rep', label: 'Collections Report', href: routes.collectionReportIndex || '/billing/collection-report' },
              { id: 'cust-sum', label: 'Customer Summary', href: routes.customerSummary || '/billing/customer-summary' },
              { id: 'dis-sum', label: 'DIS Summary', href: routes.disReport || '/billing/report/dis-report', badge: { text: 'New' } },
            ],
          },
          {
            id: 'expenses',
            label: 'Expense Management',
            href: routes.adminExpenses || '/billing/admin/expenses',
            icon: 'expenses',
          },
          {
            id: 'profit-summary',
            label: 'Profit & Loss',
            href: routes.adminProfitSummary || '/billing/admin/profit-summary',
            icon: 'profit',
          },
        ],
      },
      {
        id: 'admin-sec',
        title: 'ADMINISTRATION',
        items: [
          {
            id: 'addr-setup',
            label: 'Address Setup',
            href: routes.addressSetup || '/billing/address',
            icon: 'address',
          },
          {
            id: 'pkg-setup',
            label: 'Package Setup',
            href: routes.packageListSetup || '/billing/packages',
            icon: 'package',
          },
          {
            id: 'purch-req',
            label: 'Purchase Requests',
            href: routes.adminPurchaseRequests || '/billing/admin/purchase-requests',
            icon: 'purchaseRequests',
          },
          {
            id: 'reseller-setup',
            label: 'Reseller Setup',
            href: routes.adminResellersIndex || '/billing/admin/resellers',
            icon: 'resellers',
          },
          {
            id: 'logs-dropdown',
            label: 'Logs & Audits',
            icon: 'logs',
            children: [
              { id: 'act-logs', label: 'Activity Logs', href: routes.adminActivityLogs || '/billing/admin/activity-logs' },
              { id: 'login-logs', label: 'Login Logs', href: routes.adminLoginLogs || '/billing/admin/login-logs' },
              { id: 'sys-logs', label: 'System Logs', href: routes.adminSystemLogs || '/billing/admin/system-logs' },
              { id: 'rtr-logs', label: 'Router Logs', href: routes.mikrotikLogViewer || '/billing/mikrotik-setup/logs' },
              { id: 'res-vouch', label: 'Reseller Vouchers', href: routes.adminVouchers || '/billing/admin/vouchers' },
            ],
          },
          {
            id: 'reviews',
            label: 'Customer Reviews',
            href: routes.adminReviews || '/billing/admin/reviews',
            icon: 'reviews',
          },
          {
            id: 'sms-dropdown',
            label: 'SMS Management',
            icon: 'sms',
            children: [
              { id: 'sms-setup', label: 'SMS Setup', href: routes.smsSetup || '/billing/sms' },
              { id: 'sms-bridge', label: 'SMS Bridge', href: routes.smsBridgeIndex || '/billing/sms-bridge' },
            ],
          },
        ],
      },
    ];
  }, [routes, isReseller]);

  // Determine if a URL is currently active
  const isLinkActive = useCallback((href?: string, exact?: boolean) => {
    if (!href) return false;
    try {
      const urlPath = new URL(href, window.location.origin).pathname;
      if (exact) {
        return currentPath === urlPath;
      }
      if (urlPath === currentPath) return true;
      if (
        (urlPath === '/dashboard' || urlPath === '/billing/dashboard') &&
        (currentPath === '/dashboard' || currentPath === '/billing/dashboard')
      ) {
        return true;
      }
      return urlPath !== '/' && urlPath !== '/billing' && (currentPath === urlPath || currentPath.startsWith(urlPath + '/'));
    } catch {
      return false;
    }
  }, [currentPath]);

  // Check if a parent dropdown item has an active child
  const hasActiveChild = useCallback((item: NavItem) => {
    if (!item.children) return false;
    return item.children.some(sub => isLinkActive(sub.href, sub.exact));
  }, [isLinkActive]);

  // Filter sections by search query if user is searching
  const sections = useMemo(() => {
    if (!searchQuery.trim()) return rawSections;
    const query = searchQuery.toLowerCase().trim();

    return rawSections
      .map(sec => {
        const filteredItems = sec.items
          .map(item => {
            const matchLabel = item.label.toLowerCase().includes(query);
            const filteredChildren = item.children?.filter(c => c.label.toLowerCase().includes(query));
            if (matchLabel) {
              return item;
            }
            if (filteredChildren && filteredChildren.length > 0) {
              return { ...item, children: filteredChildren };
            }
            return null;
          })
          .filter(Boolean) as NavItem[];

        return { ...sec, items: filteredItems };
      })
      .filter(sec => sec.items.length > 0);
  }, [rawSections, searchQuery]);

  // Read saved open menus from localStorage to prevent collapsing across visits
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('smart_isp_nav_open_menus');
        if (saved) {
          Object.assign(initial, JSON.parse(saved));
        }
      } catch {}
    }
    // Auto-open sections if child is active
    for (const section of rawSections) {
      for (const item of section.items) {
        if (item.children && hasActiveChild(item)) {
          initial[item.id] = true;
        }
      }
    }
    return initial;
  });

  // Keep open menus persisted & automatically open active parent on route change
  useEffect(() => {
    let changed = false;
    const next = { ...openMenus };
    for (const section of rawSections) {
      for (const item of section.items) {
        if (item.children && hasActiveChild(item) && !next[item.id]) {
          next[item.id] = true;
          changed = true;
        }
      }
    }
    if (changed) {
      setOpenMenus(next);
      try {
        localStorage.setItem('smart_isp_nav_open_menus', JSON.stringify(next));
      } catch {}
    }
  }, [currentPath, hasActiveChild, rawSections]);

  const toggleMenu = (itemId: string) => {
    setOpenMenus(prev => {
      const updated = {
        ...prev,
        [itemId]: !prev[itemId],
      };
      try {
        localStorage.setItem('smart_isp_nav_open_menus', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Instant SPA Navigation Handler (eliminates navbar reload flicker)
  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
    if (!href) return;
    // Allow default browser action for ctrl/cmd/middle-click (open in new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    // Optimistically update active state immediately
    try {
      const urlPath = new URL(href, window.location.origin).pathname;
      setCurrentPath(urlPath);
    } catch {}

    // Use Livewire SPA navigation if supported
    if (typeof window !== 'undefined' && window.Livewire?.navigate) {
      e.preventDefault();
      window.Livewire.navigate(href);
    }
  };

  // Pure Monochrome Theme Tokens
  const themeTokens = useMemo(() => {
    if (isDark) {
      return {
        bg: '#09090b',
        surface: '#0f0f13',
        textPrimary: '#f4f4f5',
        textSecondary: '#a1a1aa',
        textMuted: '#71717a',
        activeBg: '#ffffff',
        activeColor: '#09090b',
        activeShadow: '0 2px 10px rgba(255, 255, 255, 0.14)',
        hoverBg: 'rgba(255, 255, 255, 0.05)',
        border: 'rgba(255, 255, 255, 0.08)',
        subBorder: 'rgba(255, 255, 255, 0.1)',
        badgeBg: 'rgba(255, 255, 255, 0.1)',
        badgeColor: '#f4f4f5',
        widgetBg: 'rgba(255, 255, 255, 0.025)',
      };
    } else {
      return {
        bg: '#ffffff',
        surface: '#f8fafc',
        textPrimary: '#09090b',
        textSecondary: '#52525b',
        textMuted: '#71717a',
        activeBg: '#09090b',
        activeColor: '#ffffff',
        activeShadow: '0 2px 10px rgba(0, 0, 0, 0.18)',
        hoverBg: 'rgba(0, 0, 0, 0.04)',
        border: 'rgba(0, 0, 0, 0.08)',
        subBorder: 'rgba(0, 0, 0, 0.09)',
        badgeBg: 'rgba(0, 0, 0, 0.08)',
        badgeColor: '#09090b',
        widgetBg: 'rgba(0, 0, 0, 0.025)',
      };
    }
  }, [isDark]);

  return (
    <nav
      className="mono-sidebar-root d-flex flex-column w-100 flex-grow-1"
      style={{
        width: '100%',
        padding: '10px 12px 20px 12px',
        boxSizing: 'border-box',
        userSelect: 'none',
        fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)',
      }}
    >
      {/* Quick Search / Filter Input */}
      <div className="mono-sidebar-search mb-2 px-1">
        <div
          className="d-flex align-items-center gap-2 rounded-2 px-2.5 py-1.5"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
            border: `1px solid ${themeTokens.border}`,
            transition: 'border-color 0.15s ease',
          }}
        >
          <Search size={13} style={{ color: themeTokens.textMuted, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Quick filter..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: themeTokens.textPrimary,
              fontSize: '0.75rem',
              width: '100%',
              padding: 0,
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="border-0 bg-transparent p-0 d-flex align-items-center"
              style={{ color: themeTokens.textMuted, cursor: 'pointer' }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Sections and Items List */}
      <div className="mono-sidebar-sections d-flex flex-column" style={{ gap: '4px' }}>
        {sections.map(section => (
          <div key={section.id} className="mono-section-group">
            {/* Section Category Title */}
            <div
              className="mono-section-title d-flex align-items-center"
              style={{
                padding: '12px 6px 4px 6px',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: themeTokens.textMuted,
                  fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                }}
              >
                {section.title}
              </span>
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: themeTokens.border,
                }}
              />
            </div>

            {/* Section Item Links */}
            <ul className="list-unstyled m-0 p-0 d-flex flex-column" style={{ gap: '2px' }}>
              {section.items.map(item => {
                const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isOpen = Boolean(openMenus[item.id]) || Boolean(searchQuery.trim());
                const active = !hasChildren && isLinkActive(item.href, item.exact);
                const childActive = hasChildren && hasActiveChild(item);

                if (hasChildren) {
                  // Collapsible Dropdown Parent Menu
                  return (
                    <li key={item.id} className="mono-nav-item">
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.id)}
                        className="mono-dropdown-trigger w-100 d-flex align-items-center justify-content-between border-0 text-start"
                        style={{
                          height: '35px',
                          padding: '0 10px',
                          borderRadius: '6px',
                          background: isOpen
                            ? (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)')
                            : 'transparent',
                          color: childActive ? themeTokens.textPrimary : themeTokens.textSecondary,
                          fontWeight: childActive ? 600 : 500,
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease, color 0.15s ease',
                          outline: 'none',
                        }}
                        onMouseEnter={e => {
                          if (!isOpen) {
                            e.currentTarget.style.background = themeTokens.hoverBg;
                            e.currentTarget.style.color = themeTokens.textPrimary;
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isOpen) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = childActive ? themeTokens.textPrimary : themeTokens.textSecondary;
                          }
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: '18px',
                              color: childActive ? themeTokens.textPrimary : themeTokens.textMuted,
                            }}
                          >
                            <IconComponent size={15} strokeWidth={1.8} />
                          </span>
                          <span>{item.label}</span>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          {childActive && (
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: isDark ? '#ffffff' : '#09090b',
                              }}
                            />
                          )}
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.18, ease: 'easeInOut' }}
                            className="d-flex align-items-center"
                            style={{ color: themeTokens.textMuted }}
                          >
                            <ChevronDown size={13} />
                          </motion.span>
                        </div>
                      </button>

                      {/* Smooth Collapsible Children Tree */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key={`dropdown-content-${item.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <ul
                              className="list-unstyled m-0 d-flex flex-column"
                              style={{
                                marginLeft: '17px',
                                paddingLeft: '9px',
                                borderLeft: `1px solid ${themeTokens.subBorder}`,
                                paddingTop: '2px',
                                paddingBottom: '2px',
                                gap: '2px',
                              }}
                            >
                              {item.children?.map(subItem => {
                                const subActive = isLinkActive(subItem.href, subItem.exact);
                                return (
                                  <li key={subItem.id} className="mono-sub-item">
                                    <a
                                      href={subItem.href}
                                      wire:navigate="true"
                                      onClick={e => handleNavigate(e, subItem.href)}
                                      className="mono-sub-link d-flex align-items-center justify-content-between text-decoration-none"
                                      style={{
                                        height: '31px',
                                        padding: '0 9px',
                                        borderRadius: '5px',
                                        fontSize: '0.775rem',
                                        fontWeight: subActive ? 700 : 450,
                                        background: subActive ? themeTokens.activeBg : 'transparent',
                                        color: subActive ? themeTokens.activeColor : themeTokens.textSecondary,
                                        boxShadow: subActive ? themeTokens.activeShadow : 'none',
                                        transition: 'background 0.15s ease, color 0.15s ease',
                                      }}
                                      onMouseEnter={e => {
                                        if (!subActive) {
                                          e.currentTarget.style.background = themeTokens.hoverBg;
                                          e.currentTarget.style.color = themeTokens.textPrimary;
                                        }
                                      }}
                                      onMouseLeave={e => {
                                        if (!subActive) {
                                          e.currentTarget.style.background = 'transparent';
                                          e.currentTarget.style.color = themeTokens.textSecondary;
                                        }
                                      }}
                                    >
                                      <span>{subItem.label}</span>
                                      {subItem.badge && (
                                        <span
                                          className="font-mono"
                                          style={{
                                            fontSize: '0.58rem',
                                            fontWeight: 700,
                                            padding: '1px 5px',
                                            borderRadius: '4px',
                                            background: subActive
                                              ? (isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.25)')
                                              : themeTokens.badgeBg,
                                            color: subActive ? themeTokens.activeColor : themeTokens.badgeColor,
                                          }}
                                        >
                                          {subItem.badge.text}
                                        </span>
                                      )}
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                // Standard Single Nav Link
                return (
                  <li key={item.id} className="mono-nav-item">
                    <a
                      href={item.href}
                      wire:navigate="true"
                      onClick={e => handleNavigate(e, item.href)}
                      className="mono-nav-link d-flex align-items-center justify-content-between text-decoration-none"
                      style={{
                        height: '35px',
                        padding: '0 10px',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: active ? 700 : 500,
                        background: active ? themeTokens.activeBg : 'transparent',
                        color: active ? themeTokens.activeColor : themeTokens.textSecondary,
                        boxShadow: active ? themeTokens.activeShadow : 'none',
                        transition: 'background 0.15s ease, color 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        if (!active) {
                          e.currentTarget.style.background = themeTokens.hoverBg;
                          e.currentTarget.style.color = themeTokens.textPrimary;
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = themeTokens.textSecondary;
                        }
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: '18px',
                            color: active ? themeTokens.activeColor : themeTokens.textMuted,
                          }}
                        >
                          <IconComponent size={15} strokeWidth={1.8} />
                        </span>
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className="font-mono"
                          style={{
                            fontSize: '0.58rem',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: active
                              ? (isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.25)')
                              : themeTokens.badgeBg,
                            color: active ? themeTokens.activeColor : themeTokens.badgeColor,
                          }}
                        >
                          {item.badge.text}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Operational Daemon Status Widget at the bottom */}
      <div
        className="mono-status-widget rounded-3 p-2.5 mt-3"
        style={{
          background: themeTokens.widgetBg,
          border: `1px solid ${themeTokens.border}`,
          boxSizing: 'border-box',
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-1.5">
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: themeTokens.textPrimary,
              }}
            >
              RouterOS Daemon
            </span>
          </div>
          <span
            className="badge font-mono"
            style={{
              fontSize: '0.56rem',
              fontWeight: 700,
              padding: '2px 5px',
              borderRadius: '4px',
              background: isDark ? '#14251e' : '#ecfdf5',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            LIVE
          </span>
        </div>
        <div
          className="d-flex align-items-center justify-content-between pt-1.5 border-top"
          style={{
            borderColor: themeTokens.border,
            fontSize: '0.67rem',
            color: themeTokens.textMuted,
          }}
        >
          <span>System Engine</span>
          <span className="font-mono" style={{ color: themeTokens.textSecondary }}>v2.4 Pro</span>
        </div>
      </div>
    </nav>
  );
};

export default SidebarNavigation;
