-- Fix database structure - Create tracked_wallets table
-- Run this in your Supabase SQL editor

-- 1. First, let's check what tables exist
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename IN ('users', 'tracked_wallets');

-- 2. Create the tracked_wallets table (this will work even if it doesn't exist)
CREATE TABLE IF NOT EXISTS tracked_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tracked_wallet text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE tracked_wallets ENABLE ROW LEVEL SECURITY;

-- 4. Create simple policy for development
DROP POLICY IF EXISTS "Allow all operations on tracked_wallets" ON tracked_wallets;
CREATE POLICY "Allow all operations on tracked_wallets" ON tracked_wallets
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_tracked_wallets_user_id ON tracked_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_wallets_wallet ON tracked_wallets(tracked_wallet);

-- 6. Verify the table was created
SELECT * FROM tracked_wallets LIMIT 1;
