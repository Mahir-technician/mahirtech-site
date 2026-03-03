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