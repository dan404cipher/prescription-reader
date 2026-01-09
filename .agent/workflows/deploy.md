---
description: Deploy the Next.js prescription reader app to the demo server
---

# Deployment Steps for Next.js App

## Prerequisites
- SSH access to server
- Node.js 18+ installed on server
- PM2 and nginx already configured

## Local: Build & Push

1. Ensure all changes are committed and pushed:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## On Server: Setup & Deploy

2. SSH into your server:
```bash
ssh user@your-server-ip
```

3. Clone the repository (first time only):
```bash
cd /var/www  # or your preferred directory
git clone git@github.com:dan404cipher/prescription-reader.git
cd prescription-reader
```

Or pull latest changes (subsequent deploys):
```bash
cd /var/www/prescription-reader
git pull origin main
```

4. Install dependencies:
```bash
npm install
```

5. Create environment file on server:
```bash
nano .env.local
```
Add your environment variables:
```
OPENAI_API_KEY=your_openai_api_key_here
```

6. Build the production bundle:
```bash
npm run build
```

7. Start with PM2:
```bash
# First time
pm2 start npm --name "prescription-reader" -- start

# Or restart if already running
pm2 restart prescription-reader
```

8. Save PM2 process list:
```bash
pm2 save
```

## Nginx Configuration

9. Create nginx config:
```bash
sudo nano /etc/nginx/sites-available/prescription-reader
```

Add this configuration (adjust domain/port as needed):
```nginx
server {
    listen 80;
    server_name prescription.yourdomain.com;  # or your IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for AI processing
        proxy_read_timeout 120s;
        proxy_connect_timeout 120s;
        
        # Increase body size for image uploads
        client_max_body_size 10M;
    }
}
```

10. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/prescription-reader /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Quick Redeploy Script

Create a deploy script on server for future updates:
```bash
nano ~/deploy-prescription.sh
```

```bash
#!/bin/bash
cd /var/www/prescription-reader
git pull origin main
npm install
npm run build
pm2 restart prescription-reader
echo "Deployment complete!"
```

```bash
chmod +x ~/deploy-prescription.sh
```

Then just run `~/deploy-prescription.sh` for future deploys.

## Useful Commands

- View logs: `pm2 logs prescription-reader`
- Check status: `pm2 status`
- Restart: `pm2 restart prescription-reader`
- Stop: `pm2 stop prescription-reader`
