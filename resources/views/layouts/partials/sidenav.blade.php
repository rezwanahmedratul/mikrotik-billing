@php
    $user = auth()->user();
    $isReseller = $user && $user->hasRole('Reseller');
    $isSuperAdmin = $user && $user->hasRole('Super Admin');
    $permissions = $user ? $user->getAllPermissions()->pluck('name')->toArray() : [];

    $safeRoute = function($name, $fallback = '#') {
        return \Illuminate\Support\Facades\Route::has($name) ? route($name) : url($fallback);
    };

    $routes = [
        'dashboard' => $safeRoute('dashboard', '/billing/dashboard'),
        'mikrotikSync' => $safeRoute('mikrotik-sync', '/billing/mikrotik'),
        'mikrotikIpSetup' => $safeRoute('mikrotik-ip-setup', '/billing/mikrotik-setup/ip'),
        'mikrotikPppoeSetup' => $safeRoute('mikrotik-pppoe-setup', '/billing/mikrotik-setup/pppoe'),
        'mikrotikRadiusSetup' => $safeRoute('mikrotik-radius-setup', '/billing/mikrotik-setup/radius'),
        'mikrotikFirewallSetup' => $safeRoute('mikrotik-firewall-setup', '/billing/mikrotik-setup/firewall'),
        'mikrotikWalledGarden' => $safeRoute('mikrotik-walled-garden', '/billing/mikrotik-setup/walled-garden'),
        'mikrotikQueueSetup' => $safeRoute('mikrotik-queue-setup', '/billing/mikrotik-setup/queue'),
        'mikrotikVpnSetup' => $safeRoute('mikrotik-vpn-setup', '/billing/mikrotik-setup/vpn'),
        'mikrotikInterfaceSetup' => $safeRoute('mikrotik-interface-setup', '/billing/mikrotik-setup/interface'),
        'mikrotikTrafficMonitor' => $safeRoute('mikrotik-traffic-monitor', '/billing/mikrotik-setup/traffic'),
        'mikrotikBackupSetup' => $safeRoute('mikrotik-backup-setup', '/billing/mikrotik-setup/backup'),
        'mikrotikHotspotManager' => $safeRoute('mikrotik-hotspot-manager', '/billing/mikrotik-setup/hotspot-manager'),
        'newCustomer' => $safeRoute('new-customer', '/billing/create-customer'),
        'customersIndex' => $safeRoute('customers.index', '/billing/customers'),
        'adminTickets' => $safeRoute('admin-tickets', '/billing/support-tickets'),
        'paymentCollection' => $safeRoute('payment-collection', '/billing/payment-collection'),
        'collectionEdit' => $safeRoute('collection-edit', '/billing/collection-edit'),
        'paymentInvoice' => $safeRoute('payment-invoice', '/billing/payment-invoice'),
        'collectionReportIndex' => $safeRoute('collection-report.index', '/billing/collection-report'),
        'customerSummary' => $safeRoute('customer-summary', '/billing/customer-summary'),
        'disReport' => $safeRoute('dis-report', '/billing/report/dis-report'),
        'adminExpenses' => $safeRoute('admin.expenses', '/billing/admin/expenses'),
        'adminProfitSummary' => $safeRoute('admin.profit-summary', '/billing/admin/profit-summary'),
        'addressSetup' => $safeRoute('address-setup', '/billing/address'),
        'packageListSetup' => $safeRoute('package-list-setup', '/billing/packages'),
        'adminPurchaseRequests' => $safeRoute('admin.purchase-requests', '/billing/admin/purchase-requests'),
        'adminResellersIndex' => $safeRoute('admin.resellers.index', '/billing/admin/resellers'),
        'adminActivityLogs' => $safeRoute('admin.activity-logs', '/billing/admin/activity-logs'),
        'adminLoginLogs' => $safeRoute('admin.login-logs', '/billing/admin/login-logs'),
        'adminSystemLogs' => $safeRoute('admin.system-logs', '/billing/admin/system-logs'),
        'mikrotikLogViewer' => $safeRoute('mikrotik-log-viewer', '/billing/mikrotik-setup/logs'),
        'adminVouchers' => $safeRoute('admin.vouchers', '/billing/admin/vouchers'),
        'adminReviews' => $safeRoute('admin.reviews', '/billing/admin/reviews'),
        'smsSetup' => $safeRoute('sms-setup', '/billing/sms'),
        'smsBridgeIndex' => $safeRoute('sms-bridge.index', '/billing/sms-bridge'),
        'resellerDashboard' => $safeRoute('reseller.dashboard', '/billing/reseller/dashboard'),
        'resellerCustomers' => $safeRoute('reseller.customers.index', '/billing/reseller/customers'),
        'resellerNewCustomer' => $safeRoute('reseller.customers.create', '/billing/reseller/customers/create'),
        'resellerWallet' => $safeRoute('reseller.wallet.index', '/billing/reseller/wallet'),
        'resellerVouchers' => $safeRoute('reseller.vouchers.index', '/billing/reseller/vouchers'),
        'resellerPackages' => $safeRoute('reseller.packages.index', '/billing/reseller/packages'),
        'profileShow' => $safeRoute('profile.show', '/billing/user/profile'),
    ];
