-- Enable Row Level Security (RLS) on newly created tables to secure data
-- Supabase enforces RLS for public access, requiring this to be enabled

ALTER TABLE IF EXISTS public.best_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.locked_leaderboards ENABLE ROW LEVEL SECURITY;

-- If you have any public policies to add, you can define them here. 
-- By default, enabling RLS without policies denies all access from the anon key,
-- but the service_role key (which the server uses) bypasses RLS automatically.
