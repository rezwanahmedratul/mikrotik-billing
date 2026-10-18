<div>
    <!-- Header -->
    <x-slot name="header">
        {{ __('MikroTik Network Control Hub') }}
    </x-slot>

    {{-- React MikroTik Controlling Dashboard Mounting Point --}}
    <div id="mikrotik-dashboard-react-root">
        {{-- Skeleton Loader while React Mounts --}}
        <div class="p-4 rounded-3 text-center" style="background: #121216; border: 1px solid rgba(255, 255, 255, 0.08); min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div class="spinner-border text-light mb-3" role="status" style="width: 2rem; height: 2rem;">
                <span class="visually-hidden">Loading MikroTik Control Center...</span>
            </div>
            <p class="text-muted small mb-0" style="color: #a1a1aa;">Initializing MikroTik NOC Telemetry & Socket Pools...</p>
        </div>
    </div>

    {{-- Inject Initial Data Payload --}}
    <script>
        window.__MIKROTIK_CSRF_TOKEN__ = '{{ csrf_token() }}';
        window.__MIKROTIK_INITIAL_ROUTERS__ = {!! json_encode($routers->items() ?? [], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) !!};
    </script>

</div>
