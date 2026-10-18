import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  Receipt,
  FileText,
  BarChart2,
  Server,
  Network,
  Shield,
  Activity,
  Wifi,
  Package,
  Layers,
  Settings,
  MessageSquare,
  HelpCircle,
  FileCheck,
  DollarSign,
  CornerDownLeft,
  LucideIcon,
} from 'lucide-react';
import { useTheme } from './useTheme';

export interface NavigationItem {
  title: string;
  subtitle: string;
  url: string;
  icon: LucideIcon;
  category: string;
}

export default function CommandPalette() {
  const { isDark, palette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigationItems: NavigationItem[] = [
    { title: 'Billing Dashboard', subtitle: 'Real-time telemetry & revenue stats', url: '/billing/dashboard', icon: LayoutDashboard, category: 'Overview' },
    { title: 'Customer Directory', subtitle: 'View, filter & manage all subscribers', url: '/billing/customers', icon: Users, category: 'Customers' },
    { title: 'Register New Customer', subtitle: 'Add a new PPPoE or Static subscriber', url: '/billing/create-customer', icon: UserPlus, category: 'Customers' },
    { title: 'Customer Summary', subtitle: 'Detailed ledger and customer billing profile', url: '/billing/customer-summary', icon: FileCheck, category: 'Customers' },
    { title: 'Payment Collection', subtitle: 'Collect monthly bills or recharge accounts', url: '/billing/payment-collection', icon: CreditCard, category: 'Billing' },
    { title: 'Collection Edit', subtitle: 'Edit or correct payment receipts', url: '/billing/payment-collection-edit', icon: Receipt, category: 'Billing' },
    { title: 'Payment Invoices', subtitle: 'Generate and print customer invoices', url: '/billing/payment-invoice', icon: FileText, category: 'Billing' },
    { title: 'Collection Reports', subtitle: 'Daily & monthly revenue breakdown reports', url: '/billing/collection-report', icon: BarChart2, category: 'Reports' },
    { title: 'Profit Summary', subtitle: 'Gross revenue, expenses, and net profit ledger', url: '/billing/admin/profit-summary', icon: DollarSign, category: 'Reports' },
    { title: 'MikroTik Router Sync', subtitle: 'Synchronize PPPoE secrets with routerboard', url: '/billing/mikrotik', icon: Server, category: 'MikroTik' },
    { title: 'IP Pool Setup', subtitle: 'Configure IP pools and gateway subnets', url: '/billing/mikrotik-setup/ip', icon: Network, category: 'MikroTik' },
    { title: 'PPPoE Profiles', subtitle: 'Manage speed profiles and pool assignments', url: '/billing/mikrotik-setup/pppoe', icon: Layers, category: 'MikroTik' },
    { title: 'Queue Bandwidth', subtitle: 'Simple queues and bandwidth rate limits', url: '/billing/mikrotik-setup/queue', icon: Activity, category: 'MikroTik' },
    { title: 'Firewall & NAT', subtitle: 'Firewall filter and NAT forwarding rules', url: '/billing/mikrotik-setup/firewall', icon: Shield, category: 'MikroTik' },
    { title: 'Live Traffic Monitor', subtitle: 'Real-time interface packet monitor', url: '/billing/mikrotik-setup/traffic', icon: Activity, category: 'MikroTik' },
    { title: 'Hotspot Manager', subtitle: 'Prepaid WiFi vouchers & captive portal', url: '/billing/mikrotik-setup/hotspot', icon: Wifi, category: 'MikroTik' },
    { title: 'Package Management', subtitle: 'Bandwidth packages & monthly tariff rates', url: '/billing/packages', icon: Package, category: 'Setup' },
    { title: 'Reseller Network', subtitle: 'Manage sub-ISPs and reseller balances', url: '/billing/admin/resellers', icon: Users, category: 'Resellers' },
    { title: 'SMS Setup & Gateway', subtitle: 'Configure Twilio, bKash SMS, or HTTP API', url: '/billing/sms', icon: MessageSquare, category: 'Setup' },
    { title: 'System Site Settings', subtitle: 'General brand configuration and logos', url: '/billing/site-settings', icon: Settings, category: 'Setup' },
    { title: 'Support Tickets', subtitle: 'Customer complaints and helpdesk tickets', url: '/billing/support-tickets', icon: HelpCircle, category: 'Support' },
  ];

  // Filter items based on query
  const filteredItems = navigationItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Also attach to topnav search inputs if clicked
    const searchInputs = document.querySelectorAll('.search-box .search-input');
    const handleSearchClick = (e: Event) => {
      e.preventDefault();
      setIsOpen(true);
    };
    searchInputs.forEach((input) => input.addEventListener('click', handleSearchClick));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      searchInputs.forEach((input) => input.removeEventListener('click', handleSearchClick));
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    window.location.href = url;
  };

  const handleArrowNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="billing-cmd-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start justify-content-center pt-5"
      style={{
        zIndex: 9999,
        background: 'rgba(5, 5, 7, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div
        className="billing-cmd-modal shadow-2xl overflow-hidden"
        style={{
          width: '90%',
          maxWidth: 620,
          background: palette.cardBg,
          border: `1px solid ${palette.cardBorder}`,
          borderRadius: 16,
          boxShadow: isDark ? '0 25px 60px -15px rgba(0, 0, 0, 0.8)' : '0 20px 40px -10px rgba(0, 0, 0, 0.12)',
          animation: 'modalSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Search Input Bar */}
        <div className="d-flex align-items-center px-3 py-2.5 border-bottom" style={{ borderColor: palette.cardBorder }}>
          <Search size={18} style={{ color: palette.textSecondary }} className="me-2.5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-100 bg-transparent border-0 outline-none shadow-none"
            placeholder="Type a command or jump to page... (e.g. PPPoE, Customer, Invoices)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleArrowNavigation}
            style={{ fontSize: '0.95rem', outline: 'none', color: palette.textPrimary }}
          />
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-sm btn-link text-muted p-1 ms-2"
            style={{ textDecoration: 'none' }}
          >
            <kbd className="px-1.5 py-0.5 rounded" style={{ background: palette.surfaceElevated, border: `1px solid ${palette.cardBorder}`, color: palette.textSecondary, fontSize: '0.68rem' }}>ESC</kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="scrollbar-thin p-2" style={{ maxHeight: 380, overflowY: 'auto' }}>
          {filteredItems.length === 0 ? (
            <div className="text-center py-5 text-muted small">
              No matching pages or tools found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={item.url}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className="d-flex align-items-center justify-content-between p-2.5"
                  style={{
                    background: isSelected ? (isDark ? '#ffffff' : '#09090b') : 'transparent',
                    color: isSelected ? (isDark ? '#09090b' : '#ffffff') : palette.textPrimary,
                    borderRadius: 10,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    boxShadow: isSelected ? (isDark ? '0 4px 14px rgba(255, 255, 255, 0.18)' : '0 4px 14px rgba(0, 0, 0, 0.25)') : 'none',
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: 34,
                        height: 34,
                        background: isSelected ? (isDark ? '#09090b' : '#ffffff') : palette.surfaceElevated,
                        color: isSelected ? (isDark ? '#ffffff' : '#09090b') : palette.textSecondary,
                        border: `1px solid ${isSelected ? 'transparent' : palette.cardBorder}`,
                        borderRadius: 8,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: '0.86rem', color: isSelected ? (isDark ? '#09090b' : '#ffffff') : palette.textPrimary }}>
                        {item.title}
                      </div>
                      <div className="small" style={{ fontSize: '0.74rem', color: isSelected ? (isDark ? '#52525b' : '#a1a1aa') : palette.textMuted }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="badge font-mono"
                      style={{
                        background: isSelected ? (isDark ? 'rgba(9, 9, 11, 0.12)' : 'rgba(255, 255, 255, 0.2)') : palette.badgeBg,
                        color: isSelected ? (isDark ? '#09090b' : '#ffffff') : palette.badgeText,
                        border: `1px solid ${isSelected ? 'transparent' : palette.badgeBorder}`,
                        fontSize: '0.68rem',
                        borderRadius: 6,
                        padding: '3px 7px',
                      }}
                    >
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft size={13} style={{ color: isDark ? '#09090b' : '#ffffff' }} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-top" style={{ background: palette.surfaceElevated, borderColor: palette.cardBorder, color: palette.textMuted, fontSize: '0.72rem' }}>
          <div className="d-flex align-items-center gap-3">
            <span><kbd style={{ background: palette.cardBg, border: `1px solid ${palette.cardBorder}`, color: palette.textSecondary, padding: '1px 4px', borderRadius: 4 }}>↑</kbd> <kbd style={{ background: palette.cardBg, border: `1px solid ${palette.cardBorder}`, color: palette.textSecondary, padding: '1px 4px', borderRadius: 4 }}>↓</kbd> to navigate</span>
            <span><kbd style={{ background: palette.cardBg, border: `1px solid ${palette.cardBorder}`, color: palette.textSecondary, padding: '1px 4px', borderRadius: 4 }}>↵</kbd> to open</span>
          </div>
          <span>Smart ISP Quick Command Palette</span>
        </div>
      </div>
    </div>
  );
}
