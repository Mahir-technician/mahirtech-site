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
If `npm run build` and `pm2` are healthy but the browser still shows an Nginx `403 Forbidden`, Nginx is not proxying this domain to Next.js yet.

Most common causes:
- Domain points to the default Nginx server block instead of your app vhost.
- `server_name` does not match the live domain (for example `mahirtech.cloud`).
- A `root`-based static config is active without an `index` file, so Nginx returns 403.

Quick checks on server:
```bash
sudo nginx -T | rg -n "server_name|listen|proxy_pass|root"
curl -I http://127.0.0.1:3000
curl -I http://YOUR_DOMAIN
```

A working vhost should include:
```nginx
server {
  listen 80;
  server_name mahirtech.cloud www.mahirtech.cloud;

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

Then run:
```bash
sudo nginx -t && sudo systemctl reload nginx
pm2 save
```
