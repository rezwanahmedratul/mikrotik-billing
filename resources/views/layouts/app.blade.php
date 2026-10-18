<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="ltr">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#ffffff">
    <!-- ===============================================-->
    <!--    Document Title-->
    <!-- ===============================================-->
    <title>{{ siteUrlSettings('site_title') ?? config('app.name') }}</title>

    <link rel="shortcut icon" href="{{ site_image(siteUrlSettings('site_favicon'), 'images/favicon.png') }}" type="image/x-icon">

    <!-- ===============================================-->
    <!--    Favicon-->
    <!-- ===============================================-->
    {{-- <link rel="apple-touch-icon" sizes="180x180" href="{{asset('/images/favicons/apple-touch-icon.png')}}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{asset('/images/favicons/favicon-32x32.png')}}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{asset('/images/favicons/favicon-16x16.png')}}">
    <link rel="shortcut icon" type="image/x-icon" href="{{asset('/images/favicons/favicon.ico')}}">
    <meta name="msapplication-TileImage" content="{{asset('/images/favicons/mstile-150x150.png')}}"> --}}

    @vite(['resources/sass/app.scss', 'resources/css/app.css', 'resources/css/billing-monochrome.css', 'resources/js/app.js', 'resources/js/react-app/billing-main.tsx'])
    @stack('styles')
    @filamentStyles
    <link rel="stylesheet" href="{{ asset('css/filament/filament/app.css') }}">
    @livewireStyles
    <!-- ===============================================-->
    <!--    Stylesheets-->
    <!-- ===============================================-->
    <script>
        @php
            $tz = config('app.timezone', 'Asia/Dhaka');
            $phoneCountry = 'bd';
            if (class_exists('IntlTimeZone')) {
                $region = \IntlTimeZone::getRegion($tz);
                if ($region && strlen($region) === 2) {
                    $phoneCountry = strtolower($region);
                }
            }
        @endphp
        window.sitePhoneCountry = '{{ $phoneCountry }}';
        var isRTL = JSON.parse(localStorage.getItem('isRTL'));
        if (isRTL) {
            document.querySelector('html').setAttribute('dir', 'rtl');
        } else {
            document.querySelector('html').setAttribute('dir', 'ltr');
        }

        // Side navbar is permanently visible
        localStorage.removeItem("isNavbarVerticalCollapsed");
        document.documentElement.classList.remove("navbar-vertical-collapsed");
        document.documentElement.classList.remove("navbar-vertical-collapsed-hover");

        // Global theme application helper
        window.applyGlobalTheme = function(theme) {
            let applied = theme;
            if (theme === 'auto') {
                applied = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            document.documentElement.setAttribute('data-bs-theme', applied);
            if (applied === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            window.dispatchEvent(new CustomEvent('smartIspThemeChanged', {
                detail: { theme: applied, rawTheme: theme }
            }));
            return applied;
        };

        // Theme toggle object definition for Alpine.js
        function createThemeToggleComponent() {
            return {
                theme: localStorage.getItem('theme') || 'dark',

                init() {
                    this.applyTheme(this.theme);

                    window.addEventListener('livewire:navigated', () => {
                        this.applyTheme(this.theme);
                    });

                    window.addEventListener('smartIspThemeChanged', (e) => {
                        if (e.detail && e.detail.rawTheme && this.theme !== e.detail.rawTheme) {
                            this.theme = e.detail.rawTheme;
                        }
                    });

                    try {
                        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                            if (this.theme === 'auto') {
                                this.applyTheme('auto');
                            }
                        });
                    } catch (e) {}
                },

                setTheme(newTheme) {
                    this.theme = newTheme;
                    localStorage.setItem('theme', newTheme);
                    this.applyTheme(newTheme);
                },

                toggleTheme() {
                    const current = (this.theme === 'auto')
                        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                        : this.theme;
                    const next = (current === 'dark') ? 'light' : 'dark';
                    this.setTheme(next);
                },

                applyTheme(t) {
                    window.applyGlobalTheme(t);
                }
            };
        }
        window.themeToggle = createThemeToggleComponent;

        document.addEventListener('alpine:init', () => {
            if (window.Alpine && typeof window.Alpine.data === 'function') {
                window.Alpine.data('themeToggle', createThemeToggleComponent);
            }
        });

        // Apply persisted or default theme immediately
        (() => {
            const isTheme = localStorage.getItem('theme') || 'dark';
            window.applyGlobalTheme(isTheme);
        })();
    </script>
</head>

