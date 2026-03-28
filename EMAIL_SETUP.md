# Email Setup Guide for E-Commerce App

## Overview
The app now sends order confirmation emails to customers and notifications to admins when orders are placed.

---

## Email Configuration Options

### Option 1: Gmail (Recommended for Testing)

**Steps:**

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Update .env file:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=abcdefghijklmnop
ADMIN_EMAIL=admin@yourstore.com
```

---

### Option 2: SendGrid (Free Tier - 100 emails/day)

1. Sign up at: https://sendgrid.com
2. Create an API Key
3. Update .env:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_API_KEY
ADMIN_EMAIL=admin@yourstore.com
```

---

### Option 3: Mailgun (Free Tier - 5,000 emails/month)

1. Sign up at: https://mailgun.com
2. Verify your domain or use sandbox
3. Get SMTP credentials
4. Update .env:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
ADMIN_EMAIL=admin@yourstore.com
```

---

### Option 4: Mailtrap (Free - For Testing Only)

Perfect for development/testing (emails don't actually send):

1. Sign up at: https://mailtrap.io
2. Get inbox credentials
3. Update .env:
```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
ADMIN_EMAIL=admin@yourstore.com
```

---

## What Happens

### When an order is placed:

1. **Customer receives:**
   - Beautifully formatted order confirmation email
   - Order ID and status
   - List of items purchased
   - Total amount
   - Shipping address
   - Payment confirmation

2. **Admin receives:**
   - Notification of new order
   - Customer details
   - Order summary
   - Quick overview for processing

---

## Testing Locally

1. **Update server/.env** with your SMTP credentials
2. **Restart the server:**
```bash
cd server
npm run dev
```

3. **Place a test order** through the app
4. **Check your email** inbox

---

## For Railway Deployment

Add these environment variables in Railway dashboard:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@yourstore.com
```

---

## Email Template Features

- ✅ Professional HTML design
- ✅ Mobile responsive
- ✅ Beautiful gradients and styling
- ✅ Order details with item breakdown
- ✅ Shipping address
- ✅ Payment confirmation
- ✅ Brand colors and logo-ready

---

## Troubleshooting

### Emails not sending?

1. **Check SMTP credentials** are correct
2. **Verify port** (587 for TLS, 465 for SSL)
3. **Check spam folder** for test emails
4. **Gmail users**: Make sure you're using App Password, not regular password
5. **Check server logs** for error messages

### Gmail blocking sign-in?

- Enable "Less secure app access" (not recommended)
- OR use App Passwords (recommended)
- OR use SendGrid/Mailgun instead

---

## Production Recommendations

For production use:

1. **Use dedicated email service** (SendGrid, Mailgun, AWS SES)
2. **Verify your domain** to avoid spam filters
3. **Set up SPF, DKIM, DMARC** records
4. **Monitor email delivery** rates
5. **Add unsubscribe links** for marketing emails
6. **Store email templates** in database for easy updates

---

## Cost Comparison

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| Gmail | Limited | Not for bulk |
| SendGrid | 100/day | $15/month (40k) |
| Mailgun | 5,000/month | $35/month (50k) |
| AWS SES | 62,000/month (free if in EC2) | $0.10/1000 |
| Mailtrap | Testing only | N/A |

---

## Next Steps

1. Choose your email provider
2. Get credentials
3. Update `.env` file
4. Test locally
5. Update Railway environment variables
6. Deploy!

🎉 **Email notifications are ready to use!**
