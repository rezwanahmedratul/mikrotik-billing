#!/bin/bash
set -e

# Wait for database if DB_HOST is set
if [ -n "$DB_HOST" ]; then
    echo "Waiting for database connection at $DB_HOST:${DB_PORT:-3306}..."
    until nc -z -v -w30 "$DB_HOST" "${DB_PORT:-3306}"; do
        echo "Database is unavailable - waiting 2 seconds..."
        sleep 2
    done
    echo "Database connected!"
fi

# Ensure storage directories and permissions
mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Remove any stale bootstrap cache files
rm -f bootstrap/cache/*.php

# Ensure .env exists
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Generate app key if missing
if [ -z "$APP_KEY" ] && ! grep -q "^APP_KEY=base64:" .env; then
    php artisan key:generate --force
fi

# Run migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force
fi

# Discover packages and cache configuration in production
php artisan package:discover --ansi || true
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# Configure Nginx listening port if APP_PORT is specified
TARGET_PORT="${APP_PORT:-8000}"
if [ -f /etc/nginx/http.d/default.conf ]; then
    sed -i -E "s/listen [0-9]+;/listen ${TARGET_PORT};/g" /etc/nginx/http.d/default.conf
    sed -i -E "s/listen \[::\]:[0-9]+;/listen [::]:${TARGET_PORT};/g" /etc/nginx/http.d/default.conf
    echo "Nginx configured to listen on port ${TARGET_PORT}"
fi

# Ensure storage:link exists
if [ ! -L public/storage ] && [ ! -d public/storage ]; then
    php artisan storage:link || true
fi

# Ensure www-data ownership and permissions across storage, bootstrap/cache, and public uploads
mkdir -p storage/framework/{sessions,views,cache/data} storage/logs storage/app/public bootstrap/cache public/images/avatars public/customer-images
chown -R www-data:www-data storage bootstrap/cache public/images public/customer-images
chmod -R 775 storage bootstrap/cache public/images public/customer-images

# Execute main process (default: supervisord)
exec "$@"
