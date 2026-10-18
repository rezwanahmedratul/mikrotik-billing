<div class="card border-0 shadow-sm mb-3" style="border-radius: 12px; background: var(--mono-card); border: 1px solid var(--mono-card-border) !important;">
    <div class="card-header pt-3 pb-2 px-4 position-relative" style="background: var(--mono-card); border-bottom: 1px solid var(--mono-card-border); border-top-left-radius: 12px; border-top-right-radius: 12px;">
        <!-- Minimal Monochrome Left Accent Bar -->
        <div class="position-absolute" style="width: 3px; left: 0; top: 16px; bottom: 10px; border-radius: 0 3px 3px 0; background: var(--mono-text-primary);"></div>
        
        <h5 class="card-title fw-bold mb-0 ps-2" style="font-size: 1.05rem; letter-spacing: -0.01em; color: var(--mono-text-primary);">
            {{ $title ?? '' }}
        </h5>
    </div>
    <div class="card-body px-4 py-3 {{ $class ?? '' }}" {{ $attributes ?? '' }} style="border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; background: var(--mono-card); color: var(--mono-text-primary);">
        {{ $aside ?? '' }}
    </div>
</div>