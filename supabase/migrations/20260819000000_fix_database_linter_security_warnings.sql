-- Migration: Fix Supabase Database Linter Errors and Warnings
-- 1. policy_exists_rls_disabled & rls_disabled_in_public on locked_leaderboards
-- 2. rls_disabled_in_public on leaderboard_snapshots
-- 3. rls_disabled_in_public on leaderboard_settings
-- 4. security_definer_view on employee_badges
-- 5. function_search_path_mutable & anon/authenticated_security_definer_function_executable
--    on get_department_leaderboard and get_employee_leaderboard

-- ==============================================================================
-- 1. Enable Row Level Security (RLS) on tables exposed in the public schema
-- ==============================================================================
ALTER TABLE IF EXISTS public.locked_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leaderboard_settings ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. Ensure SELECT policies exist for public/authenticated read access where required
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'locked_leaderboards' 
      AND policyname = 'Allow public read access to locked_leaderboards'
  ) THEN
    CREATE POLICY "Allow public read access to locked_leaderboards" 
    ON public.locked_leaderboards 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'leaderboard_snapshots' 
      AND policyname = 'Allow public read access to leaderboard_snapshots'
  ) THEN
    CREATE POLICY "Allow public read access to leaderboard_snapshots" 
    ON public.leaderboard_snapshots 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'leaderboard_settings' 
      AND policyname = 'Allow public read access to leaderboard_settings'
  ) THEN
    CREATE POLICY "Allow public read access to leaderboard_settings" 
    ON public.leaderboard_settings 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- ==============================================================================
-- 3. Fix security_definer_view lint on views
-- ==============================================================================
-- Enforce permissions and RLS of the querying user by setting security_invoker = true
ALTER VIEW IF EXISTS public.employee_badges SET (security_invoker = true);

-- ==============================================================================
-- 4. Fix function_search_path_mutable & security_definer warnings on RPC functions
-- ==============================================================================
-- Set search_path = public to prevent mutable search path privilege escalation
-- Switch from SECURITY DEFINER to SECURITY INVOKER to prevent unprivileged privilege escalation
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT p.oid::regprocedure AS func_signature
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN ('get_department_leaderboard', 'get_employee_leaderboard')
  ) LOOP
    EXECUTE format('ALTER FUNCTION %s SECURITY INVOKER SET search_path = public;', r.func_signature);
  END LOOP;
END $$;
