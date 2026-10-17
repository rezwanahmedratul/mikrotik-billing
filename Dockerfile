# ==============================================================================
# Production Dockerfile for Smart ISP (Laravel + Livewire + Filament)
# Using mlocati/php-extension-installer for fast pre-compiled extension downloads
# ==============================================================================
FROM php:8.3-fpm-alpine

WORKDIR /var/www/html

# Install base tools & fast PHP extension installer
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    netcat-openbsd \
    curl \
    git \
    zip \
    unzip

# Download official precompiled PHP extension installer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install pre-compiled extensions (10x faster than source compilation)
RUN install-php-extensions \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application source code (including precompiled public/build)
COPY . .

# Install PHP dependencies without dev packages
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Copy Docker configurations
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
