#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-mahirtech.cloud}"
APP_PORT="${2:-3000}"

red() { printf '\033[31m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
yellow() { printf '\033[33m%s\033[0m\n' "$*"; }

section() {
  echo
  echo "== $* =="
}

section "1) Local app health (127.0.0.1:${APP_PORT})"
if curl -fsSI "http://127.0.0.1:${APP_PORT}" >/tmp/mahirtech_local_headers.txt; then
  green "Next.js app is reachable on localhost:${APP_PORT}"
  sed -n '1,10p' /tmp/mahirtech_local_headers.txt
else
  red "App is NOT reachable on localhost:${APP_PORT}. Start your app first (pm2/systemd)."
  exit 1
fi

section "2) Domain response over HTTP"
if curl -sSI "http://${DOMAIN}" >/tmp/mahirtech_http_headers.txt; then
  sed -n '1,12p' /tmp/mahirtech_http_headers.txt
else
  yellow "HTTP probe failed (can happen behind strict firewalls)."
fi

section "3) Domain response over HTTPS"
if curl -sSI "https://${DOMAIN}" >/tmp/mahirtech_https_headers.txt; then
  sed -n '1,16p' /tmp/mahirtech_https_headers.txt
else
  yellow "HTTPS probe failed from this host."
fi

section "4) Active nginx virtual hosts summary"
if command -v nginx >/dev/null 2>&1; then
  if nginx -T >/tmp/mahirtech_nginx_dump.txt 2>/tmp/mahirtech_nginx_err.txt; then
    rg -n "server_name|listen 80|listen 443|proxy_pass|root|index|X-Debug-Server" /tmp/mahirtech_nginx_dump.txt | sed -n '1,200p'
  else
    yellow "Could not run 'nginx -T' as current user. Try: sudo nginx -T"
    sed -n '1,40p' /tmp/mahirtech_nginx_err.txt || true
  fi
else
  yellow "nginx command not found on this host."
fi

section "5) Likely cause if browser shows 403"
echo "- Request is hitting the wrong server block (usually default site)."
echo "- Or SSL (443) block still serves static root instead of proxy_pass to 127.0.0.1:${APP_PORT}."
echo "- Fix by enabling deploy/nginx/mahirtech.cloud.conf and disabling default site."

green "Done."