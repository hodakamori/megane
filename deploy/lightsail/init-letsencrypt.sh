#!/bin/bash
# First-time Let's Encrypt certificate setup for megane.
#
# Run this ONCE on initial deployment. After that, the certbot
# container handles automatic renewal.
#
# Usage:
#   ./init-letsencrypt.sh

set -euo pipefail

if [ ! -f .env ]; then
    echo "ERROR: .env file not found. Copy .env.example and fill in values."
    exit 1
fi

set -a; source .env; set +a

DOMAIN="${DOMAIN:?Set DOMAIN in .env}"
EMAIL="${CERTBOT_EMAIL:?Set CERTBOT_EMAIL in .env}"
STAGING="${LETSENCRYPT_STAGING:-0}"

echo "==> Domain: ${DOMAIN}"
echo "==> Email: ${EMAIL}"
echo ""

# 1. Create dummy certificate so nginx can start
echo "==> Creating temporary self-signed certificate..."
docker compose run --rm --entrypoint "" certbot sh -c "
  mkdir -p /etc/letsencrypt/live/${DOMAIN} &&
  openssl req -x509 -nodes -newkey rsa:4096 -days 1 \
    -keyout /etc/letsencrypt/live/${DOMAIN}/privkey.pem \
    -out /etc/letsencrypt/live/${DOMAIN}/fullchain.pem \
    -subj '/CN=localhost'
"

# 2. Start nginx with the dummy cert
echo "==> Starting nginx..."
docker compose up -d nginx

# 3. Wait for nginx to be ready
echo "==> Waiting for nginx..."
sleep 5

# 4. Delete dummy certificate
echo "==> Removing temporary certificate..."
docker compose run --rm --entrypoint "" certbot sh -c "
  rm -rf /etc/letsencrypt/live/${DOMAIN} &&
  rm -rf /etc/letsencrypt/archive/${DOMAIN} &&
  rm -rf /etc/letsencrypt/renewal/${DOMAIN}.conf
"

# 5. Request real certificate
echo "==> Requesting Let's Encrypt certificate..."
STAGING_FLAG=""
if [ "$STAGING" = "1" ]; then
  STAGING_FLAG="--staging"
  echo "    (Using staging environment)"
fi

docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email "${EMAIL}" \
  --agree-tos \
  --no-eff-email \
  -d "${DOMAIN}" \
  ${STAGING_FLAG}

# 6. Reload nginx with the real cert
echo "==> Reloading nginx..."
docker compose exec nginx nginx -s reload

echo ""
echo "========================================="
echo "TLS certificate obtained for: ${DOMAIN}"
echo "========================================="
echo ""
echo "Now start all services:"
echo "  docker compose up -d"
