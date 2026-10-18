import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import BillingDashboard from './billing/BillingDashboard';
import MikrotikControlDashboard from './billing/MikrotikControlDashboard';
import CommandPalette from './billing/CommandPalette';
import SidebarNavigation from './navigation/SidebarNavigation';
import TopNavbar from './navigation/TopNavbar';

// Declare global window properties
declare global {
  interface Window {
    __BILLING_DASHBOARD_DATA__?: any;
    __MIKROTIK_CSRF_TOKEN__?: string;
    __MIKROTIK_INITIAL_ROUTERS__?: any[];
  }
}

// Sidebar Root instance reference to prevent duplicate createRoot calls
let sidebarRootInstance: Root | null = null;
let topbarRootInstance: Root | null = null;
let commandPaletteRootInstance: Root | null = null;

export function mountSidebarNavigation(): void {
  const sidebarRootEl = document.getElementById('react-sidebar-root');
  if (!sidebarRootEl) {
    sidebarRootInstance = null;
    return;
  }

  // If already mounted and has children, do nothing
  if (sidebarRootEl.dataset.reactMounted === 'true' && sidebarRootEl.childElementCount > 0) {
    return;
  }

  try {
    if (!sidebarRootInstance) {
      sidebarRootInstance = createRoot(sidebarRootEl);
    }
    sidebarRootEl.dataset.reactMounted = 'true';
    sidebarRootInstance.render(
      <React.StrictMode>
        <SidebarNavigation />
      </React.StrictMode>
    );
  } catch (err) {
    // If createRoot fails due to container replacement, recreate
    try {
      sidebarRootInstance = createRoot(sidebarRootEl);
      sidebarRootEl.dataset.reactMounted = 'true';
      sidebarRootInstance.render(
        <React.StrictMode>
          <SidebarNavigation />
        </React.StrictMode>
      );
    } catch (e) {
      console.error('Sidebar mount error:', e);
    }
  }
}

export function mountTopNavbar(): void {
  const topbarRootEl = document.getElementById('react-topbar-root');
  if (!topbarRootEl) {
    topbarRootInstance = null;
    return;
  }
  if (topbarRootEl.dataset.reactMounted === 'true' && topbarRootEl.childElementCount > 0) {
    return;
  }
  try {
    if (!topbarRootInstance) {
      topbarRootInstance = createRoot(topbarRootEl);
    }
    topbarRootEl.dataset.reactMounted = 'true';
    topbarRootInstance.render(
      <React.StrictMode>
        <TopNavbar />
      </React.StrictMode>
    );
  } catch {
    try {
      topbarRootInstance = createRoot(topbarRootEl);
      topbarRootEl.dataset.reactMounted = 'true';
      topbarRootInstance.render(
        <React.StrictMode>
          <TopNavbar />
        </React.StrictMode>
      );
    } catch {}
  }
}

export function mountCommandPalette(): void {
  const commandPaletteRootEl = document.getElementById('billing-command-palette-root');
  if (!commandPaletteRootEl) return;
  if (commandPaletteRootEl.dataset.reactMounted === 'true' && commandPaletteRootEl.childElementCount > 0) {
    return;
  }
  try {
    if (!commandPaletteRootInstance) {
      commandPaletteRootInstance = createRoot(commandPaletteRootEl);
    }
    commandPaletteRootEl.dataset.reactMounted = 'true';
    commandPaletteRootInstance.render(
      <React.StrictMode>
        <CommandPalette />
      </React.StrictMode>
    );
  } catch {}
}

export function mountPageDashboards(): void {
  // Mount Billing Dashboard if container is present on /billing/dashboard
  const dashboardRootEl = document.getElementById('billing-dashboard-react-root');
  if (dashboardRootEl && !dashboardRootEl.dataset.reactMounted) {
    dashboardRootEl.dataset.reactMounted = 'true';
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
  if (mikrotikRootEl && !mikrotikRootEl.dataset.reactMounted) {
    mikrotikRootEl.dataset.reactMounted = 'true';
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
}

// Mount all components
function mountAll(): void {
  mountTopNavbar();
  mountSidebarNavigation();
  mountCommandPalette();
  mountPageDashboards();
}

// Initial hydration
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll);
} else {
  mountAll();
}

// Handle Livewire 3 wire:navigate transitions
document.addEventListener('livewire:navigated', () => {
  mountAll();
});
