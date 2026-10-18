<x-app-layout>
    <x-slot name="header">
        {{ __('Dashboard') }}
    </x-slot>

    {{-- React Dashboard Mounting Point --}}
    <div id="billing-dashboard-react-root">
        {{-- Loading Skeleton while React Mounts --}}
        <div class="p-4 rounded-3 text-center" style="background: #121216; border: 1px solid rgba(255, 255, 255, 0.08); min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div class="spinner-border text-light mb-3" role="status" style="width: 2rem; height: 2rem;">
                <span class="visually-hidden">Loading Dashboard...</span>
            </div>
            <p class="text-muted small mb-0" style="color: #a1a1aa;">Initializing Smart ISP React Telemetry...</p>
        </div>
    </div>

    {{-- Inject Real-Time Dashboard Payload Safely --}}
    <script>
        window.__BILLING_DASHBOARD_DATA__ = {!! $dashboardJson ?? '{}' !!};
    </script>

    @push('scripts')
        @vite(['resources/js/react-app/billing-main.jsx'])
    @endpush
</x-app-layout>
