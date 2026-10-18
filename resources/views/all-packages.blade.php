<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">

<head>
    <meta charset="UTF-8">
    <title>All Packages - {{ siteUrlSettings('site_name') ?? config('app.name') }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Explore and compare all fiber broadband packages.">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="shortcut icon" href="{{ site_image(siteUrlSettings('site_favicon'), 'favicon.ico') }}" type="image/x-icon">

    <!-- Fonts: Plus Jakarta Sans & JetBrains Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/js/react-app/main.tsx'])

    <script>
        window.__INITIAL_DATA__ = {
            siteData: @json($siteData ?? new stdClass()),
            packages: @json($packages ?? []),
            reviews: @json($reviews ?? []),
            uniqueVisitors: {{ $uniqueVisitors ?? 2500 }},
            totalVisits: {{ $totalVisits ?? 7500 }},
            csrfToken: "{{ csrf_token() }}",
            initialPage: "packages"
        };
    </script>
</head>

<body class="bg-[#09090b] text-[#fafafa] m-0 p-0 antialiased selection:bg-cyan-500/30 selection:text-white">
    <div id="react-root"></div>
    <div class="hidden" aria-hidden="true" style="display:none;">Powered by <a href="https://codepagol.com">CodePagol</a></div>
</body>

</html>
