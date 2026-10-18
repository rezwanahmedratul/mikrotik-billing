<x-app-layout>

    {{-- React Dashboard Mounting Point --}}
    <div id="billing-dashboard-react-root">
        {{-- Loading Skeleton while React Mounts --}}
        <div class="p-4 rounded-3 text-center" style="background: var(--mono-card); border: 1px solid var(--mono-card-border); min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div class="spinner-border mb-3" role="status" style="width: 2rem; height: 2rem; color: var(--mono-text-secondary);">
                <span class="visually-hidden">Loading Dashboard...</span>
            </div>
            <p class="small mb-0" style="color: var(--mono-text-muted);">Initializing Smart ISP React Telemetry...</p>
        </div>
    </div>

    {{-- Inject Real-Time Dashboard Payload Safely --}}
    <script>
        window.__BILLING_DASHBOARD_DATA__ = {!! $dashboardJson ?? '{}' !!};
    </script>
</x-app-layout>
