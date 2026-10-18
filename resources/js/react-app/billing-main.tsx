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
let currentSidebarEl: HTMLElement | null = null;
let topbarRootInstance: Root | null = null;
let currentTopbarEl: HTMLElement | null = null;
let commandPaletteRootInstance: Root | null = null;
let currentCommandPaletteEl: HTMLElement | null = null;

export function mountSidebarNavigation(): void {
  const sidebarRootEl = document.getElementById('react-sidebar-root');
  if (!sidebarRootEl) {
    sidebarRootInstance = null;
    currentSidebarEl = null;
    return;
  }

  // If already mounted on this exact DOM node and contains elements, do nothing
  if (currentSidebarEl === sidebarRootEl && sidebarRootEl.childElementCount > 0) {
    return;
  }

  try {
    if (sidebarRootInstance && currentSidebarEl !== sidebarRootEl) {
      sidebarRootInstance = null;
    }
    if (!sidebarRootInstance) {
      sidebarRootInstance = createRoot(sidebarRootEl);
      currentSidebarEl = sidebarRootEl;
    }
    sidebarRootEl.dataset.reactMounted = 'true';
    sidebarRootInstance.render(
      <React.StrictMode>
        <SidebarNavigation />
      </React.StrictMode>
    );
  } catch (err) {
    try {
      sidebarRootInstance = createRoot(sidebarRootEl);
      currentSidebarEl = sidebarRootEl;
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
    currentTopbarEl = null;
    return;
  }
  if (currentTopbarEl === topbarRootEl && topbarRootEl.childElementCount > 0) {
    return;
  }
  try {
    if (topbarRootInstance && currentTopbarEl !== topbarRootEl) {
      topbarRootInstance = null;
    }
    if (!topbarRootInstance) {
      topbarRootInstance = createRoot(topbarRootEl);
      currentTopbarEl = topbarRootEl;
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
      currentTopbarEl = topbarRootEl;
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
  if (!commandPaletteRootEl) {
    commandPaletteRootInstance = null;
    currentCommandPaletteEl = null;
    return;
  }
  if (currentCommandPaletteEl === commandPaletteRootEl && commandPaletteRootEl.childElementCount > 0) {
    return;
  }
  try {
    if (commandPaletteRootInstance && currentCommandPaletteEl !== commandPaletteRootEl) {
      commandPaletteRootInstance = null;
    }
    if (!commandPaletteRootInstance) {
      commandPaletteRootInstance = createRoot(commandPaletteRootEl);
      currentCommandPaletteEl = commandPaletteRootEl;
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
