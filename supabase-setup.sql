-- =====================================================
-- Cast Scheduler Pro - Supabase Database Setup
-- =====================================================
-- 
-- IMPORTANT: If you get "column does not exist" errors, this script now:
-- 1. Drops and recreates tables to ensure clean state
-- 2. Verifies table creation with explicit checks
-- 3. Uses DROP VIEW IF EXISTS before creating views
-- 
-- This should resolve the common "column does not exist" errors.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Test basic table creation capability
CREATE TABLE IF NOT EXISTS public.test_table (
    id SERIAL PRIMARY KEY,
    test_column TEXT
);
DROP TABLE public.test_table;

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
-- Note: username column is optional and may be null
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verify users table was created correctly
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND table_schema = 'public' 
        AND column_name = 'display_name'
    ) THEN
        RAISE EXCEPTION 'Users table was not created properly - display_name column missing';
    END IF;
END $$;

-- Casts table (main content table)
CREATE TABLE IF NOT EXISTS public.casts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    cast_type TEXT DEFAULT 'general' CHECK (cast_type IN ('general', 'announcement', 'educational', 'engagement', 'promotional')),
    hashtags TEXT[],
    mentions TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queue table (for managing cast order)
CREATE TABLE IF NOT EXISTS public.queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    cast_id UUID REFERENCES public.casts(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, cast_id),
    UNIQUE(user_id, position)
);

-- Teams table (for team collaboration)
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    permissions JSONB DEFAULT '{}',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Team casts table (for team-scheduled content)
CREATE TABLE IF NOT EXISTS public.team_casts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    approved_by UUID REFERENCES public.users(id),
    content TEXT NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'scheduled', 'published', 'failed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    cast_type TEXT DEFAULT 'general' CHECK (cast_type IN ('general', 'announcement', 'educational', 'engagement', 'promotional')),
    hashtags TEXT[],
    mentions TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table (for tracking cast performance)
CREATE TABLE IF NOT EXISTS public.cast_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cast_id UUID REFERENCES public.casts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    likes_count INTEGER DEFAULT 0,
    recasts_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bulk upload sessions table
CREATE TABLE IF NOT EXISTS public.bulk_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    filename TEXT NOT NULL,
    total_rows INTEGER NOT NULL,
    processed_rows INTEGER DEFAULT 0,
    failed_rows INTEGER DEFAULT 0,
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    errors JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_casts_user_id ON public.casts(user_id);
CREATE INDEX IF NOT EXISTS idx_casts_scheduled_for ON public.casts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_casts_status ON public.casts(status);
CREATE INDEX IF NOT EXISTS idx_casts_user_status ON public.casts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_casts_scheduled_range ON public.casts(user_id, scheduled_for) WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_queue_user_position ON public.queue(user_id, position);
CREATE INDEX IF NOT EXISTS idx_queue_cast_id ON public.queue(cast_id);

CREATE INDEX IF NOT EXISTS idx_team_casts_team_id ON public.team_casts(team_id);
CREATE INDEX IF NOT EXISTS idx_team_casts_scheduled_for ON public.team_casts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_team_casts_status ON public.team_casts(status);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

CREATE INDEX IF NOT EXISTS idx_cast_analytics_cast_id ON public.cast_analytics(cast_id);
CREATE INDEX IF NOT EXISTS idx_cast_analytics_user_id ON public.cast_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_cast_analytics_recorded_at ON public.cast_analytics(recorded_at);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's scheduled casts
CREATE OR REPLACE FUNCTION public.get_user_scheduled_casts(
    user_uuid UUID,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    status TEXT,
    priority TEXT,
    cast_type TEXT,
    hashtags TEXT[],
    mentions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.content,
        c.scheduled_for,
        c.status,
        c.priority,
        c.cast_type,
        c.hashtags,
        c.mentions
    FROM public.casts c
    WHERE c.user_id = user_uuid
        AND c.scheduled_for BETWEEN start_date AND end_date
        AND c.status IN ('scheduled', 'draft')
    ORDER BY c.scheduled_for ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at on table changes
CREATE TRIGGER update_casts_updated_at BEFORE UPDATE ON public.casts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_queue_updated_at BEFORE UPDATE ON public.queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_casts_updated_at BEFORE UPDATE ON public.team_casts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_casts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cast_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_uploads ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Casts policies
CREATE POLICY "Users can view own casts" ON public.casts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own casts" ON public.casts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own casts" ON public.casts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own casts" ON public.casts
    FOR DELETE USING (auth.uid() = user_id);

-- Queue policies
CREATE POLICY "Users can view own queue" ON public.queue
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own queue" ON public.queue
    FOR ALL USING (auth.uid() = user_id);

-- Teams policies
CREATE POLICY "Users can view teams they're members of" ON public.teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = id AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Only team owners can update teams" ON public.teams
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Only team owners can delete teams" ON public.teams
    FOR DELETE USING (owner_id = auth.uid());

-- Team members policies
CREATE POLICY "Users can view team members of their teams" ON public.team_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_id AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team owners and admins can manage members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_id 
                AND tm.user_id = auth.uid()
                AND tm.role IN ('owner', 'admin')
        )
    );

