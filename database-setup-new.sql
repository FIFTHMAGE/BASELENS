-- Additional Database setup for Base MiniApp new components
-- Run these commands in your Supabase SQL editor

-- Create users table for wallet authentication
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create tracked_wallets table for wallet monitoring
CREATE TABLE IF NOT EXISTS tracked_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tracked_wallet text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_wallets ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = wallet_address);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = wallet_address);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = wallet_address);

-- Create policies for tracked_wallets table
CREATE POLICY "Users can view their tracked wallets" ON tracked_wallets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = tracked_wallets.user_id 
      AND users.wallet_address = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert tracked wallets" ON tracked_wallets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = tracked_wallets.user_id 
      AND users.wallet_address = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete their tracked wallets" ON tracked_wallets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = tracked_wallets.user_id 
      AND users.wallet_address = auth.uid()::text
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_tracked_wallets_user_id ON tracked_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_wallets_wallet ON tracked_wallets(tracked_wallet);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
