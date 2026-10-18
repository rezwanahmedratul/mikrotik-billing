import React from 'react';
import { createRoot } from 'react-dom/client';
import BillingDashboard from './billing/BillingDashboard';
import MikrotikControlDashboard from './billing/MikrotikControlDashboard';
import CommandPalette from './billing/CommandPalette';

// Mount Billing Dashboard if container is present on /billing/dashboard
const dashboardRootEl = document.getElementById('billing-dashboard-react-root');
if (dashboardRootEl) {
  const initialData = window.__BILLING_DASHBOARD_DATA__ || {};
  const root = createRoot(dashboardRootEl);
  root.render(
    <React.StrictMode>
      <BillingDashboard initialData={initialData} />
    </React.StrictMode>
  );
}

// Mount Dedicated MikroTik Control Dashboard if container is present on /billing/mikrotik
const mikrotikRootEl = document.getElementById('mikrotik-dashboard-react-root');
if (mikrotikRootEl) {
  const initialData = {
    csrfToken: window.__MIKROTIK_CSRF_TOKEN__ || '',
    initialRouters: window.__MIKROTIK_INITIAL_ROUTERS__ || [],
  };
  const mRoot = createRoot(mikrotikRootEl);
  mRoot.render(
    <React.StrictMode>
      <MikrotikControlDashboard initialData={initialData} isStandalone={true} />
    </React.StrictMode>
  );
}

// Mount Global Command Palette if container is present in billing layout
const commandPaletteRootEl = document.getElementById('billing-command-palette-root');
if (commandPaletteRootEl) {
  const cmdRoot = createRoot(commandPaletteRootEl);
  cmdRoot.render(
    <React.StrictMode>
      <CommandPalette />
    </React.StrictMode>
  );
}