<body class="font-sans antialiased fi-body">
    <!-- ===============================================-->
    <!--    Main Content-->
    <!-- ===============================================-->
    <main class="main" id="top">
        <div class="container-fluid" data-layout="container">
            <script>
                var isFluid = JSON.parse(localStorage.getItem('isFluid'));
                if (isFluid == null || isFluid == false) {
                    var container = document.querySelector('[data-layout="container"]');
                    if (container) {
                        container.classList.remove('container-fluid');
                        container.classList.add('container');
                    }
                }
            </script>
            @include('layouts.partials.sidenav')
            <div class="content">
                @include('layouts.partials.mobile-button-nav')


                @include('layouts.partials.topnav')
                @if (isset($header))
                    <div class="card mb-3" style="background: var(--mono-card) !important; border: 1px solid var(--mono-card-border) !important;">
                        <div class="card-body position-relative py-3">
                            <div class="row">
                                <div class="col-md-12">
                                    <h4 class="text-center mb-0" style="color: var(--mono-text-primary); font-family: var(--font-sans); font-weight: 700; letter-spacing: -0.02em;">{{ $header }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                @endif
                <script>
                    localStorage.setItem('navbarPosition', 'vertical');
                    localStorage.removeItem('isNavbarVerticalCollapsed');
                    var navVerticalEl = document.querySelector('.navbar-vertical');
                    var navTopVerticalEl = document.querySelector('.content .navbar-top');
                    var navTopEl = document.querySelector('[data-layout] .navbar-top:not([data-double-top-nav])');
                    var navDoubleTopEl = document.querySelector('[data-double-top-nav]');
                    var navTopComboEl = document.querySelector('.content [data-navbar-top="combo"]');

                    if (navVerticalEl) navVerticalEl.removeAttribute('style');
                    if (navTopVerticalEl) navTopVerticalEl.removeAttribute('style');
                    if (navTopEl) navTopEl.remove();
                    if (navDoubleTopEl) navDoubleTopEl.remove();
                    if (navTopComboEl) navTopComboEl.remove();
                </script>
                {{ $slot }}
                <footer class="footer">
                    <div class="row g-0 justify-content-between fs-10 mt-4 mb-3 px-3">
                        <div class="col-12 col-sm-auto text-center">
                            <p class="mb-0 text-600">{{ __('Thank you for stay with us') }} <span class="d-none d-sm-inline-block">|
                                </span><br class="d-sm-none" /> &copy; {{ date('Y') }} <strong>Smart ISP</strong></p>
                        </div>
                        <div class="col-12 col-sm-auto text-center">
                            <p class="mb-0 text-600">v1.0.0</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </main>

    <!-- ===============================================-->
    <!--    End of Main Content-->
    <!-- ===============================================-->
    {{-- Global React Command Palette Mount Root --}}
    <div id="billing-command-palette-root"></div>

    @stack('modals')

    @livewireScripts
    @filamentScripts
    <script data-navigate-once>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof $ !== 'undefined') {
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                // remove invalid feedback and error
                $('input, textarea, select').on('focus', function() {
                    $(this).removeClass('is-invalid'); // remove invalid class
                    $(this).nextAll('.invalid-feedback').remove(); // remove invalid feedback
                });
            }
            document.documentElement.classList.remove("navbar-vertical-collapsed");
            document.documentElement.classList.remove("navbar-vertical-collapsed-hover");
        });

        document.addEventListener('livewire:navigated', () => {
            document.documentElement.classList.remove("navbar-vertical-collapsed");
            document.documentElement.classList.remove("navbar-vertical-collapsed-hover");
        });

        function layoutController() {
            return {
                isFluid: JSON.parse(localStorage.getItem('isFluid')), // default is container

                initLayout() {
                    this.applyLayout();

                    // Livewire wire:navigate support
                    window.addEventListener('livewire:navigated', () => {
                        this.applyLayout();
                    });
                },

                toggleLayout() {
                    this.isFluid = !this.isFluid;
                    localStorage.setItem('isFluid', this.isFluid);
                    this.applyLayout();
                },

                applyLayout() {
                    const container = document.querySelector('[data-layout]');
                    if (container) {
                        container.classList.toggle('container', !this.isFluid);
                        container.classList.toggle('container-fluid', this.isFluid);
                    }
                }
            }
        }

        // For side nav style
        function verticalNavbarStyle() {
            return {
                isNavbarStyle: localStorage.getItem('navbarStyle') || 'transparent',

                initNavStyle() {
                    this.applyNavbarStyle(this.isNavbarStyle);

                    // For Livewire SPA support
                    window.addEventListener('livewire:navigated', () => {
                        this.applyNavbarStyle(this.isNavbarStyle);
                    });
                },

                setNavbarStyle(style) {
                    this.isNavbarStyle = style;
                    localStorage.setItem('navbarStyle', style);
                    this.applyNavbarStyle(style);
                },

                applyNavbarStyle(style) {
                    const navbarVertical = document.querySelector('.navbar-vertical');
                    if (!navbarVertical) return;
                    // Remove previous navbar-* class
                    navbarVertical.classList.forEach((cls) => {
                        if (cls.startsWith('navbar-') && cls !== 'navbar' && cls !== 'navbar-light' && cls !==
                            'navbar-vertical' && cls !== 'navbar-expand-xl') {
                            navbarVertical.classList.remove(cls);
                        }
                    });

                    // Add the new class
                    if (style && style !== 'transparent') {
                        navbarVertical.classList.add(`navbar-${style}`);
                    } else {
                        // If style is 'transparent', remove all specific styles
                        navbarVertical.classList.remove('navbar-inverted', 'navbar-card', 'navbar-vibrant');
                    }
                }
            }
        }

        // For navbar position

        function navbarPosition() {
            return {
                isNavbarPosition: 'vertical', // default is vertical
                initNavPosition() {
                    this.isNavbarPosition = localStorage.getItem('navbarPosition') || 'vertical';

                    // Livewire SPA support
                    window.addEventListener('livewire:navigated', () => {
                        this.isNavbarPosition = localStorage.getItem('navbarPosition') || 'vertical';
                    });
                },

                setNavbarPosition(position) {
                    localStorage.setItem('navbarPosition', position);
                    location.reload();
                }
            }
        }

        // For RTL toggle
        function rtlController() {
            return {
                isRTL: JSON.parse(localStorage.getItem('isRTL')) || false,

                initRTL() {
                    this.applyRTL();

                    // Livewire SPA support
                    window.addEventListener('livewire:navigated', () => {
                        this.applyRTL();
                    });
                },

                toggleRTL() {
                    this.isRTL = !this.isRTL;
                    localStorage.setItem('isRTL', this.isRTL);
                    this.applyRTL();
                },

                applyRTL() {
                    document.querySelector('html').setAttribute('dir', this.isRTL ? 'rtl' : 'ltr');
                }
            }
        }

        /* -------------------------------------------------------------------------- */
        /*                         Auto-Dynamic DataTables                            */
        /* -------------------------------------------------------------------------- */
        var dataTablesInitTimeout = null;
        function initDynamicDataTables() {
            if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined') return;

            // Debounce to prevent multiple rapid initializations during morphing
            if (dataTablesInitTimeout) clearTimeout(dataTablesInitTimeout);

            dataTablesInitTimeout = setTimeout(() => {
                $('table.data-table').each(function() {
                    const $table = $(this);

                    // Skip if the table is no longer in the document
                    if (!document.body.contains(this)) return;

                    const rowCount = $table.find('tbody tr').length;

                    // Always ensure it's destroyed before re-thinking (morph.updating usually handles this, but safety first)
                    if ($.fn.DataTable.isDataTable(this)) {
                        $table.DataTable().destroy();
                    }

                    if (rowCount > 20) {
                        $table.DataTable({
                            responsive: true,
                            pageLength: 20,
                            lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "All"]],
                            dom: '<"d-flex justify-content-between align-items-center mb-2"Bf>rt<"d-flex justify-content-between align-items-center mt-2"ip>',
                            buttons: ['copy', 'excel', 'pdf', 'print'],
                            destroy: true
                        });
                    }
                });
            }, 150); // 150ms debounce for stability
        }

        document.addEventListener('DOMContentLoaded', initDynamicDataTables);
        document.addEventListener('livewire:navigated', initDynamicDataTables);
        window.addEventListener('reinit-datatables', initDynamicDataTables);

        // Livewire 3 hooks for robust 3rd party integration (e.g., DataTables)
        document.addEventListener('livewire:init', () => {
            // 1. Destroy ALL DataTables on the page BEFORE any component morph starts.
            // Broad destruction is safer in Livewire 3 to prevent parent-child node conflicts.
            Livewire.hook('commit.prepare', ({ component }) => {
                $('table.data-table').each(function() {
                    if ($.fn.DataTable.isDataTable(this)) {
                        $(this).DataTable().destroy();
                    }
                });
            });

           // 2. Re-initialize AFTER the ENTIRE morph cycle is finished
           // commit.respond fires after the response is received and the DOM has been fully patched.
           Livewire.hook('commit.respond', ({ component }) => {
               // Wait a bit longer to be absolutely sure the DOM has settled across all browsers
               setTimeout(() => {
                   // Only re-init if the component is still present in the DOM
                   if (component.el && document.body.contains(component.el)) {
                       initDynamicDataTables();
                   }
               }, 300);
           });
        });
    </script>

    @stack('scripts')

    {{-- Attribution notice — required by LICENSE. Do not remove. See: https://codepagol.com --}}
    <div id="codepagol-attribution" style="display:none" aria-hidden="true"
         data-credit="Powered by CodePagol | https://codepagol.com"></div>

</body>
</html>
