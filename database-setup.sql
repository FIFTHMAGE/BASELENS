-- Database setup for Base MiniApp
-- Run these commands in your Supabase SQL editor

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  address text NOT NULL UNIQUE,
  basename text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create portfolio_history table
CREATE TABLE IF NOT EXISTS portfolio_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE,
  token_symbol text NOT NULL,
  balance numeric NOT NULL,
  recorded_at timestamp DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
CREATE INDEX IF NOT EXISTS idx_portfolio_history_wallet_id ON portfolio_history(wallet_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_history_recorded_at ON portfolio_history(recorded_at);

-- Enable Row Level Security (RLS)
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_history ENABLE ROW LEVEL SECURITY;

-- Create policies for wallets table
CREATE POLICY "Users can view their own wallets" ON wallets
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own wallets" ON wallets
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own wallets" ON wallets
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own wallets" ON wallets
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for portfolio_history table
CREATE POLICY "Users can view portfolio history for their wallets" ON portfolio_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.id = portfolio_history.wallet_id 
      AND wallets.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert portfolio history for their wallets" ON portfolio_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.id = portfolio_history.wallet_id 
      AND wallets.user_id = auth.uid()::text
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for wallets table
CREATE TRIGGER update_wallets_updated_at 
  BEFORE UPDATE ON wallets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
