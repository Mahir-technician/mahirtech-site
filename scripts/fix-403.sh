#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-mahirtech.cloud}"
APP_PORT="${2:-3000}"
VHOST_SRC="deploy/nginx/mahirtech.cloud.conf"
VHOST_NAME="${DOMAIN}.conf"
VHOST_DST="/etc/nginx/sites-available/${VHOST_NAME}"
VHOST_LINK="/etc/nginx/sites-enabled/${VHOST_NAME}"

if [[ $EUID -ne 0 ]]; then
  echo "Run as root (or with sudo)."
  echo "Example: sudo bash scripts/fix-403.sh ${DOMAIN} ${APP_PORT}"
  exit 1
fi

if [[ ! -f "$VHOST_SRC" ]]; then
  echo "Missing ${VHOST_SRC} in current directory. Run inside repo root."
  exit 1
fi

if ! command -v nginx >/dev/null 2>&1; then
  echo "nginx is not installed. Install nginx first."
  exit 1
fi

echo "[1/6] Verifying app is reachable on 127.0.0.1:${APP_PORT}"
if ! curl -fsSI "http://127.0.0.1:${APP_PORT}" >/dev/null; then
  echo "App is not reachable on localhost:${APP_PORT}. Start Next.js first (pm2/systemd)."
  exit 1
fi

echo "[2/6] Installing nginx vhost: ${VHOST_DST}"
cp "$VHOST_SRC" "$VHOST_DST"

# Keep config generic by replacing hardcoded backend port if needed.
if [[ "$APP_PORT" != "3000" ]]; then
  sed -i "s/127.0.0.1:3000/127.0.0.1:${APP_PORT}/g" "$VHOST_DST"
fi

# Keep config aligned with requested domain.
if [[ "$DOMAIN" != "mahirtech.cloud" ]]; then
  sed -i "s/mahirtech\.cloud/${DOMAIN}/g" "$VHOST_DST"
fi

echo "[3/6] Enabling vhost"
ln -sfn "$VHOST_DST" "$VHOST_LINK"

echo "[4/6] Disabling default fallback site"
rm -f /etc/nginx/sites-enabled/default

echo "[5/6] Testing nginx config"
nginx -t

echo "[6/6] Reloading nginx"
systemctl reload nginx

echo
echo "Done. Quick verification:"
echo "  curl -I http://${DOMAIN}"
echo "  curl -I https://${DOMAIN}"
echo
echo "Expected: HTTP 301 to HTTPS, and HTTPS 200/304 from your Next.js app (not nginx 403)."