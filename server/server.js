const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Custom environment loader
function loadEnvironmentVariables() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    console.log('🔍 Loading environment from:', envPath);
    
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env file not found at:', envPath);
      return false;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    let loadedCount = 0;
    envLines.forEach((line, index) => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const equalIndex = line.indexOf('=');
        if (equalIndex > 0) {
          const key = line.substring(0, equalIndex).trim();
          const value = line.substring(equalIndex + 1).trim();
          
          // Remove quotes if present
          const cleanValue = value.replace(/^["']|["']$/g, '');
          
          process.env[key] = cleanValue;
          console.log(`✅ Loaded: ${key} = ${cleanValue.substring(0, 20)}${cleanValue.length > 20 ? '...' : ''}`);
          loadedCount++;
        }
      }
    });
    
    console.log(`🎯 Successfully loaded ${loadedCount} environment variables`);
    return true;
  } catch (error) {
    console.error('❌ Failed to load environment variables:', error.message);
    return false;
  }
}

// Load environment variables
const envLoaded = loadEnvironmentVariables();

// Debug environment variables
console.log('\n🔍 Environment Variables Check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Loaded' : '❌ Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing');
console.log('FONBNK_API_KEY:', process.env.FONBNK_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('PORT:', process.env.PORT || '5000 (default)');
console.log('WEBHOOK_SECRET:', process.env.WEBHOOK_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client with fallback
let supabase;
try {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
  console.log('⚠️  Server will run without Supabase functionality');
  supabase = null;
}

// Fonbnk API configuration
const FONBNK_BASE_URL = 'https://api.fonbnk.io';
const FONBNK_API_KEY = process.env.FONBNK_API_KEY || process.env.REACT_APP_FONBNK_KEY;

// Verify webhook signature
function verifyWebhookSignature(signature, body, secret) {
  if (!signature || !secret) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Enhanced Fonbnk Onramp API
app.post('/api/fonbnk/onramp', async (req, res) => {
  try {
    const { 
      phoneNumber, 
      walletAddress, 
      amount, 
      fiatCurrency = 'NGN', 
      cryptoCurrency = 'USDC',
      network = 'BASE',
      redirectUrl,
      metadata = {}
    } = req.body;

    // Validate required fields
    if (!phoneNumber || !walletAddress || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: phoneNumber, walletAddress, and amount are required' 
      });
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ 
        error: 'Invalid wallet address format' 
      });
    }

    // Validate amount
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount. Must be a positive number' 
      });
    }

    console.log('🚀 Initiating Fonbnk onramp:', {
      phoneNumber,
      walletAddress: walletAddress.slice(0, 10) + '...',
      amount,
      fiatCurrency,
      cryptoCurrency,
      network
    });

    // Call Fonbnk API to initiate onramp
    const fonbnkResponse = await axios.post(`${FONBNK_BASE_URL}/transactions/initiate`, {
      phoneNumber,
      walletAddress,
      amount: parseFloat(amount),
      fiatCurrency,
      cryptoCurrency,
      network,
      redirectUrl,
      metadata: {
        ...metadata,
        source: 'your-app-name',
        timestamp: new Date().toISOString()
      }
    }, {
      headers: {
        'Authorization': `Bearer ${FONBNK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    const onrampData = fonbnkResponse.data;
    
    console.log('✅ Fonbnk onramp initiated successfully:', {
      sessionId: onrampData.sessionId || onrampData.id,
      status: onrampData.status
    });

    // Store the onramp session in Supabase
    if (supabase) {
      const { error: supabaseError } = await supabase
        .from('onramp_sessions')
        .insert([{
          session_id: onrampData.sessionId || onrampData.id,
          wallet_address: walletAddress,
          phone_number: phoneNumber,
          fiat_currency: fiatCurrency,
          crypto_currency: cryptoCurrency,
          amount: parseFloat(amount),
          network,
          status: 'initiated',
          fonbnk_data: onrampData,
          created_at: new Date().toISOString()
        }]);

      if (supabaseError) {
        console.error('Supabase error storing session:', supabaseError);
        // Don't fail the request if Supabase fails
      }
    }

    // Return success response
    res.json({
      success: true,
      sessionId: onrampData.sessionId || onrampData.id,
      status: onrampData.status,
      checkoutUrl: onrampData.checkoutUrl || onrampData.redirectUrl,
      message: 'Onramp session created successfully'
    });

  } catch (error) {
    console.error('❌ Fonbnk onramp error:', error);
    
    // Handle specific Fonbnk API errors
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        return res.status(401).json({ 
          error: 'Authentication failed. Please check your Fonbnk API key.' 
        });
      }
      
      if (status === 403) {
        return res.status(403).json({ 
          error: 'Access denied. Your API key does not have sufficient permissions.' 
        });
      }
      
      if (status === 422) {
        return res.status(422).json({ 
          error: 'Validation error', 
          details: data.message || 'Invalid request parameters' 
        });
      }
      
      if (status >= 500) {
        return res.status(503).json({ 
          error: 'Fonbnk service is currently experiencing issues. Please try again later.' 
        });
      }
      
      return res.status(status).json({ 
        error: 'Fonbnk API error', 
        details: data.message || 'Unknown error occurred' 
      });
    }
    
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ 
        error: 'Request timed out. Fonbnk service is taking too long to respond.' 
      });
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Unable to connect to Fonbnk service. Please check your internet connection.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Get onramp session status
app.get('/api/fonbnk/onramp/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Get session from Supabase
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase client not initialized' });
    }

    const { data: session, error: supabaseError } = await supabase
      .from('onramp_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (supabaseError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Optionally refresh status from Fonbnk API
    try {
      const fonbnkResponse = await axios.get(`${FONBNK_BASE_URL}/transactions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${FONBNK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const updatedStatus = fonbnkResponse.data;
      
      // Update local status if it changed
      if (updatedStatus.status !== session.status) {
        if (supabase) {
          const { error: updateError } = await supabase
            .from('onramp_sessions')
            .update({ 
              status: updatedStatus.status,
              updated_at: new Date().toISOString(),
              fonbnk_data: updatedStatus
            })
            .eq('session_id', sessionId);

          if (updateError) {
            console.error('Error updating session status:', updateError);
          }
          
          session.status = updatedStatus.status;
          session.fonbnk_data = updatedStatus;
        }
      }
    } catch (fonbnkError) {
      console.error('Error fetching status from Fonbnk:', fonbnkError);
      // Continue with local status if Fonbnk is unavailable
    }

    res.json({
      success: true,
      session: {
        id: session.session_id,
        status: session.status,
        walletAddress: session.wallet_address,
        amount: session.amount,
        fiatCurrency: session.fiat_currency,
        cryptoCurrency: session.crypto_currency,
        network: session.network,
        createdAt: session.created_at,
        updatedAt: session.updated_at
      }
    });

  } catch (error) {
    console.error('Error fetching session status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch session status',
      details: error.message 
    });
  }
});

