# Base MiniApp Complete Setup Guide

This guide will help you set up the complete Base MiniApp with both frontend and backend components.

## 🏗️ Architecture Overview

```
base-miniapp/
├── src/                    # React Frontend
│   ├── components/         # UI Components
│   ├── pages/             # Main App Pages
│   ├── lib/               # Service Libraries
│   └── App.js             # Main App with Routing
├── server/                 # Express.js Backend
│   ├── server.js          # Main API Server
│   ├── package.json       # Backend Dependencies
│   └── README.md          # Backend Documentation
├── package.json            # Frontend Dependencies & Scripts
└── README.md               # Project Overview
```

## 🚀 Quick Start

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Set Up Environment Variables

#### Frontend (.env)
```bash
cp env.example .env
```

Edit `.env` with your API keys:
```env
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
REACT_APP_FONBNK_KEY=your_fonbnk_api_key_here
REACT_APP_COVALENT_KEY=your_covalent_api_key_here
REACT_APP_UNISWAP_API_KEY=your_uniswap_api_key_here
REACT_APP_API_URL=http://localhost:5000/api
```

#### Backend (server/.env)
```bash
cd server
cp env.example .env
```

Edit `server/.env`:
```env
PORT=5000
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
FONBNK_API_KEY=your_fonbnk_api_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
COVALENT_API_KEY=your_covalent_api_key_here
INCH_API_KEY=your_1inch_api_key_here
WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Database Setup

Run these SQL commands in your Supabase project:

1. **Basic Tables** (from `database-setup.sql`):
   - `wallets` - User wallet addresses
   - `portfolio_history` - Balance snapshots

2. **Extended Tables** (from `database-setup-extended.sql`):
   - `onramp_sessions` - USDC purchase sessions
   - `transactions` - All wallet transactions
   - `swap_quotes` - Token swap quotes

### 4. Start Development Servers

#### Option A: Start Both Servers (Recommended)
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

#### Option B: Start Servers Separately
```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm start
```

## 🔑 Required API Keys

### 1. Supabase
- **URL**: Your Supabase project URL
- **Anon Key**: Public anonymous key
- **Setup**: Create project at [supabase.com](https://supabase.com)

### 2. Fonbnk
- **Purpose**: USDC onramp (fiat → USDC)
- **Setup**: Contact Fonbnk for API access
- **Features**: Widget integration, webhook handling

### 3. BaseScan
- **Purpose**: Base network blockchain data
- **Setup**: Get API key at [basescan.org](https://basescan.org)
- **Features**: Token balances, transaction history

### 4. Covalent
- **Purpose**: Portfolio tracking and analytics
- **Setup**: Get API key at [covalenthq.com](https://covalenthq.com)
- **Features**: Multi-token balances, price data

### 5. 1inch
- **Purpose**: Token swaps and DEX aggregation
- **Setup**: Get API key at [1inch.dev](https://1inch.dev)
- **Features**: Best swap routes, quote generation

## 📱 Frontend Features

### Pages
- **Home** (`/`) - Welcome and navigation
- **Buy** (`/buy`) - Fonbnk USDC onramp widget
- **Swap** (`/swap`) - Token exchange interface
- **Track** (`/track`) - Portfolio monitoring
- **Profile** (`/profile`) - Wallet management

### Components
- **BuyUSDC** - Fonbnk widget integration
- **Navigation** - Responsive menu system
- **Forms** - Input validation and error handling

### Services
- **walletService** - Wallet CRUD operations
- **swapService** - Token swap functionality
- **portfolioService** - Portfolio tracking

## 🔌 Backend API Endpoints

### Fonbnk Integration
- `POST /api/fonbnk/onramp` - Create USDC purchase session
- `POST /api/fonbnk/webhook` - Handle payment confirmations

### Wallet Management
- `POST /api/wallets/track` - Add new wallet
- `GET /api/wallets/:address/tokens` - Get token balances
- `GET /api/wallets/:address/portfolio` - Get portfolio data
- `GET /api/wallets/:address/transactions` - Get transaction history

### Token Swaps
- `POST /api/swap` - Get swap quote
- `POST /api/swap/execute` - Execute swap transaction

### Health & Status
- `GET /api/health` - Server status

## 🗄️ Database Schema

### Core Tables
```sql
-- User wallets
wallets (id, user_id, address, basename, created_at, updated_at)

-- Portfolio snapshots
portfolio_history (id, wallet_id, token_symbol, balance, recorded_at)

-- Onramp sessions
onramp_sessions (id, wallet_address, fiat_currency, crypto_currency, amount, session_id, status, transaction_hash, created_at, completed_at, updated_at)

-- All transactions
transactions (id, wallet_address, type, amount, token, transaction_hash, status, created_at, updated_at)

-- Swap quotes
swap_quotes (id, wallet_address, from_token, to_token, amount, quote_data, created_at)
```

### Views
```sql
-- Wallet summary statistics
wallet_summary (id, user_id, address, basename, created_at, transaction_count, onramp_count, swap_quote_count)
```

## 🔒 Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **CORS Configuration** - Configurable cross-origin requests
- **Input Validation** - Request parameter validation
- **Error Handling** - Comprehensive error logging
- **Webhook Verification** - Secure webhook processing (implement signature verification)

## 🧪 Testing

### API Testing
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test wallet tracking
curl -X POST http://localhost:5000/api/wallets/track \
  -H "Content-Type: application/json" \
  -d '{"wallet_address": "0x1234...", "basename": "Test Wallet"}'

# Test portfolio API
curl http://localhost:5000/api/wallets/0x1234.../portfolio
```

### Frontend Testing
- Navigate to http://localhost:3000
- Test all pages and functionality
- Check browser console for errors
- Verify API calls in Network tab

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy build/ folder to your hosting service
```

### Backend
```bash
cd server
npm start
# Deploy to your preferred hosting service (Heroku, Vercel, etc.)
```

### Environment Variables
Ensure all production environment variables are set in your hosting platform.

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Frontend: Change port in package.json scripts
   - Backend: Change PORT in server/.env

2. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend API_URL setting

3. **Database Connection**
   - Verify Supabase credentials
   - Check database table creation
   - Verify RLS policies

4. **API Key Issues**
   - Check all environment variables
   - Verify API key permissions
   - Test API endpoints individually

### Debug Mode
```bash
# Backend with detailed logging
cd server && DEBUG=* npm run dev

# Frontend with React DevTools
npm start
```

## 📚 Additional Resources

- [Base Network Documentation](https://docs.base.org/)
- [Fonbnk API Documentation](https://docs.fonbnk.com/)
- [1inch API Documentation](https://docs.1inch.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check server logs
4. Open an issue in the repository

---

**Happy Building! 🚀**

Your Base MiniApp is now ready for development and testing!
