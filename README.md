# Base MiniApp

A comprehensive DeFi application built on Base network for buying USDC, swapping tokens, and tracking portfolios.

## Features

- **Buy USDC**: Purchase USDC with fiat or airtime using Fonbnk integration
- **Swap Tokens**: Exchange USDC for other tokens using UniswapX API
- **Track Portfolio**: Monitor wallet balances and portfolio history
- **Profile Management**: Save and manage multiple wallets

## Tech Stack

- **Frontend**: React 19 with React Router
- **Blockchain**: Base Network (Ethereum L2)
- **Onramp**: Fonbnk API for fiat-to-USDC conversion
- **Swaps**: UniswapX API for token exchanges
- **Portfolio Tracking**: Covalent API for wallet balances
- **Database**: Supabase for user data and portfolio history
- **Web3**: Wagmi, Viem, and Ethers.js for blockchain interactions

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Fonbnk API key
- Covalent API key (optional, for portfolio tracking)
- Uniswap API key (optional, for enhanced swap features)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd base-miniapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit `.env` with your actual API keys:
```env
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
REACT_APP_FONBNK_KEY=your_fonbnk_api_key_here
REACT_APP_COVALENT_KEY=your_covalent_api_key_here
REACT_APP_UNISWAP_API_KEY=your_uniswap_api_key_here
```

## Database Setup

Create the following tables in your Supabase project:

### Wallets Table
```sql
CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  address text NOT NULL,
  basename text,
  created_at timestamp DEFAULT now()
);
```

### Portfolio History Table
```sql
CREATE TABLE portfolio_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES wallets(id),
  token_symbol text,
  balance numeric,
  recorded_at timestamp DEFAULT now()
);
```

## Usage

### Development
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## API Integration

### Fonbnk Onramp
- Widget automatically loads when visiting `/buy` page
- Requires `REACT_APP_FONBNK_KEY` environment variable
- Supports USDC purchases on Base network

### UniswapX Swaps
- Get quotes via `/swap` page
- Execute swaps using the provided quote
- Integrates with Base network (Chain ID: 8453)

### Portfolio Tracking
- Track wallet balances using Covalent API
- Store historical snapshots in Supabase
- View portfolio history and trends

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── BuyUSDC.jsx     # Fonbnk widget integration
├── lib/                 # Service libraries
│   ├── supabaseClient.ts    # Supabase client configuration
│   ├── walletService.js     # Wallet management functions
│   ├── swapService.js       # Token swap functionality
│   └── portfolioService.js  # Portfolio tracking
├── pages/               # Main application pages
│   ├── Buy.jsx         # USDC purchase page
│   ├── Swap.jsx        # Token swap page
│   ├── Track.jsx       # Portfolio tracking page
│   └── Profile.jsx     # User profile and wallet management
└── App.js              # Main application with routing
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | Yes |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `REACT_APP_FONBNK_KEY` | Fonbnk API key for onramp | Yes |
| `REACT_APP_COVALENT_KEY` | Covalent API key for portfolio tracking | No |
| `REACT_APP_UNISWAP_API_KEY` | Uniswap API key for enhanced features | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