// Enhanced Fonbnk Webhook Handler
app.post('/api/fonbnk/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-fonbnk-signature'] || req.headers['x-webhook-signature'];
    const webhookSecret = process.env.WEBHOOK_SECRET;
    
    // Verify webhook signature if secret is configured
    if (webhookSecret && !verifyWebhookSignature(signature, req.body, webhookSecret)) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { 
      session_id, 
      status, 
      wallet_address, 
      amount, 
      transaction_hash,
      fiat_amount,
      crypto_amount,
      network,
      metadata = {}
    } = req.body;

    console.log('📥 Received Fonbnk webhook:', {
      sessionId: session_id,
      status,
      walletAddress: wallet_address?.slice(0, 10) + '...',
      amount
    });

    if (!session_id || !status) {
      return res.status(400).json({ error: 'Missing required webhook fields' });
    }

    // Update onramp session status
    if (supabase) {
      const { error: sessionError } = await supabase
        .from('onramp_sessions')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          transaction_hash,
          fiat_amount,
          crypto_amount,
          webhook_data: req.body
        })
        .eq('session_id', session_id);

      if (sessionError) {
        console.error('Error updating session:', sessionError);
      }
    }

    // Handle completed transactions
    if (status === 'completed' && transaction_hash) {
      // Store the successful transaction
      if (supabase) {
        const { error: txError } = await supabase
          .from('transactions')
          .insert([{
            wallet_address,
            type: 'onramp',
            amount: crypto_amount || amount,
            fiat_amount,
            token: 'USDC',
            network: network || 'BASE',
            transaction_hash,
            status: 'completed',
            session_id,
            metadata
          }]);

        if (txError) {
          console.error('Error storing transaction:', txError);
        }

        console.log('✅ Transaction completed and stored:', transaction_hash);
      }
    }

    // Handle failed transactions
    if (status === 'failed') {
      console.log('❌ Transaction failed for session:', session_id);
      
      // You might want to notify the user or take other actions
      // For example, send an email, update UI, etc.
    }

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      details: error.message 
    });
  }
});

// Get user's onramp history
app.get('/api/fonbnk/history/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Get onramp history from Supabase
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase client not initialized' });
    }

    const { data: sessions, error } = await supabase
      .from('onramp_sessions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching onramp history:', error);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }

    res.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session.session_id,
        status: session.status,
        amount: session.amount,
        fiatCurrency: session.fiat_currency,
        cryptoCurrency: session.crypto_currency,
        network: session.network,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        transactionHash: session.transaction_hash
      }))
    });

  } catch (error) {
    console.error('Error fetching onramp history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch onramp history',
      details: error.message 
    });
  }
});

