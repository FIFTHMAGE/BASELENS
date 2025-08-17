# Wallet Tracking Feature

## Overview
This feature allows users to track multiple wallets and view detailed information about each wallet including balances, transactions, and token transfers.

## Features

### 1. Track Wallets
- Add wallet addresses to your tracking list
- View all tracked wallets in a clean interface
- Each wallet shows a shortened address (e.g., `0xE4B0...37dc`)

### 2. Wallet Details View
When you click on a tracked wallet, you'll see:

#### **Balances**
- **ETH Balance**: Native Base ETH balance
- **WETH Balance**: Wrapped ETH on Base
- **USDC Balance**: USD Coin on Base

#### **Last Transaction**
- Transaction hash
- Date and time
- Value transferred
- Gas used

#### **Recent Token Transfers**
- Token symbol and contract address
- Transfer amount
- Transaction type (Received/Sent)
- Date

#### **Actions**
- View on BaseScan (opens in new tab)
- Refresh data

### 3. Transaction History
- Click the 📊 button to view recent token transfers
- Shows the last 12 token transactions
- Displays token, value, addresses, and timestamps

## How to Use

1. **Add a Wallet**:
   - Enter wallet address in the input field
   - Click "Add" button
   - Wallet will appear in your tracked list

2. **View Wallet Details**:
   - Click on the blue wallet button
   - Modal will open showing comprehensive wallet information
   - Click ✕ to close

3. **View Transactions**:
   - Click the 📊 button next to any wallet
   - Recent token transfers will appear below

## Technical Details

### API Endpoints Used
- **BaseScan API**: For blockchain data
- **Supabase**: For storing tracked wallets

### Required Environment Variables
```
REACT_APP_BASESCAN_KEY=your_basescan_api_key
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_key
```

### Data Sources
- **ETH Balance**: BaseScan account balance API
- **Token Balances**: BaseScan token balance API
- **Transactions**: BaseScan transaction list API
- **Token Transfers**: BaseScan token transfer API

## UI Components

- **Track.js**: Main tracking interface
- **WalletDetails.js**: Modal showing wallet information
- **Responsive Design**: Works on mobile and desktop

## Future Enhancements

- Add more token types
- Real-time balance updates
- Transaction notifications
- Portfolio value tracking
- Export functionality
