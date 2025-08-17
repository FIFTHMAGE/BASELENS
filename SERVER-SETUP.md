# 🚀 Server Setup Guide for Fonbnk Integration

This guide will help you set up the server-to-server integration with Fonbnk for buying USDC.

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **npm** or **yarn**
3. **Fonbnk API Key** (get from [https://fonbnk.com](https://fonbnk.com))
4. **Supabase Account** (for database storage)

## 🔧 Step 1: Install Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

## 🔑 Step 2: Environment Configuration

Create a `.env` file in the server directory with the following variables:

```bash
# Server Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Fonbnk Configuration
FONBNK_API_KEY=your_fonbnk_api_key_here

# BaseScan API for Base network
BASESCAN_API_KEY=your_basescan_api_key_here

# Webhook Secret (for Fonbnk webhook verification)
WEBHOOK_SECRET=your_webhook_secret_here
```

### 🔍 Getting Your API Keys

#### **Fonbnk API Key**
1. Go to [https://fonbnk.com](https://fonbnk.com)
2. Sign up for an account
3. Navigate to your dashboard/API section
4. Generate or copy your API key

#### **Supabase Configuration**
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy your Project URL and anon key

#### **BaseScan API Key**
1. Go to [https://basescan.org](https://basescan.org)
2. Create an account
3. Go to your profile and generate an API key

## 🗄️ Step 3: Database Setup

The server expects the following tables in your Supabase database:

### **onramp_sessions Table**
```sql
CREATE TABLE onramp_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  wallet_address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  fiat_currency TEXT NOT NULL,
  crypto_currency TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  network TEXT NOT NULL,
  status TEXT NOT NULL,
  transaction_hash TEXT,
  fiat_amount DECIMAL,
  crypto_amount DECIMAL,
  fonbnk_data JSONB,
  webhook_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **transactions Table**
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  fiat_amount DECIMAL,
  token TEXT NOT NULL,
  network TEXT NOT NULL,
  transaction_hash TEXT,
  status TEXT NOT NULL,
  session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Step 4: Start the Server

Start the server in development mode:

```bash
npm run dev
```

Or in production mode:

```bash
npm start
```

The server will start on port 5000 (or the port specified in your `.env` file).

## 🌐 Step 5: Test the Integration

### **Test the Onramp Endpoint**
```bash
curl -X POST http://localhost:5000/api/fonbnk/onramp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+2348012345678",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "amount": 50000,
    "fiatCurrency": "NGN",
    "cryptoCurrency": "USDC",
    "network": "BASE"
  }'
```

### **Test Session Status**
```bash
curl http://localhost:5000/api/fonbnk/onramp/YOUR_SESSION_ID
```

## 🔗 Step 6: Frontend Integration

The frontend is already configured to use the server endpoints. Make sure your React app is pointing to the correct server URL.

## 📡 Step 7: Webhook Configuration

To receive real-time transaction updates, configure your Fonbnk webhook URL:

```
https://your-domain.com/api/fonbnk/webhook
```

### **Webhook Events Handled**
- `initiated` - Session created
- `pending` - Payment pending
- `processing` - Payment processing
- `completed` - Payment completed
- `failed` - Payment failed

## 🛡️ Security Features

### **API Key Protection**
- API keys are stored server-side only
- Never exposed to the frontend
- Secure environment variable storage

### **Webhook Verification**
- HMAC-SHA256 signature verification
- Configurable webhook secret
- Replay attack protection

### **Input Validation**
- Wallet address format validation
- Amount validation
- Phone number validation
- SQL injection protection

## 🔍 Troubleshooting

### **Common Issues**

#### **1. "API key is not configured"**
- Check your `.env` file exists
- Verify `FONBNK_API_KEY` is set correctly
- Restart the server after changing environment variables

#### **2. "Unable to connect to Fonbnk service"**
- Check your internet connection
- Verify the Fonbnk API is accessible
- Check if Fonbnk service is down

#### **3. "Authentication failed"**
- Verify your Fonbnk API key is correct
- Check if your API key has the required permissions
- Ensure your API key is active

#### **4. Database connection errors**
- Verify your Supabase credentials
- Check if the required tables exist
- Ensure your Supabase project is active

### **Debug Mode**

Enable debug logging by setting:

```bash
DEBUG=true
```

## 📚 API Reference

### **POST /api/fonbnk/onramp**
Initiates a new onramp session.

**Request Body:**
```json
{
  "phoneNumber": "string (required)",
  "walletAddress": "string (required)",
  "amount": "number (required)",
  "fiatCurrency": "string (default: NGN)",
  "cryptoCurrency": "string (default: USDC)",
  "network": "string (default: BASE)",
  "redirectUrl": "string (optional)",
  "metadata": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "string",
  "status": "string",
  "checkoutUrl": "string",
  "message": "string"
}
```

### **GET /api/fonbnk/onramp/:sessionId**
Get the status of an onramp session.

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "string",
    "status": "string",
    "walletAddress": "string",
    "amount": "number",
    "fiatCurrency": "string",
    "cryptoCurrency": "string",
    "network": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### **GET /api/fonbnk/history/:walletAddress**
Get onramp history for a wallet address.

**Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "string",
      "status": "string",
      "amount": "number",
      "fiatCurrency": "string",
      "cryptoCurrency": "string",
      "network": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "transactionHash": "string"
    }
  ]
}
```

## 🎯 Next Steps

1. **Test the integration** with small amounts
2. **Monitor webhook delivery** in your server logs
3. **Set up monitoring** for production use
4. **Configure error alerts** for failed transactions
5. **Implement user notifications** for transaction updates

## 📞 Support

If you encounter issues:

1. Check the server logs for error messages
2. Verify your API keys and configuration
3. Test with the provided curl commands
4. Check Fonbnk's service status
5. Review the troubleshooting section above

---

**Happy integrating! 🚀**
