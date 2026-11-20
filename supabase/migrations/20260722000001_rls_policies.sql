-- Create policies to allow read access to best_suggestions and locked_leaderboards
-- Since we enabled RLS on these tables, all public (anon) reads were blocked by default.
-- We want anyone (or authenticated users) to be able to read who won best suggestion.

-- best_suggestions read policy
CREATE POLICY "Allow public read access to best_suggestions" 
ON public.best_suggestions 
FOR SELECT 
USING (true);

-- locked_leaderboards read policy
CREATE POLICY "Allow public read access to locked_leaderboards" 
ON public.locked_leaderboards 
FOR SELECT 
USING (true);
