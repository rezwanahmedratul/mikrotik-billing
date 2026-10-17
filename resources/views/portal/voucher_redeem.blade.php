<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">

<head>
    <meta charset="UTF-8">
    <title>Voucher Recharge - {{ siteUrlSettings('site_name') ?? config('app.name') }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="shortcut icon" href="{{ site_image(siteUrlSettings('site_favicon'), 'favicon.ico') }}" type="image/x-icon">

    <!-- Fonts: Plus Jakarta Sans & JetBrains Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/js/react-app/main.jsx'])

    <script>
        window.__INITIAL_DATA__ = {
            siteData: {
                site_name: "{{ siteUrlSettings('site_name') ?? config('app.name') }}",
                site_phone: "{{ siteUrlSettings('site_phone') ?? '+880 1700-000000' }}"
            },
            csrfToken: "{{ csrf_token() }}",
            initialPage: "voucher"
        };
    </script>
</head>

<body class="bg-[#09090b] text-[#fafafa] m-0 p-0 antialiased selection:bg-cyan-500/30 selection:text-white">
    <div id="react-root"></div>
</body>

</html>
