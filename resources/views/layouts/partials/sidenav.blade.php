<nav class="navbar navbar-light navbar-glass navbar-top navbar-expand-lg" data-double-top-nav="data-double-top-nav" style="display: none;">
    <div class="w-100">
        <div class="d-flex flex-between-center">
            {{-- logo and Site name --}}
            <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarDoubleTop" aria-controls="navbarDoubleTop" aria-expanded="false" aria-label="Toggle Navigation">
                <span class="navbar-toggle-icon">
                    <span class="toggle-line"></span>
                </span>
            </button>
            <a class="navbar-brand me-1 me-sm-3" href="{{url('/')}}">
                <div class="d-flex align-items-center">
                    {{-- Check if site logo exists and display it, otherwise show site icon or name --}}
                    @if (siteUrlSettings('site_logo'))
                        <img class="me-2" style="width: 150px; height: auto; max-height: 45px; max-width: 100%; object-fit: contain; flex-shrink: 0;" src="{{ site_image(siteUrlSettings('site_logo')) }}" alt="logo"/>
                    @else
                        @if (siteUrlSettings('site_icon'))
                            <img class="me-2" src="{{ site_image(siteUrlSettings('site_icon')) }}" alt="" width="40" />
                            <span class="font-sans-serif text-success">{{ siteUrlSettings('site_name') ?? 'Smart ISP' }}</span>
                        @else
                            <span class="font-sans-serif text-success">{{ siteUrlSettings('site_name') ?? 'Smart ISP' }}</span>
                        @endif
                    @endif
                </div>
            </a>
            @include('layouts.partials.searchbar')
            @include('layouts.partials.userpanel')
        </div>

        <hr class="my-2 d-none d-lg-block" />

        <div class="collapse navbar-collapse scrollbar py-lg-2" id="navbarDoubleTop">
            @include('layouts.partials.navpanel')
        </div>
    </div>
</nav>

<nav class="navbar navbar-light navbar-glass navbar-top navbar-expand-lg" style="display: none;">
    <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarStandard" aria-controls="navbarStandard" aria-expanded="false" aria-label="Toggle Navigation">
        <span class="navbar-toggle-icon">
            <span class="toggle-line"></span>
        </span>
    </button>
    <a class="navbar-brand me-1 me-sm-3" href="{{url('/')}}">
        <div class="d-flex align-items-center">
            @if (siteUrlSettings('site_logo'))
                <img class="me-2" style="width: 150px; height: auto; max-height: 45px; max-width: 100%; object-fit: contain; flex-shrink: 0;" src="{{ site_image(siteUrlSettings('site_logo')) }}" alt="logo"/>
            @else
                @if (siteUrlSettings('site_icon'))
                    <img class="me-2" src="{{ site_image(siteUrlSettings('site_icon')) }}" alt="" width="40" />
                    <span class="font-sans-serif text-success">{{ siteUrlSettings('site_name') ?? 'Smart ISP' }}</span>
                @else
                    <span class="font-sans-serif text-success">{{ siteUrlSettings('site_name') ?? 'Smart ISP' }}</span>
                @endif
            @endif
        </div>
    </a>
    <div class="collapse navbar-collapse scrollbar" id="navbarStandard">
        @include('layouts.partials.navpanel')
    </div>
    @include('layouts.partials.userpanel')
</nav>

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
    <div class="collapse navbar-collapse" id="navbarVerticalCollapse">
        <div class="navbar-vertical-content scrollbar d-flex flex-column justify-content-between h-100">
            <div>
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
