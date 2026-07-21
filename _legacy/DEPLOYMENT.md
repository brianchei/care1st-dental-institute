# Deployment Guide - Care1st Dental Management

This guide covers deployment options for your dental training institute website.

## Quick Deploy Options

### 1. Heroku (Recommended for beginners)

**Prerequisites:**
- Heroku account
- Heroku CLI installed

**Steps:**

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create Heroku app:
```bash
heroku create care1st-dental
```

3. Set environment variables:
```bash
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set ADMIN_EMAIL=admin@care1stdental.com
```

4. Deploy:
```bash
git push heroku main
```

5. Open your app:
```bash
heroku open
```

### 2. Vercel (Great for static + serverless)

**Prerequisites:**
- Vercel account
- Vercel CLI installed

**Steps:**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL

4. Redeploy for env vars to take effect:
```bash
vercel --prod
```

### 3. DigitalOcean App Platform

**Steps:**

1. Push code to GitHub
2. Go to DigitalOcean → Apps → Create App
3. Connect your GitHub repository
4. Configure:
   - Environment: Node.js
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Add environment variables in App Settings
6. Deploy

### 4. Railway (Modern alternative)

**Steps:**

1. Visit railway.app
2. Click "Start a New Project"
3. Connect GitHub repo or deploy from CLI
4. Add environment variables
5. Railway auto-deploys on push

### 5. AWS EC2 (For full control)

**Prerequisites:**
- AWS account
- EC2 instance (Ubuntu recommended)

**Steps:**

1. SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Install PM2 (process manager):
```bash
sudo npm install -g pm2
```

4. Clone your repository:
```bash
git clone your-repo-url
cd care1st-dental-management
```

5. Install dependencies:
```bash
npm install
```

6. Create .env file:
```bash
nano .env
# Add your environment variables
```

7. Start with PM2:
```bash
pm2 start server.js --name care1st-dental
pm2 save
pm2 startup
```

8. Install Nginx as reverse proxy:
```bash
sudo apt install nginx
```

9. Configure Nginx:
```bash
sudo nano /etc/nginx/sites-available/care1st-dental
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/care1st-dental /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. VPS (Linode, Vultr, etc.)

Similar to AWS EC2 setup above. Most VPS providers offer Ubuntu/Debian instances.

## Domain Setup

### Custom Domain Configuration

1. **Purchase domain** (from Namecheap, GoDaddy, Google Domains, etc.)

2. **Configure DNS:**
   
   Add these records:
   ```
   Type    Name    Value
   A       @       your-server-ip
   A       www     your-server-ip
   ```

3. **SSL Certificate (Let's Encrypt):**
   
   For Nginx on Ubuntu:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## Database Setup (Optional but Recommended)

### PostgreSQL on Heroku

```bash
heroku addons:create heroku-postgresql:mini
```

Update `server.js`:
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### MongoDB Atlas (Free tier)

1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Add to environment variables:
```
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/care1st
```

## Environment Variables Checklist

Ensure these are set in your deployment platform:

```
✓ PORT (usually auto-set by platform)
✓ EMAIL_USER
✓ EMAIL_PASS
✓ ADMIN_EMAIL
✓ DATABASE_URL (if using database)
✓ STRIPE_SECRET_KEY (if using payments)
```

## Performance Optimization

### 1. Enable Compression

Add to `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Cache Static Assets

In your Nginx config:
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Use CDN

Upload images to:
- Cloudinary (for images)
- AWS S3 + CloudFront
- imgix

### 4. Minify Assets

```bash
npm install -g terser clean-css-cli html-minifier
```

Build script:
```bash
terser script.js -o script.min.js
cleancss -o styles.min.css styles.css
```

## Monitoring & Maintenance

### Error Tracking

**Sentry:**
```bash
npm install @sentry/node
```

In `server.js`:
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Uptime Monitoring

Free services:
- UptimeRobot
- Pingdom
- StatusCake

### Logging

**Winston logger:**
```bash
npm install winston
```

### Analytics

Add Google Analytics to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## Backup Strategy

### Database Backups

**Automated backups:**
```bash
# PostgreSQL
pg_dump dbname > backup.sql

# MongoDB
mongodump --uri="mongodb+srv://..." --out=/backup
```

### File Backups

Set up automated backups to:
- AWS S3
- Google Cloud Storage
- Backblaze B2

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured (not in code)
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Dependencies updated regularly
- [ ] SQL injection prevention (if using SQL)
- [ ] XSS protection

### Add Security Headers

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "care1st-dental"
          heroku_email: "your-email@example.com"
```

## Cost Estimates

### Minimal Setup (Starting)
- Heroku Free/Hobby: $0-7/month
- Vercel Free tier: $0
- Domain: $10-15/year
- **Total: ~$10-100/year**

### Production Setup
- VPS (DigitalOcean): $12/month
- Domain: $15/year
- Database (managed): $15/month
- Email service: $10/month
- **Total: ~$450/year**

### High-Traffic Setup
- AWS EC2: $50-200/month
- RDS Database: $50/month
- CloudFront CDN: $20/month
- Route53: $1/month
- **Total: ~$1,500-3,000/year**

## Support & Troubleshooting

Common issues:

1. **Port already in use:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Email not sending:**
   - Check SMTP credentials
   - Enable "Less secure apps" for Gmail
   - Use App Password instead

3. **Deployment fails:**
   - Check logs: `heroku logs --tail`
   - Verify all env vars are set
   - Check Node version compatibility

## Next Steps

After deployment:
1. Test all forms and features
2. Set up monitoring
3. Configure backups
4. Add analytics
5. Submit sitemap to search engines
6. Set up email marketing (Mailchimp, SendGrid)
7. Create social media profiles
8. Plan content strategy

Need help? Check the README.md or contact support.
