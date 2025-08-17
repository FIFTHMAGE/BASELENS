-- Extended Database setup for Base MiniApp Backend API
-- Run these commands in your Supabase SQL editor after the basic setup

-- Create onramp_sessions table
CREATE TABLE IF NOT EXISTS onramp_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  fiat_currency text NOT NULL,
  crypto_currency text NOT NULL,
  amount numeric,
  session_id text UNIQUE NOT NULL,
  status text DEFAULT 'pending',
  transaction_hash text,
  created_at timestamp DEFAULT now(),
  completed_at timestamp,
  updated_at timestamp DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  type text NOT NULL, -- 'onramp', 'swap', 'transfer'
  amount numeric,
  token text,
  transaction_hash text UNIQUE,
  status text DEFAULT 'pending',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create swap_quotes table
CREATE TABLE IF NOT EXISTS swap_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  from_token text NOT NULL,
  to_token text NOT NULL,
  amount numeric NOT NULL,
  quote_data jsonb,
  created_at timestamp DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_onramp_sessions_wallet ON onramp_sessions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_onramp_sessions_status ON onramp_sessions(status);
CREATE INDEX IF NOT EXISTS idx_onramp_sessions_session_id ON onramp_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_swap_quotes_wallet ON swap_quotes(wallet_address);
CREATE INDEX IF NOT EXISTS idx_swap_quotes_created ON swap_quotes(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE onramp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for onramp_sessions table
CREATE POLICY "Users can view their own onramp sessions" ON onramp_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.address = onramp_sessions.wallet_address 
      AND wallets.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert their own onramp sessions" ON onramp_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.address = onramp_sessions.wallet_address 
      AND wallets.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update their own onramp sessions" ON onramp_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.address = onramp_sessions.wallet_address 
      AND wallets.user_id = auth.uid()::text
    )
  );

-- Create policies for transactions table
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.address = transactions.wallet_address 
      AND wallets.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.address = transactions.wallet_address 
      AND wallets.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.address = transactions.wallet_address 
      AND wallets.user_id = auth.uid()::text
    )
  );

-- Create policies for swap_quotes table
CREATE POLICY "Users can view their own swap quotes" ON swap_quotes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.address = swap_quotes.wallet_address 
      AND wallets.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert their own swap quotes" ON swap_quotes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.address = swap_quotes.wallet_address 
      AND wallets.user_id = auth.uid()::text
    )
  );

-- Create function to update updated_at timestamp for new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for new tables
CREATE TRIGGER update_onramp_sessions_updated_at 
  BEFORE UPDATE ON onramp_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
  BEFORE UPDATE ON transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for wallet summary
CREATE OR REPLACE VIEW wallet_summary AS
SELECT 
  w.id,
  w.user_id,
  w.address,
  w.basename,
  w.created_at,
  COUNT(DISTINCT t.id) as transaction_count,
  COUNT(DISTINCT os.id) as onramp_count,
  COUNT(DISTINCT sq.id) as swap_quote_count
FROM wallets w
LEFT JOIN transactions t ON w.address = t.wallet_address
LEFT JOIN onramp_sessions os ON w.address = os.wallet_address
LEFT JOIN swap_quotes sq ON w.address = sq.wallet_address
GROUP BY w.id, w.user_id, w.address, w.basename, w.created_at;

-- Grant permissions for the view
GRANT SELECT ON wallet_summary TO authenticated;