// Track Wallet API
app.post('/api/wallets/track', async (req, res) => {
  try {
    const { wallet_address, basename, user_id } = req.body;

    if (!wallet_address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Check if wallet already exists
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase client not initialized' });
    }

    const { data: existingWallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('address', wallet_address)
      .single();

    if (existingWallet) {
      return res.status(400).json({ error: 'Wallet already tracked' });
    }

    // Insert new wallet
    const { data, error } = await supabase
      .from('wallets')
      .insert([{
        user_id: user_id || 'anonymous',
        address: wallet_address,
        basename: basename || `Wallet_${wallet_address.slice(0, 8)}`
      }]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to track wallet' });
    }

    res.json({ success: true, data });

  } catch (error) {
    console.error('Track wallet error:', error);
    res.status(500).json({ error: 'Failed to track wallet' });
  }
});

// Get Wallet Tokens (BaseScan API)
app.get('/api/wallets/:address/tokens', async (req, res) => {
  try {
    const { address } = req.params;

    // Use BaseScan API to get token balances
    const baseScanRes = await axios.get(
      `https://api.basescan.org/api?module=account&action=tokenbalance&address=${address}&apikey=${process.env.BASESCAN_API_KEY}`
    );

    const data = baseScanRes.data;
    
    if (data.status === '1') {
      // Store the balance snapshot in Supabase
      if (supabase) {
        const { error: supabaseError } = await supabase
          .from('portfolio_history')
          .insert([{
            wallet_id: address, // Using address as wallet_id for now
            token_symbol: 'USDC', // You might want to get this from the API
            balance: data.result,
            recorded_at: new Date().toISOString()
          }]);

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
        }
      }
    }

    res.json(data);

  } catch (error) {
    console.error('Get wallet tokens error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet tokens' });
  }
});

// Get Wallet Portfolio (Covalent API)
app.get('/api/wallets/:address/portfolio', async (req, res) => {
  try {
    const { address } = req.params;

    // Use Covalent API to get comprehensive portfolio data
    const covalentRes = await axios.get(
      `https://api.covalenthq.com/v1/8453/address/${address}/balances_v2/?key=${process.env.COVALENT_API_KEY || process.env.REACT_APP_COVALENT_KEY}`
    );

    const data = covalentRes.data;
    
    // Store portfolio snapshot in Supabase
    if (data.data && data.data.items) {
      if (supabase) {
        for (const item of data.data.items) {
          const { error: supabaseError } = await supabase
            .from('portfolio_history')
            .insert([{
              wallet_id: address,
              token_symbol: item.contract_ticker_symbol,
              balance: item.balance,
              recorded_at: new Date().toISOString()
            }]);

          if (supabaseError) {
            console.error('Supabase error:', supabaseError);
          }
        }
      }
    }

    res.json(data);

  } catch (error) {
    console.error('Get wallet portfolio error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet portfolio' });
  }
});

// Token Swap API (1inch)
app.post('/api/swap', async (req, res) => {
  try {
    const { fromToken, toToken, amount, walletAddress, slippage = 1 } = req.body;

    if (!fromToken || !toToken || !amount || !walletAddress) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get swap quote from 1inch
    const quoteRes = await axios.get(
      `https://api.1inch.dev/swap/v6.0/8453/quote?src=${fromToken}&dst=${toToken}&amount=${amount}&from=${walletAddress}&slippage=${slippage}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.INCH_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    const quoteData = quoteRes.data;

    // Store swap quote in Supabase
    if (supabase) {
      const { error: quoteError } = await supabase
        .from('swap_quotes')
        .insert([{
          wallet_address: walletAddress,
          from_token: fromToken,
          to_token: toToken,
          amount,
          quote_data: quoteData,
          created_at: new Date().toISOString()
        }]);

      if (quoteError) {
        console.error('Supabase error:', quoteError);
      }
    }

    res.json(quoteData);

  } catch (error) {
    console.error('Swap error:', error);
    res.status(500).json({ error: 'Failed to get swap quote' });
  }
});

// Execute Swap API
app.post('/api/swap/execute', async (req, res) => {
  try {
    const { quoteId, walletAddress, privateKey } = req.body;

    if (!quoteId || !walletAddress) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Execute the swap using 1inch
    const executeRes = await axios.post(
      `https://api.1inch.dev/swap/v6.0/8453/swap`,
      {
        quoteId,
        from: walletAddress
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.INCH_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const swapData = executeRes.data;

    // Store the swap transaction in Supabase
    if (supabase) {
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{
          wallet_address: walletAddress,
          type: 'swap',
          amount: swapData.amount,
          token: swapData.toToken,
          transaction_hash: swapData.txHash,
          status: 'pending'
        }]);

      if (txError) {
        console.error('Supabase error:', txError);
      }
    }

    res.json(swapData);

  } catch (error) {
    console.error('Execute swap error:', error);
    res.status(500).json({ error: 'Failed to execute swap' });
  }
});

// Get Transaction History
app.get('/api/wallets/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Get transactions from Supabase
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase client not initialized' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_address', address)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    res.json({ transactions: data, count: data.length });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Fonbnk Integration Server',
    version: '1.0.0',
    supabase: supabase ? 'connected' : 'disconnected'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Base MiniApp API server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

module.exports = app;