@endphp

<nav class="navbar navbar-light navbar-vertical navbar-expand-xl mono-sidebar-nav-wrapper">
    {{-- Sidebar Brand Header --}}
    <div class="sidebar-brand-header d-flex align-items-center justify-content-between px-3 border-bottom" style="height: 60px; min-height: 60px;">
        <a class="navbar-brand d-flex align-items-center gap-2 p-0 m-0 text-decoration-none" href="{{ url('/') }}" wire:navigate>
            @if (siteUrlSettings('site_logo'))
                <img style="width: 135px; height: auto; max-height: 34px; object-fit: contain; flex-shrink: 0;" src="{{ site_image(siteUrlSettings('site_logo')) }}" alt="logo"/>
            @else
                <div class="brand-logo-emblem d-flex align-items-center justify-content-center rounded-2 flex-shrink-0" style="width: 30px; height: 30px;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="20" height="8" x="2" y="14" rx="2" />
                        <path d="M6 18h.01" />
                        <path d="M10 18h.01" />
                        <path d="M15 10v4" />
                        <path d="M17.8 8A6 6 0 0 0 6.2 8" />
                        <path d="m9 2 3 3-3 3" />
                    </svg>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold font-sans brand-title" style="font-size: 0.98rem; letter-spacing: -0.02em;">
                        {{ siteUrlSettings('site_name') ?? 'Smart ISP' }}
                    </span>
                    <span class="badge font-mono brand-noc-badge" style="font-size: 0.6rem; padding: 2px 5px;">
                        NOC
                    </span>
                </div>
            @endif
        </a>
    </div>

    {{-- Configuration injected safely into window for React Hydration --}}
    <script>
        window.__SIDEBAR_CONFIG__ = {
            currentPath: "{{ '/' . ltrim(request()->path(), '/') }}",
            currentUrl: "{{ url()->current() }}",
            isReseller: {{ $isReseller ? 'true' : 'false' }},
            isSuperAdmin: {{ $isSuperAdmin ? 'true' : 'false' }},
            permissions: @json($permissions),
            routes: @json($routes),
            siteName: "{{ siteUrlSettings('site_name') ?? 'Smart ISP' }}",
        };
    </script>

    {{-- React Sidebar Root Container: wire:persist ensures DOM is kept alive during Livewire navigation --}}
    <div class="navbar-collapse show d-flex flex-column flex-grow-1 overflow-hidden" id="navbarVerticalCollapse">
        <div class="navbar-vertical-content scrollbar d-flex flex-column flex-grow-1 w-100 p-0" style="padding: 0 !important; overflow-y: auto; overflow-x: hidden;">
            <div id="react-sidebar-root" wire:persist="smart-isp-sidebar" class="d-flex flex-column flex-grow-1 w-100"></div>
        </div>
    </div>
</nav>
