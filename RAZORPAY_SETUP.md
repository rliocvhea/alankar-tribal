# Razorpay Setup Guide

## Current Status
✅ Project successfully migrated from Stripe to Razorpay
✅ Backend server running on http://localhost:5001
✅ Frontend server running on http://localhost:3000
❌ **Authentication failing** - Need valid Razorpay credentials

## Issue
The payment API is failing with: `"Authentication failed"`

This is because the `.env` file contains placeholder values:
```
RAZORPAY_KEY_ID=rzp_test_YourTestKeyId
RAZORPAY_KEY_SECRET=YourTestKeySecret
```

## How to Fix

### Step 1: Get Razorpay Credentials

1. **Sign up for Razorpay**
   - Go to https://razorpay.com/
   - Click "Sign Up" and create an account
   - Complete the verification process

2. **Get Test Mode Credentials**
   - After logging in, go to Settings → API Keys
   - Switch to **Test Mode** (toggle at top-left)
   - Click "Generate Test Key"
   - You'll see:
     - **Key Id** (starts with `rzp_test_`)
     - **Key Secret** (click "Show" to reveal)

### Step 2: Update Environment Variables

1. **Update server/.env**
   ```bash
   cd /Users/csharptek/Desktop/Kaam/e-com/server
   nano .env
   ```
   
   Replace the placeholders with your real keys:
   ```env
   PORT=5001
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
   ```

2. **Update client/.env**
   ```bash
   cd /Users/csharptek/Desktop/Kaam/e-com/client
   nano .env
   ```
   
   Update with your Key ID:
   ```env
   VITE_API_URL=http://localhost:5001
   VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
   ```

### Step 3: Restart Servers

The servers are running in watch mode, so they should auto-restart when you save the .env files. If not:

1. Stop the backend server (Ctrl+C in the terminal)
2. Restart: `cd server && npm run dev`

## Testing Payment

Once you have valid credentials:

1. Go to http://localhost:3000
2. Log in as a customer
3. Add items to cart
4. Go to checkout
5. Click "Pay with Razorpay"
6. Use Razorpay test cards:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

## Test Mode vs Production Mode

- **Test Mode**: Use for development, no real money is charged
- **Production Mode**: For live transactions (requires KYC verification)

Currently, the app is configured for Test Mode, which is perfect for development.

## Verification

Test the API directly:
```bash
curl -X POST http://localhost:5001/api/create-razorpay-order \
  -H "Content-Type: application/json" \
  -d '{"amount":79.99}'
```

Expected response:
```json
{
  "orderId": "order_XXXXXXXXXXXXX",
  "amount": 7999,
  "currency": "INR"
}
```

## Need Help?

- Razorpay Docs: https://razorpay.com/docs/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-upi-details/
