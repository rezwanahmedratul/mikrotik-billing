<nav class="navbar navbar-light navbar-vertical navbar-expand-xl">
    <script>
        var navbarStyle = localStorage.getItem("navbarStyle");
        if (navbarStyle && navbarStyle !== 'transparent') {
            document.querySelector('.navbar-vertical').classList.add(`navbar-${navbarStyle}`);
        }
    </script>
    <div class="d-flex align-items-center justify-content-between px-3 py-3 border-bottom sidebar-brand-header">
        <a class="navbar-brand d-flex align-items-center gap-2.5 p-0 m-0 text-decoration-none" href="{{url('/')}}">
            @if (siteUrlSettings('site_logo'))
                <img style="width: 140px; height: auto; max-height: 38px; object-fit: contain; flex-shrink: 0;" src="{{ site_image(siteUrlSettings('site_logo')) }}" alt="logo"/>
            @else
                {{-- Sleek modern glowing brand mark emblem --}}
                <div class="brand-logo-emblem d-flex align-items-center justify-content-center rounded-3 flex-shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="20" height="8" x="2" y="14" rx="2" />
                        <path d="M6 18h.01" />
                        <path d="M10 18h.01" />
                        <path d="M15 10v4" />
                        <path d="M17.8 8A6 6 0 0 0 6.2 8" />
                        <path d="m9 2 3 3-3 3" />
                    </svg>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold font-sans brand-title" style="font-size: 1.05rem; letter-spacing: -0.02em;">
                        {{ siteUrlSettings('site_name') ?? 'Smart ISP' }}
                    </span>
                    <span class="badge font-mono brand-noc-badge">
                        NOC
                    </span>
                </div>
            @endif
        </a>
    </div>
    <script>
        window.__SIDEBAR_CONFIG__ = {
            currentPath: "{{ request()->path() }}",
            currentUrl: "{{ url()->current() }}",
            isReseller: {{ auth()->check() && auth()->user()->hasRole('Reseller') ? 'true' : 'false' }},
            routes: {
                dashboard: "{{ route('dashboard') }}",
                mikrotikSync: "{{ route('mikrotik-sync') }}",
                mikrotikIpSetup: "{{ route('mikrotik-ip-setup') }}",
                mikrotikPppoeSetup: "{{ route('mikrotik-pppoe-setup') }}",
                mikrotikRadiusSetup: "{{ route('mikrotik-radius-setup') }}",
                mikrotikFirewallSetup: "{{ route('mikrotik-firewall-setup') }}",
                mikrotikWalledGarden: "{{ route('mikrotik-walled-garden') }}",
                mikrotikQueueSetup: "{{ route('mikrotik-queue-setup') }}",
                mikrotikVpnSetup: "{{ route('mikrotik-vpn-setup') }}",
                mikrotikInterfaceSetup: "{{ route('mikrotik-interface-setup') }}",
                mikrotikTrafficMonitor: "{{ route('mikrotik-traffic-monitor') }}",
                mikrotikBackupSetup: "{{ route('mikrotik-backup-setup') }}",
                mikrotikHotspotManager: "{{ route('mikrotik-hotspot-manager') }}",
                newCustomer: "{{ route('new-customer') }}",
                customersIndex: "{{ route('customers.index') }}",
                adminTickets: "{{ route('admin-tickets') }}",
                paymentCollection: "{{ route('payment-collection') }}",
                collectionEdit: "{{ route('collection-edit') }}",
                paymentInvoice: "{{ route('payment-invoice') }}",
                collectionReportIndex: "{{ route('collection-report.index') }}",
                customerSummary: "{{ route('customer-summary') }}",
                disReport: "{{ route('dis-report') }}",
                adminExpenses: "{{ route('admin.expenses') }}",
                adminProfitSummary: "{{ route('admin.profit-summary') }}",
                addressSetup: "{{ route('address-setup') }}",
                packageListSetup: "{{ route('package-list-setup') }}",
                adminPurchaseRequests: "{{ route('admin.purchase-requests') }}",
                adminResellersIndex: "{{ route('admin.resellers.index') }}",
                adminActivityLogs: "{{ route('admin.activity-logs') }}",
                adminLoginLogs: "{{ route('admin.login-logs') }}",
                adminSystemLogs: "{{ route('admin.system-logs') }}",
                mikrotikLogViewer: "{{ route('mikrotik-log-viewer') }}",
                adminVouchers: "{{ route('admin.vouchers') }}",
                adminReviews: "{{ route('admin.reviews') }}",
                smsSetup: "{{ route('sms-setup') }}",
                smsBridgeIndex: "{{ route('sms-bridge.index') }}",
            }
        };
    </script>
    <div class="collapse navbar-collapse" id="navbarVerticalCollapse">
        <div class="navbar-vertical-content scrollbar d-flex flex-column justify-content-between h-100">
            <div id="react-sidebar-root">
                @include('layouts.partials.sidebarpanel')
            </div>

            {{-- Sleek System Operational Widget replacing generic promo box --}}
            <div class="sidebar-status-widget mx-2.5 my-3 p-3 rounded-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span>
                        <span class="daemon-title" style="font-size:0.75rem; font-weight:600;">RouterOS Daemon</span>
                    </div>
                    <span class="badge font-mono daemon-badge">
                        LIVE
                    </span>
                </div>
                <div class="d-flex align-items-center justify-content-between pt-2 border-top daemon-footer"
                     style="font-size:0.7rem;">
                    <span>System Engine</span>
                    <span class="font-mono text-muted">v2.4 Pro</span>
                </div>
            </div>
        </div>
    </div>
</nav>
