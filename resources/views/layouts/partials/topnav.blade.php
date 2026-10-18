<nav class="navbar navbar-light navbar-glass navbar-top navbar-expand-lg" style="display: none;">

    <a class="navbar-brand me-1 me-sm-3" href="{{ url('/') }}">
        <div class="d-flex align-items-center">
            @if (siteUrlSettings('site_logo'))
                <img class="me-2" style="width: 190px; height: 53px;" src="{{ site_image(siteUrlSettings('site_logo')) }}" alt="logo"/>
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
        @include('layouts.partials.searchbar')
    </div>
    @include('layouts.partials.userpanel')
</nav>

<nav class="navbar navbar-light navbar-glass navbar-top navbar-expand-lg" style="display: none;" data-move-target="#navbarVerticalNav" data-navbar-top="combo">

    <a class="navbar-brand me-1 me-sm-3" href="{{ url('/') }}">
        <div class="d-flex align-items-center">
            @if (siteUrlSettings('site_logo'))
                <img class="me-2" style="width: 190px; height: 53px;" src="{{ site_image(siteUrlSettings('site_logo')) }}" alt="logo"/>
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
    @include('layouts.partials.navpanel')
    @include('layouts.partials.userpanel')
</nav>
