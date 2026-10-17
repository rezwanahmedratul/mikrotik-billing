# ==============================================================================
# Production Dockerfile for Smart ISP (Laravel + Livewire + Filament)
# Alpine Linux based — lightweight, clean, fast extensions via mlocati
# ==============================================================================
FROM php:8.3-fpm-alpine

WORKDIR /var/www/html

# Install base tools, Nginx, and Supervisor
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    netcat-openbsd \
    curl \
    git \
    zip \
    unzip

# Install official precompiled PHP extension installer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install PHP extensions required by Laravel, Filament, mPDF, PhpSpreadsheet, and RouterOS
RUN install-php-extensions \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache \
    sockets

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configure Composer environment with extended timeout for large packages (like mPDF)
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_PROCESS_TIMEOUT=2000 \
    COMPOSER_MEMORY_LIMIT=-1

# Copy composer definitions first for layer caching
COPY composer.json composer.lock ./

# Install vendor dependencies with extended timeout
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# Copy application source code (including precompiled public/build)
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize --no-dev

# Copy Docker configurations
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
