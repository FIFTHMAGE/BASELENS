-- Fix RLS policies to work without authentication
-- Run this in your Supabase SQL editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can view their tracked wallets" ON tracked_wallets;
DROP POLICY IF EXISTS "Users can insert tracked wallets" ON tracked_wallets;
DROP POLICY IF EXISTS "Users can delete their tracked wallets" ON tracked_wallets;

-- Create simple policies that allow all operations (for development)
-- In production, you'd want more restrictive policies

-- Users table policies
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- Tracked wallets table policies  
CREATE POLICY "Allow all operations on tracked_wallets" ON tracked_wallets
  FOR ALL USING (true) WITH CHECK (true);

-- Alternative: If you want to keep some security, you can use this approach:
-- CREATE POLICY "Allow operations by user_id" ON tracked_wallets
--   FOR ALL USING (true) WITH CHECK (true);
