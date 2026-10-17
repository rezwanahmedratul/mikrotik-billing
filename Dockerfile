# ==============================================================================
# Multi-stage Dockerfile for Smart ISP (Laravel + Livewire + Filament)
# ==============================================================================

# Stage 1: Build frontend assets
FROM node:20-alpine AS node_builder
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev --ignore-scripts
COPY . .
RUN npx vite build

# Stage 2: Production PHP + Nginx Environment
FROM php:8.3-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    netcat-openbsd \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    icu-dev \
    oniguruma-dev \
    git

# Install PHP extensions required by Laravel, Filament, mPDF, and PhpSpreadsheet
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
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

# Copy application source code
COPY . .

# Copy compiled frontend assets from node_builder
COPY --from=node_builder /app/public/build ./public/build

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
