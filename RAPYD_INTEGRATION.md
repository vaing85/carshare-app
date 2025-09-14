# Rapyd Payment Integration

This document outlines the Rapyd payment integration implementation for the CarShare application.

## Overview

The CarShare app now includes full Rapyd payment processing capabilities, allowing users to make secure payments for car rentals using multiple payment methods and currencies.

## Features

- **Multiple Payment Methods**: Credit cards, bank transfers, e-wallets, and more
- **Global Currency Support**: Process payments in various currencies
- **Secure Processing**: Industry-standard encryption and fraud protection
- **Webhook Support**: Real-time payment status updates
- **Customer Management**: Automatic customer creation and management
- **Refund Support**: Full refund capabilities

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```env
RAPYD_ACCESS_KEY=your_rapyd_access_key_here
RAPYD_SECRET_KEY=your_rapyd_secret_key_here
RAPYD_BASE_URL=https://sandboxapi.rapyd.net
```

### 2. Rapyd Account Setup

1. Sign up for a Rapyd account at [https://rapyd.net](https://rapyd.net)
2. Get your Access Key and Secret Key from the Rapyd Dashboard
3. Configure webhook endpoints in your Rapyd dashboard:
   - Webhook URL: `https://yourdomain.com/api/payments/webhook`
   - Events: `PAYMENT_COMPLETED`, `PAYMENT_FAILED`, `PAYMENT_CANCELLED`, `PAYMENT_REFUNDED`

## API Endpoints

### Payment Methods
- **GET** `/api/payments/methods?country=US` - Get available payment methods for a country

### Create Payment
- **POST** `/api/payments/create` - Create a new payment
  ```json
  {
    "carId": "string",
    "startDate": "2024-01-15",
    "endDate": "2024-01-17",
    "totalAmount": 258.75,
    "currency": "USD",
    "paymentMethod": "card_visa",
    "notes": "Optional notes"
  }
  ```

### Payment Status
- **GET** `/api/payments/status?paymentId=payment_id` - Get payment status

### Webhook
- **POST** `/api/payments/webhook` - Handle Rapyd webhooks

## Database Schema

### Updated User Model
```prisma
model User {
  // ... existing fields
  rapydCustomerId  String?   @unique
}
```

### Updated Booking Model
```prisma
model Booking {
  // ... existing fields
  totalAmount     Float?
  paymentId       String?   @unique
  paymentStatus   String?
}
```

### New Booking Status
```prisma
enum BookingStatus {
  PENDING
  CONFIRMED
  ACTIVE
  COMPLETED
  CANCELLED
  REJECTED
  REFUNDED  // New status
}
```

## Components

### PaymentForm Component
A comprehensive payment form that:
- Fetches available payment methods from Rapyd
- Displays payment options with icons
- Handles payment processing
- Shows security notices and error handling

### Payment Status Page
- Handles payment callbacks from Rapyd
- Displays payment status (success, error, pending)
- Provides appropriate actions based on status

## Payment Flow

1. **User selects car and dates** → Booking form
2. **User clicks "Book Now"** → Payment page
3. **PaymentForm loads** → Fetches available payment methods
4. **User selects payment method** → Payment method selection
5. **User clicks "Pay"** → Creates payment via Rapyd API
6. **Payment processing** → Redirects to Rapyd checkout or processes inline
7. **Payment completion** → Webhook updates booking status
8. **User redirected** → Success page with booking confirmation

## Webhook Events

The application handles the following Rapyd webhook events:

- **PAYMENT_COMPLETED**: Updates booking status to CONFIRMED
- **PAYMENT_FAILED**: Updates booking status to CANCELLED
- **PAYMENT_CANCELLED**: Updates booking status to CANCELLED
- **PAYMENT_REFUNDED**: Updates booking status to REFUNDED

## Security Features

- **Signature Verification**: All webhooks are verified using HMAC signatures
- **HTTPS Only**: All API calls use HTTPS
- **No Card Storage**: Card details are never stored locally
- **PCI Compliance**: Rapyd handles PCI compliance requirements

## Testing

### Sandbox Mode
The integration is configured for Rapyd's sandbox environment by default. Use test payment methods provided by Rapyd for testing.

### Test Payment Methods
- **Cards**: Use Rapyd's test card numbers
- **Bank Transfers**: Use test bank account details
- **E-wallets**: Use test wallet credentials

## Error Handling

The integration includes comprehensive error handling:
- API errors are caught and displayed to users
- Payment failures are logged and tracked
- Webhook processing errors are handled gracefully
- Database transaction rollbacks on errors

## Monitoring

- Payment status is tracked in the database
- Webhook events are logged for debugging
- Error messages are user-friendly
- Performance monitoring is included

## Production Deployment

Before going live:

1. **Update Environment Variables**:
   - Change `RAPYD_BASE_URL` to production URL
   - Use production Access Key and Secret Key

2. **Configure Webhooks**:
   - Set up production webhook endpoints
   - Test webhook delivery

3. **Update Database**:
   - Run `npx prisma db push` to apply schema changes
   - Ensure all migrations are applied

4. **Test Thoroughly**:
   - Test all payment methods
   - Verify webhook processing
   - Test error scenarios

## Support

For issues with the Rapyd integration:
1. Check the Rapyd Dashboard for payment status
2. Review webhook logs
3. Check database for booking status
4. Contact Rapyd support for API issues

## Cost Structure

Rapyd charges based on:
- Transaction volume
- Payment method used
- Currency conversion
- Geographic location

Check Rapyd's pricing page for current rates.
