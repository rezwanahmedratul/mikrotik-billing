<div>
    <x-slot name="header">
        {{ __('Manage Roles') }}
    </x-slot>

    <div class="card border shadow-sm rounded-4" style="background: var(--mono-card); border-color: var(--mono-card-border) !important;">
        <div class="card-header py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2" style="background: var(--mono-surface-elevated); border-color: var(--mono-card-border) !important;">
            <h5 class="mb-0 fw-bold"><i class="bi bi-shield-lock-fill text-muted me-2"></i>{{ __('Role Management') }}</h5>
            @can('create-user-role')
                <button wire:click="newRole" wire:loading.attr="disabled" class="btn btn-sm btn-mono rounded-3 px-3">
                    <i class="bi bi-plus-lg me-1"></i>
                    {{ __('Add New Role') }}
                </button>
            @endcan
        </div>
        <div class="card-body pt-3">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3 p-2 rounded-3 border" style="background: var(--mono-surface); border-color: var(--mono-card-border) !important;">
                <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small">Show</span>
                    <select class="form-select form-select-sm rounded-3 shadow-none border" style="width: 85px;"
                        wire:model.live="perPage" aria-label="Default select example">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="*">All</option>
                    </select>
                    <span class="text-muted small">entries</span>
                </div>
            </div>

            <div class="row g-3">
                @forelse ($roles as $role)
                    @php
                        $permissionsCount = $role->permissions->count();
                    @endphp
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 border rounded-4 shadow-sm hover-lift transition-all"
                            style="background: var(--mono-card); border-color: var(--mono-card-border) !important; transition: all 0.2s ease-in-out;">
                            <div class="card-body p-4 d-flex flex-column h-100">

                                {{-- Card Header: Role Name & Icon --}}
                                <div class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style="border-color: var(--mono-card-border) !important;">
                                    <div class="d-flex align-items-center gap-2.5 overflow-hidden">
                                        <span class="d-inline-flex align-items-center justify-content-center rounded-3 border p-2"
                                            style="background: var(--mono-surface-elevated); color: var(--mono-text-primary); border-color: var(--mono-card-border) !important; width: 38px; height: 38px; flex-shrink: 0;">
                                            <i class="bi bi-shield-lock-fill" style="font-size: 1.1rem;"></i>
                                        </span>
                                        <div class="overflow-hidden">
                                            <h6 class="mb-0 fw-bold text-truncate"
                                                title="{{ $role->name }}">{{ $role->name }}</h6>
                                            <span class="text-muted" style="font-size: 0.72rem; font-weight: 500;">
                                                @if ($role->name === 'Super Admin')
                                                    All System Privileges
                                                @else
                                                    {{ $permissionsCount }}
                                                    {{ Str::plural('Permission', $permissionsCount) }}
                                                @endif
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {{-- Card Body: Permissions List --}}
                                <div class="flex-grow-1">
                                    <div class="d-flex flex-wrap gap-1">
                                        @if ($role->name === 'Super Admin')
                                            <span class="badge rounded-pill border px-2.5 py-1"
                                                style="font-size: 0.72rem; font-weight: 500; background: var(--mono-surface-elevated); color: var(--mono-text-primary); border-color: var(--mono-card-border) !important;"><i
                                                    class="bi bi-star-fill me-1"></i>All Permissions</span>
                                        @else
                                            @forelse ($role->permissions->take(8) as $permission)
                                                <span class="badge rounded-pill border px-2.5 py-1"
                                                    style="font-size: 0.72rem; font-weight: 500; background: var(--mono-surface-elevated); color: var(--mono-text-primary); border-color: var(--mono-card-border) !important;">{{ $permission->name }}</span>
                                            @empty
                                                <span class="badge rounded-pill border px-2.5 py-1"
                                                    style="font-size: 0.72rem; font-weight: 500; background: var(--mono-surface-elevated); color: var(--mono-text-muted); border-color: var(--mono-card-border) !important;">No Permissions
                                                    Assigned</span>
                                            @endforelse

                                            @if ($permissionsCount > 8)
                                                <span class="badge rounded-pill border px-2.5 py-1 fw-bold"
                                                    style="font-size: 0.72rem; background: var(--mono-surface-elevated); color: var(--mono-text-muted); border-color: var(--mono-card-border) !important;">+ {{ $permissionsCount - 8 }}
                                                    more</span>
                                            @endif
                                        @endif
                                    </div>
                                </div>

                                {{-- Card Footer: Action Buttons --}}
                                <div class="mt-4 pt-3 border-top d-flex justify-content-end gap-2" style="border-color: var(--mono-card-border) !important;">
                                    @if ($role->name !== 'Super Admin')
                                        @can('edit-user-role')
                                            <button class="btn btn-sm btn-mono-secondary rounded-3 px-3 py-1 fw-semibold"
                                                wire:click="editRole({{ $role->id }})" title="Edit"
                                                style="font-size: 0.75rem;"><i
                                                    class="bi bi-pencil-square me-1"></i>Edit</button>
                                        @endcan
                                        @can('delete-user-role')
                                            <button class="btn btn-sm btn-outline-danger rounded-3 px-3 py-1 fw-semibold"
                                                wire:click="deleteRole({{ $role->id }}, '{{ $role->name }}')"
                                                title="Delete" style="font-size: 0.75rem;"><i
                                                    class="bi bi-trash me-1"></i>Delete</button>
                                        @endcan
                                    @else
                                        <span class="badge rounded-pill border px-2.5 py-1"
                                            style="font-size: 0.72rem; font-weight: 500; background: var(--mono-surface-elevated); color: var(--mono-text-muted); border-color: var(--mono-card-border) !important;"><i
                                                class="bi bi-lock-fill me-1"></i>System Protected</span>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="col-12 py-5 text-center bg-light rounded-4 border border-dashed">
                        <span class="text-danger fw-semibold">
                            <i class="bi bi-exclamation-triangle-fill fs-4 d-block mb-2"></i>No Roles Found!
                        </span>
                    </div>
                @endforelse
            </div>

            <style>
                .hover-lift:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 .5rem 1.5rem rgba(0, 0, 0, .08) !important;
                }
            </style>

            <div class="mt-3">
                {{ $roles->links() }}
            </div>
        </div>
    </div>

    @include('livewire.admin.role.role-form')
</div>
