<script>
    window.__TOPNAV_USER__ = {
        name: "{{ auth()->check() ? addslashes(auth()->user()->name) : 'Admin' }}",
        email: "{{ auth()->check() ? addslashes(auth()->user()->email) : '' }}",
        profilePhoto: "{{ auth()->check() ? auth()->user()->profile_photo_url : '' }}",
        isSuperAdmin: {{ auth()->check() && auth()->user()->hasRole('Super Admin') ? 'true' : 'false' }}
    };
</script>

<div id="react-topbar-root" class="w-100"></div>
