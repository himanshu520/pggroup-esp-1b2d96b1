-- Add category column to best_suggestions table for Month, Year, and Foolproofing recognition categories
ALTER TABLE public.best_suggestions
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'month';

-- Create index for fast category lookup
CREATE INDEX IF NOT EXISTS idx_best_suggestions_category ON public.best_suggestions (category, year, month);
