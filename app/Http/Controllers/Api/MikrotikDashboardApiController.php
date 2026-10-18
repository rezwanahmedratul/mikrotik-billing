<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MikrotikController;
use App\Livewire\MikrotikSync;
use App\Models\PPPSecrets;
use App\Models\RouterList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MikrotikDashboardApiController extends Controller
{
    /**
     * Get complete MikroTik ecosystem overview, hardware telemetry & statistics.
     */
    public function getOverview(): JsonResponse
    {
        try {
            $routers = RouterList::orderBy('id', 'asc')->get();

            // Secret counts per router
            $secretCounts = PPPSecrets::where('status', '!=', 'removed')
                ->selectRaw('router_name, count(*) as count')
                ->groupBy('router_name')
                ->pluck('count', 'router_name')
                ->toArray();

            // Hardware telemetry from all routers
            $telemetry = [];
            try {
                $telemetry = app(MikrotikController::class)->systemOverview();
            } catch (\Exception $e) {
                Log::warning('Mikrotik telemetry fetch error: ' . $e->getMessage());
            }

            $routerItems = [];
            $onlineCount = 0;
            $offlineCount = 0;
            $totalCpuLoad = 0;
            $validCpuCount = 0;

            foreach ($routers as $r) {
                $rName = $r->router_name;
                $tel = $telemetry[$rName] ?? null;
                $isOnline = false;
                $hardware = null;

                if ($tel && !empty($tel['status'])) {
                    $isOnline = true;
                    $onlineCount++;
                    $data = is_array($tel['data']) ? ($tel['data'][0] ?? $tel['data']) : [];

                    $cpuLoad = isset($data['cpu-load']) ? (int) preg_replace('/\D/', '', (string) $data['cpu-load']) : 0;
                    $totalCpuLoad += $cpuLoad;
                    $validCpuCount++;

                    $freeMem = isset($data['free-memory']) ? (int) preg_replace('/\D/', '', (string) $data['free-memory']) : 0;
                    $totalMem = isset($data['total-memory']) ? (int) preg_replace('/\D/', '', (string) $data['total-memory']) : 1;
                    $usedMem = max(0, $totalMem - $freeMem);
                    $memPercent = $totalMem > 0 ? round(($usedMem / $totalMem) * 100) : 0;

                    $freeHdd = isset($data['free-hdd-space']) ? (int) preg_replace('/\D/', '', (string) $data['free-hdd-space']) : 0;
                    $totalHdd = isset($data['total-hdd-space']) ? (int) preg_replace('/\D/', '', (string) $data['total-hdd-space']) : 1;
                    $usedHdd = max(0, $totalHdd - $freeHdd);
                    $hddPercent = $totalHdd > 0 ? round(($usedHdd / $totalHdd) * 100) : 0;

                    $hardware = [
                        'board_name' => $data['board-name'] ?? $data['model'] ?? 'RouterBOARD',
                        'architecture' => $data['architecture-name'] ?? 'mipsbe',
                        'version' => $data['version'] ?? '7.x',
                        'uptime' => $data['uptime'] ?? 'Unknown',
                        'cpu_load' => $cpuLoad,
                        'cpu_count' => (int) ($data['cpu-count'] ?? 1),
                        'cpu_frequency' => $data['cpu-frequency'] ?? 'N/A',
                        'free_memory' => $freeMem,
                        'total_memory' => $totalMem,
                        'used_memory' => $usedMem,
                        'memory_percent' => $memPercent,
                        'free_hdd' => $freeHdd,
                        'total_hdd' => $totalHdd,
                        'used_hdd' => $usedHdd,
                        'hdd_percent' => $hddPercent,
                        'cpu_temp' => $data['cpu-temperature'] ?? null,
                        'voltage' => $data['voltage'] ?? null,
                    ];
                } else {
                    $offlineCount++;
                }

                $routerItems[] = [
                    'id' => $r->id,
                    'router_name' => $r->router_name,
                    'ip_address' => $r->ip_address,
                    'username' => $r->username,
                    'ssh_port' => $r->ssh_port,
                    'api_port' => $r->api_port,
                    'action' => $r->action,
                    'is_connected' => $r->action === 'connected',
                    'is_online' => $isOnline,
                    'connection_type' => $tel['connection_type'] ?? ($r->api_port ? 'API' : 'SSH'),
                    'users_count' => $secretCounts[$rName] ?? 0,
                    'hardware' => $hardware,
                    'error' => ($tel && empty($tel['status'])) ? ($tel['message'] ?? 'Socket timeout') : null,
                ];
            }

            // Available interfaces for the first connected router
            $interfaces = [];
            $firstConnected = $routers->firstWhere('action', 'connected');
            if ($firstConnected) {
                try {
                    $rawIfs = app(MikrotikController::class)->getInterfaces($firstConnected->router_name);
                    $interfaces = collect($rawIfs)
                        ->map(fn($item) => $item['name'] ?? null)
                        ->filter()
                        ->values()
                        ->toArray();
                } catch (\Exception $e) {
                    $interfaces = ['ether1', 'ether2', 'ether3', 'bridge'];
                }
            }

            $avgCpuLoad = $validCpuCount > 0 ? round($totalCpuLoad / $validCpuCount) : 0;
            $totalSubscribers = array_sum($secretCounts);

            return response()->json([
                'success' => true,
                'summary' => [
                    'total_routers' => count($routers),
                    'online_routers' => $onlineCount,
                    'offline_routers' => $offlineCount,
                    'total_subscribers' => $totalSubscribers,
                    'avg_cpu_load' => $avgCpuLoad,
                ],
                'routers' => $routerItems,
                'interfaces' => $interfaces,
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            Log::error('MikrotikDashboardApi getOverview failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'summary' => [
                    'total_routers' => 0,
                    'online_routers' => 0,
                    'offline_routers' => 0,
                    'total_subscribers' => 0,
                    'avg_cpu_load' => 0,
                ],
                'routers' => [],
                'interfaces' => [],
            ], 500);
        }
    }

    /**
     * Toggle router connection state ('connected' / 'disconnected').
     */
    public function toggleConnect(Request $request): JsonResponse
    {
        $request->validate([
            'router_id' => 'required|integer|exists:router_lists,id',
        ]);

        $router = RouterList::findOrFail($request->router_id);
        $newAction = ($router->action === 'connected') ? 'disconnected' : 'connected';
        $router->action = $newAction;
        $router->save();

        if ($newAction === 'connected') {
            try {
                app(MikrotikSync::class)->dataSync($router->id);
            } catch (\Exception $e) {
                Log::warning("Data sync error after toggle: " . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Router '{$router->router_name}' is now {$newAction}.",
            'router' => [
                'id' => $router->id,
                'action' => $router->action,
                'is_connected' => $router->action === 'connected',
            ],
        ]);
    }

    /**
     * Synchronize a specific router or all connected routers.
     */
    public function syncRouter(Request $request): JsonResponse
    {
        $routerId = $request->input('router_id');

        if ($routerId) {
            $router = RouterList::findOrFail($routerId);
            if ($router->action !== 'connected') {
                return response()->json([
                    'success' => false,
                    'message' => "Router '{$router->router_name}' is not connected. Enable connection first.",
                ], 422);
            }

            try {
                app(MikrotikSync::class)->dataSync($router->id);
                $userCount = PPPSecrets::where('router_name', $router->router_name)->where('status', '!=', 'removed')->count();

                return response()->json([
                    'success' => true,
                    'message' => "Successfully synchronized router '{$router->router_name}'. Total secrets: {$userCount}",
                    'user_count' => $userCount,
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => "Sync failed: " . $e->getMessage(),
                ], 500);
            }
        }

        // Sync all connected routers
        try {
            app(MikrotikSync::class)->allSync();
            $totalUsers = PPPSecrets::where('status', '!=', 'removed')->count();

            return response()->json([
                'success' => true,
                'message' => "Fleet synchronization finished. Total active secrets across all routers: {$totalUsers}",
                'total_users' => $totalUsers,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Fleet sync failed: " . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Test socket connection and measure latency to MikroTik router.
     */
    public function testConnection(Request $request): JsonResponse
    {
        $routerId = $request->input('router_id');
        $ip = $request->input('ip_address');
        $username = $request->input('username');
        $password = $request->input('password');
        $sshPort = $request->input('ssh_port') ? (int) $request->input('ssh_port') : null;
        $apiPort = $request->input('api_port') ? (int) $request->input('api_port') : null;

        if ($routerId) {
            $router = RouterList::findOrFail($routerId);
            $ip = $router->ip_address;
            $username = $router->username;
            $password = $router->password;
            $sshPort = $router->ssh_port;
            $apiPort = $router->api_port;
        }

        if (!$ip || !$username) {
            return response()->json([
                'success' => false,
                'message' => 'IP address and username are required for connection test.',
            ], 422);
        }

        $startTime = microtime(true);
        $result = app(MikrotikController::class)->checkConnection(
            $ip,
            $sshPort,
            $apiPort,
            $username,
            $password ?? '',
            '/system/resource/print',
            '/system resource print',
            [],
            false
        );
        $latencyMs = round((microtime(true) - $startTime) * 1000);

        if (!empty($result['status'])) {
            return response()->json([
                'success' => true,
                'status' => 'online',
                'type' => $result['type'] ?? ($apiPort ? 'API' : 'SSH'),
                'latency_ms' => $latencyMs,
                'message' => "Connected successfully via {$result['type']} in {$latencyMs}ms.",
            ]);
        }

        return response()->json([
            'success' => false,
            'status' => 'offline',
            'latency_ms' => $latencyMs,
            'message' => $result['message'] ?? 'Connection refused or timeout.',
            'errors' => $result['errors'] ?? [],
        ]);
    }

    /**
     * Issue soft reboot command to a specific MikroTik router.
     */
    public function rebootRouter(Request $request): JsonResponse
    {
        $request->validate([
            'router_id' => 'required|integer|exists:router_lists,id',
        ]);

        $router = RouterList::findOrFail($request->router_id);

        try {
            app(MikrotikController::class)->singleWrite($router->router_name, '/system reboot');

            return response()->json([
                'success' => true,
                'message' => "Reboot command sent to '{$router->router_name}'. Device is restarting.",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Reboot failed: " . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get live interface traffic bits-per-second and Mbps.
     */
    public function getLiveTraffic(Request $request): JsonResponse
    {
        $routerName = $request->query('router_name');
        $interface = $request->query('interface');

        if (!$routerName || !$interface) {
            return response()->json([
                'success' => false,
                'message' => 'router_name and interface parameters are required.',
            ], 422);
        }

        try {
            $data = app(MikrotikController::class)->getLiveTraffic($routerName, $interface);
            $rxBps = (float) ($data['rx-bits-per-second'] ?? 0);
            $txBps = (float) ($data['tx-bits-per-second'] ?? 0);

            $rxMbps = round($rxBps / 1_000_000, 2);
            $txMbps = round($txBps / 1_000_000, 2);

            return response()->json([
                'success' => true,
                'router_name' => $routerName,
                'interface' => $interface,
                'rx_bps' => $rxBps,
                'tx_bps' => $txBps,
                'rx_mbps' => $rxMbps,
                'tx_mbps' => $txMbps,
                'timestamp' => now()->timestamp,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'rx_bps' => 0,
                'tx_bps' => 0,
                'rx_mbps' => 0,
                'tx_mbps' => 0,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Fetch active PPPoE sessions from router.
     */
    public function getActiveSessions(Request $request): JsonResponse
    {
        $routerName = $request->query('router_name');

        if (!$routerName) {
            $first = RouterList::where('action', 'connected')->first();
            $routerName = $first ? $first->router_name : null;
        }

        if (!$routerName) {
            return response()->json([
                'success' => true,
                'router_name' => '',
                'sessions' => [],
                'count' => 0,
            ]);
        }

        try {
            $raw = app(MikrotikController::class)->getActivePppSessions($routerName);
            $sessions = [];

            if (is_array($raw)) {
                foreach ($raw as $item) {
                    if (is_array($item)) {
                        $sessions[] = [
                            'name' => $item['name'] ?? $item['user'] ?? 'Unknown',
                            'service' => $item['service'] ?? 'pppoe',
                            'caller_id' => $item['caller-id'] ?? 'N/A',
                            'address' => $item['address'] ?? 'N/A',
                            'uptime' => $item['uptime'] ?? '0s',
                            'encoding' => $item['encoding'] ?? '',
                            'session_id' => $item['.id'] ?? null,
                        ];
                    }
                }
            }

            return response()->json([
                'success' => true,
                'router_name' => $routerName,
                'sessions' => $sessions,
                'count' => count($sessions),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'sessions' => [],
                'count' => 0,
            ]);
        }
    }

    /**
     * Create or update MikroTik router registration.
     */
    public function saveRouter(Request $request): JsonResponse
    {
        $id = $request->input('id');

        $rules = [
            'router_name' => 'required|string|max:255|unique:router_lists,router_name,' . $id,
            'ip_address' => 'required|ip',
            'username' => 'required|string|max:255',
            'password' => $id ? 'nullable|string|max:255' : 'required|string|max:255',
            'ssh_port' => 'nullable|integer|min:1|max:65535',
            'api_port' => 'nullable|integer|min:1|max:65535',
        ];

        $validated = $request->validate($rules);

        $data = [
            'router_name' => $validated['router_name'],
            'ip_address' => $validated['ip_address'],
            'username' => $validated['username'],
            'ssh_port' => $validated['ssh_port'] ?? null,
            'api_port' => $validated['api_port'] ?? null,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = $validated['password'];
        }

        $router = RouterList::updateOrCreate(
            ['id' => $id],
            $data
        );

        return response()->json([
            'success' => true,
            'message' => "Router '{$router->router_name}' successfully saved.",
            'router' => $router,
        ]);
    }

    /**
     * Delete router from registration.
     */
    public function deleteRouter(int $id): JsonResponse
    {
        $router = RouterList::findOrFail($id);
        $name = $router->router_name;
        $router->delete();

        return response()->json([
            'success' => true,
            'message' => "Router '{$name}' has been deleted.",
        ]);
    }
}
