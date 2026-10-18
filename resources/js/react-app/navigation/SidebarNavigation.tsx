import React, { useState, useEffect, useMemo } from 'react';
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
  Activity,
  Sliders,
  Shield,
  Layers,
  HardDriveDownload,
  Receipt,
  FileCheck,
  Radio,
  FileSpreadsheet,
  PieChart,
  LogOut,
  User,
  Ticket
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
  routes?: Record<string, string>;
}

declare global {
  interface Window {
    __SIDEBAR_CONFIG__?: WindowConfig;
    applyGlobalTheme?: (theme: string) => void;
  }
}

export const SidebarNavigation: React.FC = () => {
  // Read config injected from Blade
  const config = typeof window !== 'undefined' ? (window.__SIDEBAR_CONFIG__ || {}) : {};
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : (config.currentPath || '/');
  const routes = config.routes || {};
  const isReseller = !!config.isReseller;

  // Track theme changes (dark/light)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.getAttribute('data-bs-theme') === 'dark' ||
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-bs-theme');
      setIsDark(theme === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });
    return () => observer.disconnect();
  }, []);

  // Build Navigation Sections using dynamic URLs from Laravel routes
  const sections: NavSection[] = useMemo(() => {
    if (isReseller) {
      return [
        {
          id: 'reseller-main',
          title: 'RESELLER PANEL',
          items: [
            {
              id: 'reseller-dashboard',
              label: 'Dashboard',
              href: routes.dashboard || '/reseller/dashboard',
              icon: 'dashboard',
            },
          ],
        },
        {
          id: 'reseller-customers',
          title: 'CUSTOMERS',
          items: [
            {
              id: 'reseller-customer-list',
              label: 'Customer List',
              href: routes.customersIndex || '/reseller/customers',
              icon: 'customers',
            },
            {
              id: 'reseller-new-customer',
              label: 'New Customer',
              href: routes.newCustomer || '/reseller/customers/create',
              icon: 'newCustomer',
            },
          ],
        },
        {
          id: 'reseller-billing',
          title: 'BILLING & PAYMENTS',
          items: [
            {
              id: 'reseller-payment-collection',
              label: 'Payment Collection',
              href: routes.paymentCollection || '/payment-collection',
              icon: 'collection',
            },
            {
              id: 'reseller-collection-edit',
              label: 'Collection Edit',
              href: routes.collectionEdit || '/payment-collection-edit',
              icon: 'collection',
            },
            {
              id: 'reseller-payment-invoice',
              label: 'Payment Invoice',
              href: routes.paymentInvoice || '/payment-invoice',
              icon: 'reports',
            },
            {
              id: 'reseller-collection-report',
              label: 'Collection Report',
              href: routes.collectionReportIndex || '/collection-report',
              icon: 'reports',
            },
          ],
        },
        {
          id: 'reseller-account',
          title: 'MY ACCOUNT',
          items: [
            {
              id: 'reseller-wallet',
              label: 'Wallet & Earnings',
              href: routes.adminExpenses || '/reseller/wallet',
              icon: 'wallet',
            },
            {
              id: 'reseller-vouchers',
              label: 'Vouchers',
              href: routes.adminVouchers || '/reseller/vouchers',
              icon: 'vouchers',
            },
          ],
        },
      ];
    }

    return [
      {
        id: 'main-dash',
        title: 'MAIN',
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
        title: 'MIKROTIK',
        items: [
          {
            id: 'mikrotik-sync',
            label: 'Mikrotik Sync',
            href: routes.mikrotikSync || '/mikrotik',
            icon: 'mikrotikSync',
          },
          {
            id: 'mikrotik-setup-dropdown',
            label: 'Mikrotik Setup',
            icon: 'mikrotikSetup',
            children: [
              { id: 'ip-setup', label: 'IP & Pool', href: routes.mikrotikIpSetup || '/mikrotik-setup/ip' },
              { id: 'pppoe-setup', label: 'PPPoE Server', href: routes.mikrotikPppoeSetup || '/mikrotik-setup/pppoe' },
              { id: 'radius-setup', label: 'RADIUS', href: routes.mikrotikRadiusSetup || '/mikrotik-setup/radius' },
              { id: 'firewall-setup', label: 'Firewall', href: routes.mikrotikFirewallSetup || '/mikrotik-setup/firewall' },
              { id: 'walled-garden', label: 'Walled Garden', href: routes.mikrotikWalledGarden || '/mikrotik-setup/walled-garden', badge: { text: 'New', variant: 'info' } },
              { id: 'queue-setup', label: 'Queues', href: routes.mikrotikQueueSetup || '/mikrotik-setup/queue' },
              { id: 'vpn-setup', label: 'VPN Server', href: routes.mikrotikVpnSetup || '/mikrotik-setup/vpn' },
              { id: 'interface-setup', label: 'Interfaces & VLAN', href: routes.mikrotikInterfaceSetup || '/mikrotik-setup/interface' },
              { id: 'traffic-monitor', label: 'Live Traffic', href: routes.mikrotikTrafficMonitor || '/mikrotik-setup/traffic', badge: { text: 'Live', variant: 'success' } },
              { id: 'backup-setup', label: 'Backup & Restore', href: routes.mikrotikBackupSetup || '/mikrotik-setup/backup', badge: { text: 'Admin', variant: 'primary' } },
            ],
          },
          {
            id: 'hotspot-mgr',
            label: 'Hotspot Manager',
            href: routes.mikrotikHotspotManager || '/mikrotik-setup/hotspot-manager',
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
            href: routes.newCustomer || '/create-customer',
            icon: 'newCustomer',
          },
          {
            id: 'all-cust',
            label: 'Customer List',
            href: routes.customersIndex || '/customers',
            icon: 'customers',
            exact: true,
          },
          {
            id: 'tickets',
            label: 'Support Tickets',
            href: routes.adminTickets || '/support-tickets',
            icon: 'tickets',
          },
          {
            id: 'collections-dropdown',
            label: 'Collection',
            icon: 'collection',
            children: [
              { id: 'pay-col', label: 'Payment Collection', href: routes.paymentCollection || '/payment-collection' },
              { id: 'col-edit', label: 'Collection Edit', href: routes.collectionEdit || '/payment-collection-edit' },
              { id: 'pay-inv', label: 'Payment Invoice', href: routes.paymentInvoice || '/payment-invoice' },
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
              { id: 'col-rep', label: 'Collections Report', href: routes.collectionReportIndex || '/collection-report' },
              { id: 'cust-sum', label: 'Customer Summary', href: routes.customerSummary || '/customer-summary' },
              { id: 'dis-sum', label: 'DIS Summary', href: routes.disReport || '/report/dis-report', badge: { text: 'New', variant: 'success' } },
            ],
          },
          {
            id: 'expenses',
            label: 'Expense Management',
            href: routes.adminExpenses || '/expenses',
            icon: 'expenses',
          },
          {
            id: 'profit-summary',
            label: 'Profit & Loss',
            href: routes.adminProfitSummary || '/profit-summary',
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
            href: routes.addressSetup || '/address',
            icon: 'address',
          },
          {
            id: 'pkg-setup',
            label: 'Package Setup',
            href: routes.packageListSetup || '/packages',
            icon: 'package',
          },
          {
            id: 'purch-req',
            label: 'Purchase Requests',
            href: routes.adminPurchaseRequests || '/purchase-requests',
            icon: 'purchaseRequests',
          },
          {
            id: 'reseller-setup',
            label: 'Reseller Setup',
            href: routes.adminResellersIndex || '/resellers',
            icon: 'resellers',
          },
          {
            id: 'logs-dropdown',
            label: 'Logs & Audits',
            icon: 'logs',
            children: [
              { id: 'act-logs', label: 'Activity Logs', href: routes.adminActivityLogs || '/activity-logs' },
              { id: 'login-logs', label: 'Login Logs', href: routes.adminLoginLogs || '/login-logs' },
              { id: 'sys-logs', label: 'System Logs', href: routes.adminSystemLogs || '/system-logs' },
              { id: 'rtr-logs', label: 'Router Logs', href: routes.mikrotikLogViewer || '/mikrotik-setup/logs' },
              { id: 'res-vouch', label: 'Reseller Vouchers', href: routes.adminVouchers || '/vouchers' },
            ],
          },
          {
            id: 'reviews',
            label: 'Customer Reviews',
            href: routes.adminReviews || '/reviews',
            icon: 'reviews',
          },
          {
            id: 'sms-dropdown',
            label: 'SMS Management',
            icon: 'sms',
            children: [
              { id: 'sms-setup', label: 'SMS Setup', href: routes.smsSetup || '/sms' },
              { id: 'sms-bridge', label: 'SMS Bridge', href: routes.smsBridgeIndex || '/sms-bridge' },
            ],
          },
        ],
      },
    ];
  }, [routes, isReseller]);

  // State to optimistically highlight tapped link
  const [activeOverrideId, setActiveOverrideId] = useState<string | null>(null);

  // Determine if a URL is active
  const isLinkActive = (href?: string, exact?: boolean, itemId?: string) => {
    if (activeOverrideId && itemId) {
      return activeOverrideId === itemId;
    }
    if (!href) return false;
    try {
      const urlPath = new URL(href, window.location.origin).pathname;
      if (urlPath === currentPath) return true;
      if (
        (urlPath === '/dashboard' || urlPath === '/billing/dashboard') &&
        (currentPath === '/dashboard' || currentPath === '/billing/dashboard')
      ) {
        return true;
      }
      return urlPath !== '/' && (currentPath === urlPath || currentPath.startsWith(urlPath + '/'));
    } catch {
      return false;
    }
  };

  // Check if a dropdown has an active child
  const hasActiveChild = (item: NavItem) => {
    if (!item.children) return false;
    return item.children.some(sub => isLinkActive(sub.href, sub.exact));
  };

  // State for open dropdown menus
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    // Auto-open sections if child is active
    for (const section of sections) {
      for (const item of section.items) {
        if (item.children && hasActiveChild(item)) {
          initial[item.id] = true;
        }
      }
    }
    return initial;
  });

  const toggleMenu = (itemId: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Color tokens
  const activeBg = isDark ? '#ffffff' : '#09090b';
  const activeColor = isDark ? '#09090b' : '#ffffff';
  const textMuted = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)';
  const textPrimary = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.85)';
  const hoverBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <nav
      className="react-sidebar-navigation d-flex flex-column w-100"
      style={{
        padding: '0.5rem 0.65rem 1.5rem',
        userSelect: 'none',
      }}
    >
      {sections.map(section => (
        <div key={section.id} className="nav-section-wrapper mb-2">
          {/* Section Header */}
          <div
            className="d-flex align-items-center"
            style={{
              padding: '0.85rem 0.5rem 0.35rem',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.67rem',
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: textMuted,
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {section.title}
            </span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: borderColor,
              }}
            />
          </div>

          {/* Section Items */}
          <ul className="nav flex-column list-unstyled m-0 p-0" style={{ gap: '2px' }}>
            {section.items.map(item => {
              const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isOpen = Boolean(openMenus[item.id]);
              const active = !hasChildren && isLinkActive(item.href, item.exact, item.id);
              const childActive = hasChildren && hasActiveChild(item);

              if (hasChildren) {
                // Collapsible Dropdown Parent
                return (
                  <li key={item.id} className="nav-item">
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.id)}
                      className="nav-link w-100 d-flex align-items-center justify-content-between border-0 text-start"
                      style={{
                        padding: '0.46rem 0.75rem',
                        borderRadius: '8px',
                        background: isOpen
                          ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.035)')
                          : 'transparent',
                        color: childActive ? (isDark ? '#ffffff' : '#000000') : textPrimary,
                        fontWeight: childActive ? 600 : 500,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease, color 0.15s ease',
                        outline: 'none',
                      }}
                      onMouseEnter={e => {
                        if (!isOpen) {
                          e.currentTarget.style.background = hoverBg;
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isOpen) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div className="d-flex align-items-center gap-2.5">
                        <span
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: '20px',
                            color: childActive ? (isDark ? '#ffffff' : '#000000') : textMuted,
                          }}
                        >
                          <IconComponent size={15} />
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
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="d-flex align-items-center"
                          style={{ color: textMuted }}
                        >
                          <ChevronDown size={14} />
                        </motion.span>
                      </div>
                    </button>

                    {/* Accordion Smooth Animated Children */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key={`content-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ul
                            className="nav flex-column list-unstyled m-0"
                            style={{
                              marginLeft: '1.45rem',
                              paddingLeft: '0.65rem',
                              borderLeft: `1.5px solid ${borderColor}`,
                              paddingTop: '3px',
                              paddingBottom: '3px',
                              gap: '2px',
                            }}
                          >
                            {item.children?.map(subItem => {
                              const subActive = isLinkActive(subItem.href, subItem.exact, subItem.id);
                              return (
                                <li key={subItem.id} className="nav-item">
                                  <a
                                    href={subItem.href}
                                    onClick={() => setActiveOverrideId(subItem.id)}
                                    className={`nav-link d-flex align-items-center justify-content-between text-decoration-none ${subActive ? 'active' : ''}`}
                                    style={{
                                      padding: '0.36rem 0.65rem',
                                      minHeight: '31px',
                                      borderRadius: '6px',
                                      fontSize: '0.78rem',
                                      fontWeight: subActive ? 700 : 450,
                                      background: subActive ? activeBg : 'transparent',
                                      color: subActive ? activeColor : textPrimary,
                                      boxShadow: subActive
                                        ? (isDark ? '0 2px 8px rgba(255, 255, 255, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.25)')
                                        : 'none',
                                      transition: 'background 0.15s ease, color 0.15s ease, transform 0.1s ease',
                                    }}
                                    onMouseDown={e => {
                                      e.currentTarget.style.transform = 'scale(0.98)';
                                    }}
                                    onMouseUp={e => {
                                      e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                    onMouseEnter={e => {
                                      if (!subActive) {
                                        e.currentTarget.style.background = hoverBg;
                                      }
                                    }}
                                    onMouseLeave={e => {
                                      if (!subActive) {
                                        e.currentTarget.style.background = 'transparent';
                                      }
                                    }}
                                  >
                                    <span>{subItem.label}</span>
                                    {subItem.badge && (
                                      <span
                                        className="badge font-mono"
                                        style={{
                                          fontSize: '0.62rem',
                                          padding: '2px 5px',
                                          borderRadius: '4px',
                                          marginLeft: 'auto',
                                          background: subActive
                                            ? (isDark ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)')
                                            : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
                                          color: subActive ? activeColor : textMuted,
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

              // Standard Navigation Link
              return (
                <li key={item.id} className="nav-item">
                  <a
                    href={item.href}
                    onClick={() => setActiveOverrideId(item.id)}
                    className={`nav-link d-flex align-items-center justify-content-between text-decoration-none ${active ? 'active' : ''}`}
                    style={{
                      padding: '0.46rem 0.75rem',
                      minHeight: '36px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: active ? 700 : 500,
                      background: active ? activeBg : 'transparent',
                      color: active ? activeColor : textPrimary,
                      boxShadow: active
                        ? (isDark ? '0 2px 10px rgba(255, 255, 255, 0.25)' : '0 2px 10px rgba(0, 0, 0, 0.3)')
                        : 'none',
                      transition: 'background 0.15s ease, color 0.15s ease, transform 0.1s ease',
                    }}
                    onMouseDown={e => {
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onMouseUp={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = hoverBg;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div className="d-flex align-items-center gap-2.5">
                      <span
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: '20px',
                          color: active ? activeColor : textMuted,
                        }}
                      >
                        <IconComponent size={15} />
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className="badge font-mono"
                        style={{
                          fontSize: '0.62rem',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          background: active
                            ? (isDark ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)')
                            : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
                          color: active ? activeColor : textMuted,
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
    </nav>
  );
};

export default SidebarNavigation;