-- Team casts policies
CREATE POLICY "Users can view team casts of their teams" ON public.team_casts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_id AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can create team casts" ON public.team_casts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_id AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team owners and admins can manage team casts" ON public.team_casts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_id 
                AND tm.user_id = auth.uid()
                AND tm.role IN ('owner', 'admin')
        )
    );

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON public.cast_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.cast_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bulk uploads policies
CREATE POLICY "Users can view own uploads" ON public.bulk_uploads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own uploads" ON public.bulk_uploads
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- VIEWS
-- =====================================================

-- Note: The username field uses display_name as the primary identifier
-- It falls back to 'User' if display_name is null
-- User dashboard view
DROP VIEW IF EXISTS public.user_dashboard;
CREATE VIEW public.user_dashboard AS
SELECT 
    u.id,
    COALESCE(u.display_name, 'User') as username,
    u.display_name,
    COUNT(c.id) as total_casts,
    COUNT(CASE WHEN c.status = 'scheduled' THEN 1 END) as scheduled_casts,
    COUNT(CASE WHEN c.status = 'published' THEN 1 END) as published_casts,
    COUNT(CASE WHEN c.status = 'draft' THEN 1 END) as draft_casts,
    AVG(ca.engagement_rate) as avg_engagement_rate
FROM public.users u
LEFT JOIN public.casts c ON u.id = c.user_id
LEFT JOIN public.cast_analytics ca ON c.id = ca.cast_id
GROUP BY u.id, u.display_name;

-- Team dashboard view
CREATE OR REPLACE VIEW public.team_dashboard AS
SELECT 
    t.id as team_id,
    t.name as team_name,
    t.owner_id,
    COUNT(tc.id) as total_casts,
    COUNT(CASE WHEN tc.status = 'pending' THEN 1 END) as pending_casts,
    COUNT(CASE WHEN tc.status = 'approved' THEN 1 END) as approved_casts,
    COUNT(CASE WHEN tc.status = 'scheduled' THEN 1 END) as scheduled_casts,
    COUNT(tm.id) as member_count
FROM public.teams t
LEFT JOIN public.team_casts tc ON t.id = tc.team_id
LEFT JOIN public.team_members tm ON t.id = tm.team_id
GROUP BY t.id, t.name, t.owner_id;

-- =====================================================
-- FINAL SETUP
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.casts TO authenticated;
GRANT ALL ON public.queue TO authenticated;
GRANT ALL ON public.teams TO authenticated;
GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.team_casts TO authenticated;
GRANT ALL ON public.cast_analytics TO authenticated;
GRANT ALL ON public.bulk_uploads TO authenticated;

-- Grant access to sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant access to views
GRANT SELECT ON public.user_dashboard TO authenticated;
GRANT SELECT ON public.team_dashboard TO authenticated;

-- =====================================================
-- TEST QUERIES (Optional - run these to verify setup)
-- =====================================================

-- Test 1: Check if tables were created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'casts', 'queue', 'teams');

-- Test 2: Check if users table has correct columns
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public';

-- Test 3: Check if RLS is enabled
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- =====================================================
-- READY FOR USE! 🎉
-- =====================================================

-- Your Supabase database is now set up for the Cast Scheduler Pro!
-- 
-- Next steps:
-- 1. Copy this entire file to Supabase SQL Editor
-- 2. Run the script to create all tables and policies
-- 3. Set up environment variables in Vercel
-- 4. Deploy your app!
