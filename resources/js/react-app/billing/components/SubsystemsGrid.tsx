import React from 'react';
import {
  Layers,
  Server,
  Wifi,
  Activity,
  Shield,
  Database,
  Lock,
  Terminal,
  HardDrive,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';

interface SubsystemItem {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
}

export default function SubsystemsGrid() {
  const subsystems: SubsystemItem[] = [
    { title: 'PPPoE Server', desc: 'Active connections & secrets', icon: Server, href: '/billing/mikrotik-setup/pppoe' },
    { title: 'Hotspot Manager', desc: 'Vouchers, active hosts, bindings', icon: Wifi, href: '/billing/mikrotik-setup/hotspot-manager' },
    { title: 'Queue & Bandwidth', desc: 'Simple queues & speed limits', icon: Activity, href: '/billing/mikrotik-setup/queue' },
    { title: 'Firewall & NAT', desc: 'Filter rules, nat, address lists', icon: Shield, href: '/billing/mikrotik-setup/firewall' },
    { title: 'IP Pool & DHCP', desc: 'IP ranges & dynamic pools', icon: Database, href: '/billing/mikrotik-setup/ip' },
    { title: 'Walled Garden', desc: 'Expired user portal bypass', icon: Lock, href: '/billing/mikrotik-setup/walled-garden' },
    { title: 'Router Logs', desc: 'Real-time ROS system event logs', icon: Terminal, href: '/billing/mikrotik-setup/logs' },
    { title: 'Backup & Restore', desc: 'Binary backup & script export', icon: HardDrive, href: '/billing/mikrotik-setup/backup' },
  ];

  return (
    <div
      className="card p-3.5 p-md-4 mb-4"
      style={{
        background: 'var(--mono-card)',
        border: '1px solid var(--mono-card-border)',
        borderRadius: 14,
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Layers size={17} style={{ color: 'var(--mono-text-secondary)' }} />
          <h5 className="fw-bold mb-0" style={{ fontSize: '0.94rem', letterSpacing: '-0.01em', color: 'var(--mono-text-primary)' }}>
            RouterOS Subsystem Control Shortcuts
          </h5>
        </div>
        <span className="small font-mono" style={{ fontSize: '0.72rem', color: 'var(--mono-text-muted)' }}>
          Deep-Link Navigation
        </span>
      </div>

      <div className="row g-2.5">
        {subsystems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="col-12 col-sm-6 col-lg-3">
              <a
                href={item.href}
                className="p-3 d-flex align-items-center justify-content-between text-decoration-none hover-lift w-100"
                style={{
                  background: 'var(--mono-surface-elevated)',
                  border: '1px solid var(--mono-card-border)',
                  borderRadius: 10,
                  display: 'block',
                  transition: 'border-color 0.18s ease, transform 0.18s ease',
                }}
              >
                <div className="d-flex align-items-center gap-2.5">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: 34,
                      height: 34,
                      background: 'var(--mono-card)',
                      border: '1px solid var(--mono-card-border)',
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} style={{ color: 'var(--mono-text-primary)' }} />
                  </div>
                  <div>
                    <div className="fw-semibold text-truncate" style={{ fontSize: '0.82rem', color: 'var(--mono-text-primary)' }}>
                      {item.title}
                    </div>
                    <div className="text-muted small text-truncate" style={{ fontSize: '0.7rem' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--mono-text-muted)', flexShrink: 0 }} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
