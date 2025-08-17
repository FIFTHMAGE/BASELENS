# Base MiniApp Backend API

Express.js backend server for the Base MiniApp, providing APIs for Fonbnk onramp, token swaps, and wallet tracking.

## Features

- **Fonbnk Onramp API** - Create USDC purchase sessions
- **Webhook Handler** - Process Fonbnk payment confirmations
- **Wallet Tracking** - Add and manage wallet addresses
- **Portfolio API** - Fetch wallet balances and portfolio data
- **Token Swap API** - Get quotes and execute swaps via 1inch
- **Transaction History** - Track all wallet activities

## API Endpoints

### Fonbnk Onramp
- `POST /api/fonbnk/onramp` - Create onramp session
- `POST /api/fonbnk/webhook` - Handle payment webhooks

### Wallet Management
- `POST /api/wallets/track` - Track new wallet
- `GET /api/wallets/:address/tokens` - Get token balances (BaseScan)
- `GET /api/wallets/:address/portfolio` - Get portfolio data (Covalent)
- `GET /api/wallets/:address/transactions` - Get transaction history

### Token Swaps
- `POST /api/swap` - Get swap quote
- `POST /api/swap/execute` - Execute swap transaction

### Health Check
- `GET /api/health` - Server status

## Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
```bash
cp env.example .env
```

Edit `.env` with your actual API keys:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
FONBNK_API_KEY=your_fonbnk_api_key
BASESCAN_API_KEY=your_basescan_api_key
COVALENT_API_KEY=your_covalent_api_key
INCH_API_KEY=your_1inch_api_key
WEBHOOK_SECRET=your_webhook_secret
```

### 3. Database Setup
Run the SQL commands from `database-setup-extended.sql` in your Supabase project.

### 4. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Usage Examples

### Create Onramp Session
```bash
curl -X POST http://localhost:5000/api/fonbnk/onramp \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x1234...",
    "fiatCurrency": "NGN",
    "cryptoCurrency": "USDC",
    "amount": 100
  }'
```

### Track Wallet
```bash
curl -X POST http://localhost:5000/api/wallets/track \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x1234...",
    "basename": "My Wallet",
    "user_id": "user123"
  }'
```

### Get Portfolio
```bash
curl http://localhost:5000/api/wallets/0x1234.../portfolio
```

### Get Swap Quote
```bash
curl -X POST http://localhost:5000/api/swap \
  -H "Content-Type: application/json" \
  -d '{
    "fromToken": "0xA0b86a33E6441b8c4C8C7B4b8C8C8C8C8C8C8C8C",
    "toToken": "0xB0b86a33E6441b8c4C8C7B4b8C8C8C8C8C8C8C8C",
    "amount": "1000000",
    "walletAddress": "0x1234...",
    "slippage": 1
  }'
```

## Database Schema

### Core Tables
- `wallets` - User wallet addresses
- `portfolio_history` - Balance snapshots
- `onramp_sessions` - USDC purchase sessions
- `transactions` - All wallet transactions
- `swap_quotes` - Token swap quotes

### Views
- `wallet_summary` - Wallet statistics and counts

## Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **CORS Configuration** - Configurable cross-origin requests
- **Webhook Verification** - Secure webhook processing (implement signature verification)
- **Input Validation** - Request parameter validation
- **Error Handling** - Comprehensive error logging and responses

## Integration Points

### Fonbnk
- Onramp session creation
- Payment webhook processing
- Transaction status tracking

### Base Network
- BaseScan API for token balances
- Covalent API for portfolio data
- 1inch API for token swaps

### Supabase
- User authentication
- Data persistence
- Real-time updates

## Development

### File Structure
```
server/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── env.example           # Environment variables template
└── README.md             # This file
```

### Adding New Endpoints
1. Add route handler in `server.js`
2. Update database schema if needed
3. Add to API documentation
4. Test with appropriate tools

### Testing
- Use tools like Postman or curl for API testing
- Monitor server logs for debugging
- Check Supabase dashboard for data persistence

## Deployment

### Environment Variables
Ensure all required environment variables are set in production.

### Database
Run database migrations before deploying.

### Monitoring
- Monitor API response times
- Track error rates
- Monitor webhook processing

## Support

For issues and questions:
1. Check server logs
2. Verify environment variables
3. Test API endpoints individually
4. Check database connectivity
