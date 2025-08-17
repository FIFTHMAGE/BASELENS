# Base MiniApp - New Structure Setup Guide

This guide covers the complete setup for the new Base MiniApp with Wagmi, Web3 integration, and modern React components.

## 🏗️ New Architecture

```
base-miniapp/
├── src/
│   ├── components/          # New UI Components
│   │   ├── Login.js        # Wallet connection
│   │   ├── Onramp.js       # USDC purchase
│   │   ├── Swap.js         # Token swaps
│   │   └── Track.js        # Wallet monitoring
│   ├── lib/                 # API & Service Libraries
│   │   ├── supabase.js     # Database helpers
│   │   ├── fonbnk.js       # USDC onramp API
│   │   ├── basescan.js     # Base network data
│   │   └── swap.js         # 1inch swap API
│   ├── wagmi.js            # Web3 configuration
│   ├── App.js              # Main app with routing
│   └── index.js            # Entry point with WagmiProvider
├── public/
│   └── frame.html          # Farcaster Frame
├── tailwind.config.js      # Tailwind CSS config
└── env.example             # Environment variables
```

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env` file in your project root:

```bash
cp env.example .env
```

Edit `.env` with your actual API keys:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
REACT_APP_SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY

# Fonbnk Configuration
REACT_APP_FONBNK_KEY=YOUR_FONBNK_PUBLIC_OR_API_KEY

# BaseScan API for Base network
REACT_APP_BASESCAN_KEY=YOUR_BASESCAN_API_KEY

# 1inch API for token swaps (optional)
REACT_APP_1INCH_KEY=YOUR_1INCH_API_KEY
```

### 2. Database Setup

Run the SQL commands from `database-setup-new.sql` in your Supabase project:

1. **Users Table** - For wallet authentication
2. **Tracked Wallets Table** - For monitoring other wallets
3. **RLS Policies** - For security
4. **Indexes** - For performance

### 3. Start Development

```bash
npm start
```

## 🔑 Required API Keys

### 1. Supabase
- **Purpose**: Database and authentication
- **Setup**: Create project at [supabase.com](https://supabase.com)
- **Required**: Project URL and anonymous key

### 2. Fonbnk
- **Purpose**: USDC onramp (fiat/airtime → USDC)
- **Setup**: Contact Fonbnk for API access
- **Features**: Phone number verification, airtime conversion

### 3. BaseScan
- **Purpose**: Base network blockchain data
- **Setup**: Get API key at [basescan.org](https://basescan.org)
- **Features**: Token balances, transaction history

### 4. 1inch (Optional)
- **Purpose**: Token swaps and DEX aggregation
- **Setup**: Get API key at [1inch.dev](https://1inch.dev)
- **Features**: Best swap routes, quote generation

## 📱 Features

### Wallet Connection
- **Metamask/Injected Wallets**: Automatic detection
- **Base Network**: Configured for Base mainnet
- **User Management**: Automatic user creation in Supabase

### USDC Onramp
- **Phone Number**: Enter your phone number
- **Amount**: Specify fiat/airtime amount
- **Wallet**: Automatically uses connected wallet
- **Fonbnk Integration**: Handles the entire onramp flow

### Token Swaps
- **USDC → Token**: Swap USDC for any token on Base
- **1inch Integration**: Best swap routes and quotes
- **Transaction Data**: Get ready-to-send transaction data

### Wallet Tracking
- **Add Wallets**: Track any wallet address
- **Token Transfers**: View recent token movements
- **BaseScan Data**: Real-time blockchain data

## 🔌 API Endpoints

### Fonbnk Onramp
```javascript
// Initiate USDC purchase
const result = await initiateOnramp({
  phoneNumber: '+1234567890',
  walletAddress: '0x...',
  amount: '100'
})
```

### BaseScan Data
```javascript
// Get recent token transfers
const transfers = await getRecentTokenTx('0x...')
```

### 1inch Swaps
```javascript
// Get swap transaction data
const swapData = await getOneInchSwapTx({
  fromAddress: '0x...',
  toToken: '0x...',
  usdcAmount: '10'
})
```

## 🗄️ Database Schema

### Users Table
```sql
users (
  id: uuid PRIMARY KEY,
  wallet_address: text UNIQUE,
  created_at: timestamp,
  updated_at: timestamp
)
```

### Tracked Wallets Table
```sql
tracked_wallets (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  tracked_wallet: text,
  created_at: timestamp
)
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Wallet Authentication**: Secure wallet-based user identification
- **Input Validation**: Request parameter validation
- **Error Handling**: Comprehensive error logging

## 🎨 UI Components

### Login Component
- Wallet connection/disconnection
- User state management
- Automatic user creation

### Onramp Component
- Phone number input
- Amount specification
- Fonbnk integration

### Swap Component
- Token address input
- USDC amount input
- 1inch quote generation

### Track Component
- Wallet address input
- Tracked wallets display
- Recent transactions table

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy build/ folder to your hosting service
```

### Environment Variables
Ensure all production environment variables are set in your hosting platform.

### Farcaster Frame
Update `public/frame.html` with your actual domain:
- Replace `YOUR_DOMAIN` with your actual domain
- Add an `og-image.png` for the frame preview

## 🧪 Testing

### Local Development
1. Start the development server: `npm start`
2. Connect your wallet (Metamask, etc.)
3. Test each component individually
4. Check browser console for errors

### API Testing
- Test wallet connection
- Test Fonbnk onramp flow
- Test BaseScan data fetching
- Test 1inch swap quotes

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure Metamask is installed
   - Check if Base network is added
   - Verify wallet permissions

2. **API Key Errors**
   - Check environment variables
   - Verify API key permissions
   - Check API rate limits

3. **Database Errors**
   - Verify Supabase credentials
   - Check table creation
   - Verify RLS policies

4. **Compilation Errors**
   - Check dependency versions
   - Clear node_modules and reinstall
   - Verify import paths

### Debug Mode
```bash
# Check environment variables
echo $REACT_APP_SUPABASE_URL

# Check browser console
# Check network tab for API calls
# Check Supabase dashboard for data
```

## 📚 Additional Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [Base Network Documentation](https://docs.base.org/)
- [Fonbnk API Documentation](https://docs.fonbnk.com/)
- [1inch API Documentation](https://docs.1inch.dev/)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Your Base MiniApp is now ready with modern Web3 integration! 🚀**

Connect your wallet and start building on Base!
