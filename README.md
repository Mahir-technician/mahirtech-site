# MahirTech Site

Premium dark-theme, animation-rich lead generation portfolio for MahirTech.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Production build
```bash
npm run build
npm run start
```

## Lead form setup
The contact form submits to `POST /api/leads`.
Current implementation validates payload and logs submissions server-side.

> TODO: Integrate real delivery/storage (e.g., Resend, SendGrid, or database) using environment variables.

Example env variables for future integration:
```bash
LEAD_EMAIL_TO=hello@mahirtech.com
RESEND_API_KEY=your_api_key
```

## Deploy on Linux + Nginx
1. Install Node.js 20+.
2. In project directory:
   ```bash
   npm install
   npm run build
   npm run start -- -p 3000
   ```
3. Run app with PM2/systemd.
4. Nginx reverse proxy:
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```
5. Add HTTPS using Certbot.

### Troubleshooting: `403 Forbidden` from Nginx
If `npm run build` and `pm2` are healthy but the browser still shows `403 Forbidden (nginx)`, the request is still being handled by the wrong Nginx server block (often the default static config), not your Next.js proxy block.

Most common causes:
- `server_name` mismatch (request host doesn't match your vhost, so Nginx falls back to another block).
- Default site still enabled (`/etc/nginx/sites-enabled/default`) and catching requests first.
- Port `443` block exists but still uses `root ...;` instead of `proxy_pass ...;`.
- Certbot created/edited SSL block that does not proxy to `127.0.0.1:3000`.

#### 1) Confirm app is healthy on localhost
```bash
curl -I http://127.0.0.1:3000
pm2 ls
pm2 logs mahirtech --lines 30
```

#### 2) Inspect active Nginx config (not just one file)
```bash
sudo nginx -T | rg -n "server_name|listen 80|listen 443|proxy_pass|root|index"
```
You should see your domain in both 80/443 blocks and `proxy_pass http://127.0.0.1:3000;` in the active `location /`.

#### 3) Recommended domain config (HTTP + HTTPS)
Create/update `/etc/nginx/sites-available/mahirtech.cloud`:

```nginx
server {
  listen 80;
  server_name mahirtech.cloud www.mahirtech.cloud;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name mahirtech.cloud www.mahirtech.cloud;

  # certbot paths
  ssl_certificate /etc/letsencrypt/live/mahirtech.cloud/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/mahirtech.cloud/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

Enable it and disable default fallback site:
```bash
sudo ln -sf /etc/nginx/sites-available/mahirtech.cloud /etc/nginx/sites-enabled/mahirtech.cloud
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

#### 4) Verify requests hit the proxy, not default nginx page
```bash
curl -I http://mahirtech.cloud
curl -I https://mahirtech.cloud
```
Expected: `200` (or `301` on HTTP redirect), not `403`.

#### 5) If still 403, identify exact responding server block
Temporarily add a debug header in each candidate block:
```nginx
add_header X-Debug-Server "mahirtech-443" always;
```
Reload Nginx and check:
```bash
curl -Ik https://mahirtech.cloud | rg -n "HTTP/|X-Debug-Server"
```
This tells you which block is serving the response.