# CarShare App Deployment Guide

This guide will help you deploy the CarShare app to Vercel hosting service.

## Prerequisites

1. **GitHub Account** - For code repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Rapyd Account** - For payment processing
4. **Database Service** - PlanetScale, Supabase, or similar

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: CarShare app with Rapyd integration"
```

### 1.2 Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/carshare-app.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Production Database

### Option A: PlanetScale (Recommended)
1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get your connection string
4. Run migrations:
```bash
npx prisma db push
npx prisma generate
```

### Option B: Supabase
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string
4. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and click "Import"

### 3.2 Configure Environment Variables
In Vercel dashboard, go to Settings > Environment Variables and add:

```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here
DATABASE_URL=your-production-database-url
RAPYD_ACCESS_KEY=your-production-rapyd-access-key
RAPYD_SECRET_KEY=your-production-rapyd-secret-key
RAPYD_BASE_URL=https://api.rapyd.net
```

### 3.3 Deploy
1. Click "Deploy" in Vercel
2. Wait for deployment to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Step 4: Configure Rapyd Webhooks

### 4.1 Set Webhook URL
In your Rapyd dashboard:
1. Go to Webhooks section
2. Add webhook URL: `https://your-app-name.vercel.app/api/payments/webhook`
3. Enable events:
   - `PAYMENT_COMPLETED`
   - `PAYMENT_FAILED`
   - `PAYMENT_CANCELLED`
   - `PAYMENT_REFUNDED`

### 4.2 Test Webhooks
Use Rapyd's webhook testing tools to verify webhook delivery.

## Step 5: Set Up Custom Domain (Optional)

### 5.1 Add Domain in Vercel
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 5.2 Update Environment Variables
Update `NEXTAUTH_URL` to your custom domain:
```
NEXTAUTH_URL=https://yourdomain.com
```

## Step 6: Production Checklist

### 6.1 Security
- [ ] Use strong, unique secrets for `NEXTAUTH_SECRET`
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Verify webhook signature validation
- [ ] Review API rate limiting

### 6.2 Performance
- [ ] Enable Vercel Analytics
- [ ] Configure CDN settings
- [ ] Optimize images
- [ ] Test page load speeds

### 6.3 Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Monitor payment webhooks
- [ ] Set up uptime monitoring

## Step 7: Database Migration

### 7.1 Run Production Migrations
```bash
# Connect to production database
npx prisma db push --accept-data-loss

# Generate Prisma client
npx prisma generate
```

### 7.2 Seed Production Data (Optional)
```bash
npm run seed
```

## Step 8: Testing

### 8.1 Test Payment Flow
1. Use Rapyd sandbox for testing
2. Test all payment methods
3. Verify webhook processing
4. Test error scenarios

### 8.2 Test User Flows
1. User registration and login
2. Car browsing and filtering
3. Booking creation
4. Payment processing
5. Host dashboard functionality

## Environment Variables Reference

### Required Variables
```env
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
RAPYD_ACCESS_KEY=your-rapyd-access-key
RAPYD_SECRET_KEY=your-rapyd-secret-key
RAPYD_BASE_URL=https://api.rapyd.net
```

### Optional Variables
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database service status
   - Ensure proper SSL configuration

2. **Payment Webhook Issues**
   - Verify webhook URL is accessible
   - Check webhook signature validation
   - Review Rapyd webhook logs

3. **Build Failures**
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Review build logs in Vercel

4. **Authentication Issues**
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is set
   - Review NextAuth configuration

### Getting Help

1. Check Vercel deployment logs
2. Review Rapyd dashboard for payment issues
3. Check database logs
4. Use browser developer tools for frontend issues

## Post-Deployment

### 1. Monitor Performance
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track user engagement

### 2. Regular Maintenance
- Update dependencies regularly
- Monitor security advisories
- Backup database regularly
- Review and rotate secrets

### 3. Scaling
- Monitor resource usage
- Consider upgrading Vercel plan
- Optimize database queries
- Implement caching strategies

## Security Best Practices

1. **Environment Variables**
   - Never commit secrets to git
   - Use Vercel's environment variable system
   - Rotate secrets regularly

2. **Database Security**
   - Use connection pooling
   - Enable SSL/TLS
   - Regular security updates

3. **API Security**
   - Validate all inputs
   - Implement rate limiting
   - Use HTTPS everywhere

4. **Payment Security**
   - Never store card details
   - Use Rapyd's secure infrastructure
   - Monitor for fraud

Your CarShare app is now ready for production! 🚀
