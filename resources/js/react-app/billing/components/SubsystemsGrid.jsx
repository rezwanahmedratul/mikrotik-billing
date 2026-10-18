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
} from 'lucide-react';

export default function SubsystemsGrid() {
  const subsystems = [
    { title: 'PPPoE Server', desc: 'Active connections & secrets', icon: Server, color: '#10b981', href: '/billing/mikrotik-setup/pppoe' },
    { title: 'Hotspot Manager', desc: 'Vouchers, active hosts, bindings', icon: Wifi, color: '#f59e0b', href: '/billing/mikrotik-setup/hotspot-manager' },
    { title: 'Queue & Bandwidth', desc: 'Simple queues & speed limits', icon: Activity, color: '#06b6d4', href: '/billing/mikrotik-setup/queue' },
    { title: 'Firewall & NAT', desc: 'Filter rules, nat, address lists', icon: Shield, color: '#f43f5e', href: '/billing/mikrotik-setup/firewall' },
    { title: 'IP Pool & DHCP', desc: 'IP ranges & dynamic pools', icon: Database, color: '#8b5cf6', href: '/billing/mikrotik-setup/ip' },
    { title: 'Walled Garden', desc: 'Expired user portal bypass', icon: Lock, color: '#ec4899', href: '/billing/mikrotik-setup/walled-garden' },
    { title: 'Router Logs', desc: 'Real-time ROS system event logs', icon: Terminal, color: '#38bdf8', href: '/billing/mikrotik-setup/logs' },
    { title: 'Backup & Restore', desc: 'Binary backup & script export', icon: HardDrive, color: '#a1a1aa', href: '/billing/mikrotik-setup/backup' },
  ];

  return (
    <div
      className="card p-3.5 p-md-4 mb-4"
      style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Layers size={18} style={{ color: '#a1a1aa' }} />
          <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
            RouterOS Subsystem Control Shortcuts
          </h5>
        </div>
        <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
          Instant deep-link navigation
        </span>
      </div>

      <div className="row g-2.5">
        {subsystems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="col-12 col-sm-6 col-lg-3">
              <a
                href={item.href}
                className="p-3 rounded-3 d-flex align-items-center justify-content-between text-decoration-none hover-lift w-100"
                style={{
                  background: '#16161c',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'block',
                }}
              >
                <div className="d-flex align-items-center gap-2.5">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ width: 34, height: 34, background: '#1c1c24', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                  >
                    <Icon size={16} style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="fw-semibold text-white" style={{ fontSize: '0.82rem' }}>
                      {item.title}
                    </div>
                    <div className="text-muted small" style={{ fontSize: '0.7rem' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
