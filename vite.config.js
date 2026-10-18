import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/sass/app.scss',
                'resources/js/app.js',
                'resources/sass/main-site.scss',
                'resources/sass/guest.scss',
                'resources/js/main-site.js',
                'resources/js/react-app/main.jsx',
                'resources/css/billing-monochrome.css',
                'resources/js/react-app/billing-main.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                // Suppress Sass deprecation warnings from Bootstrap 5 internals.
                // Migrate to @use/@forward when Bootstrap adds full support.
                silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
            },
        },
    },
});
