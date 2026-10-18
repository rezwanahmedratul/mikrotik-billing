<div>
    <x-slot name="header">
        {{ __('Manage Users') }}
    </x-slot>

    <div class="card border shadow-sm rounded-4" style="background: var(--mono-card); border-color: var(--mono-card-border) !important;">
        <div class="card-header py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2" style="background: var(--mono-surface-elevated); border-color: var(--mono-card-border) !important;">
            <h5 class="mb-0 fw-bold"><i class="bi bi-people-fill text-muted me-2"></i>{{ __('User Directory') }}</h5>
            @can('create-user')
                <button wire:click="newUser" class="btn btn-sm btn-mono rounded-3 px-3"><i class="bi bi-plus-lg me-1"></i>{{ __('Add New User') }}</button>
            @endcan
        </div>
        <div class="card-body pt-3">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3 p-2 rounded-3 border" style="background: var(--mono-surface); border-color: var(--mono-card-border) !important;">
                <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small">Show</span>
                    <select class="form-select form-select-sm rounded-3 shadow-none border" style="width: 85px;" wire:model.live="perPage">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="*">All</option>
                    </select>
                    <span class="text-muted small">entries</span>
                </div>

                <div class="position-relative" style="width: 280px;">
                    <input type="text" class="form-control form-control-sm rounded-3 shadow-none ps-3 pe-5 border" wire:model.live="search" placeholder="Search user details...">
                    <i class="bi bi-search position-absolute end-0 top-50 translate-middle-y me-3 text-muted"></i>
                </div>
            </div>

            <div class="row g-3">
                @forelse ($users as $user)
                    @php
                        $initials = mb_strtoupper(mb_substr($user->name ?? '', 0, 1, 'UTF-8'), 'UTF-8');
                    @endphp
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 border rounded-4 shadow-sm hover-lift transition-all position-relative" style="background: var(--mono-card); border-color: var(--mono-card-border) !important; transition: all 0.2s ease-in-out;">
                            
                            {{-- Top Action Corner / Badges --}}
                            <div class="position-absolute top-0 end-0 p-3 d-flex gap-1 align-items-center">
                                @if($user->id === Auth::id())
                                    <span class="badge rounded-pill border px-2 py-0.5 font-mono" style="font-size: 0.65rem; font-weight: 600; background: var(--mono-surface-elevated); color: var(--mono-text-primary); border-color: var(--mono-card-border) !important;">You</span>
                                @endif
                            </div>

                            <div class="card-body p-4 d-flex flex-column h-100">
                                {{-- Avatar + Identity Header --}}
                                <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom" style="border-color: var(--mono-card-border) !important;">
                                    @if($user->profile_photo_path)
                                        <img src="{{ Storage::url($user->profile_photo_path) }}"
                                             alt="{{ $user->name }}"
                                             class="avatar rounded-circle shadow-sm border" style="width: 48px; height: 48px; object-fit: cover;">
                                    @else
                                        <div class="avatar rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm border font-mono" 
                                             style="background: var(--mono-surface-elevated); color: var(--mono-text-primary); border-color: var(--mono-card-border) !important; width: 48px; height: 48px; font-size:16px;">
                                            {{ $initials }}
                                        </div>
                                    @endif
                                    <div class="overflow-hidden">
                                        <h6 class="mb-0 fw-bold text-truncate" title="{{ $user->name }}">{{ $user->name }}</h6>
                                        <div class="d-flex flex-wrap gap-1 mt-1">
                                            @foreach ($user->getRoleNames() as $role)
                                                <span class="badge rounded-pill border px-2 py-0.5" style="font-size: 0.62rem; font-weight: 600; background: var(--mono-surface-elevated); color: var(--mono-text-primary); border-color: var(--mono-card-border) !important;">{{ $role }}</span>
                                            @endforeach
                                        </div>
                                    </div>
                                </div>

                                {{-- User Details --}}
                                <div class="flex-grow-1">
                                    <div class="d-flex align-items-center gap-2 mb-2">
                                        <span class="d-inline-flex align-items-center justify-content-center rounded bg-light text-secondary p-1" style="width: 24px; height: 24px;">
                                            <i class="bi bi-envelope-fill" style="font-size: 0.75rem;"></i>
                                        </span>
                                        <span class="text-secondary text-truncate small" title="{{ $user->email }}">{{ $user->email }}</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-2 mb-2">
                                        <span class="d-inline-flex align-items-center justify-content-center rounded bg-light text-secondary p-1" style="width: 24px; height: 24px;">
                                            <i class="bi bi-telephone-fill" style="font-size: 0.75rem;"></i>
                                        </span>
                                        <span class="text-secondary small">{{ $user->mobile ?? 'N/A' }}</span>
                                    </div>
                                    <div class="d-flex align-items-start gap-2 mb-2">
                                        <span class="d-inline-flex align-items-center justify-content-center rounded bg-light text-secondary p-1 mt-0.5" style="width: 24px; height: 24px; flex-shrink: 0;">
                                            <i class="bi bi-geo-alt-fill" style="font-size: 0.75rem;"></i>
                                        </span>
                                        <span class="text-secondary small text-line-clamp-2" style="font-size: 0.78rem;">{{ $user->address ?? 'No Address' }}</span>
                                    </div>

                                    {{-- Permissions List --}}
                                    <div class="mt-3 pt-2 border-top" style="border-color: var(--mono-card-border) !important;">
                                        <div class="fw-bold mb-1.5" style="font-size: 0.72rem;"><i class="bi bi-key-fill me-1 text-muted"></i>Permissions:</div>
                                        <div class="d-flex flex-wrap gap-1">
                                            @if (in_array('Super Admin', $user->getRoleNames()->toArray() ?? []))
                                                <span class="badge rounded-pill border px-2 py-0.5" style="font-size: 0.65rem; font-weight: 500; background: var(--mono-surface-elevated); color: var(--mono-text-primary); border-color: var(--mono-card-border) !important;"><i class="bi bi-star-fill me-1"></i>All Permissions</span>
                                            @else
                                                @php
                                                    $userPermissions = $user->getAllPermissions();
                                                    $permCount = $userPermissions->count();
                                                @endphp
                                                @forelse ($userPermissions->take(6) as $permission)
                                                    <span class="badge rounded-pill border px-2 py-0.5" style="font-size: 0.65rem; font-weight: 500; background: var(--mono-surface-elevated); color: var(--mono-text-primary); border-color: var(--mono-card-border) !important;">{{ $permission->name }}</span>
                                                @empty
                                                    <span class="badge rounded-pill border px-2 py-0.5" style="font-size: 0.65rem; font-weight: 500; background: var(--mono-surface-elevated); color: var(--mono-text-muted); border-color: var(--mono-card-border) !important;">No Permissions</span>
                                                @endforelse
                                                @if ($permCount > 6)
                                                    <span class="badge rounded-pill border px-2 py-0.5 fw-bold" style="font-size: 0.65rem; background: var(--mono-surface-elevated); color: var(--mono-text-muted); border-color: var(--mono-card-border) !important;">+{{ $permCount - 6 }} more</span>
                                                @endif
                                            @endif
                                        </div>
                                    </div>
                                </div>

                                {{-- Actions Footer --}}
                                <div class="mt-4 pt-3 border-top d-flex justify-content-end gap-2" style="border-color: var(--mono-card-border) !important;">
                                    @if (in_array('Super Admin', $user->getRoleNames()->toArray() ?? []) )
                                        @if (Auth::user()->hasRole('Super Admin'))
                                            <button wire:click="editUser({{ $user->id }})" class="btn btn-sm btn-mono-secondary rounded-3 px-3 py-1 fw-semibold" title="Edit" style="font-size: 0.75rem;"><i class="bi bi-pencil-square me-1"></i>Edit</button>
                                            @if (Auth::user()->id == $user->id)
                                                <button type="button" class="btn btn-sm btn-outline-danger rounded-3 px-3 py-1 fw-semibold" wire:click="deleteUser({{ $user->id }}, '{{ addslashes($user->name) }}', '{{ addslashes($user->email) }}')" title="Delete" style="font-size: 0.75rem;"><i class="bi bi-trash me-1"></i>Delete</button>
                                            @endif
                                        @else
                                            <span class="badge rounded-pill border px-2.5 py-1" style="font-size: 0.72rem; font-weight: 500; background: var(--mono-surface-elevated); color: var(--mono-text-muted); border-color: var(--mono-card-border) !important;"><i class="bi bi-lock-fill me-1"></i>System Protected</span>
                                        @endif
                                    @else
                                        @can('edit-user')
                                            <button wire:click="editUser({{ $user->id }})" class="btn btn-sm btn-mono-secondary rounded-3 px-3 py-1 fw-semibold" title="Edit" style="font-size: 0.75rem;"><i class="bi bi-pencil-square me-1"></i>Edit</button>
                                        @endcan

                                        @can('delete-user')
                                            @if (Auth::user()->id != $user->id)
                                                <button type="button" class="btn btn-sm btn-outline-danger rounded-3 px-3 py-1 fw-semibold" wire:click="deleteUser({{ $user->id }}, '{{ addslashes($user->name) }}', '{{ addslashes($user->email) }}')" title="Delete" style="font-size: 0.75rem;"><i class="bi bi-trash me-1"></i>Delete</button>
                                            @endif
                                        @endcan
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="col-12 py-5 text-center bg-light rounded-4 border border-dashed">
                        <span class="text-danger fw-semibold">
                            <i class="bi bi-exclamation-triangle-fill fs-4 d-block mb-2"></i>No Users Found!
                        </span>
                    </div>
                @endforelse
            </div>

            <style>
                .hover-lift:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.08) !important;
                }
            </style>

            <div class="mt-3">
                {{ $users->links() }}
            </div>
        </div>
    </div>

    @include('livewire.admin.user.user-form')
</div>
