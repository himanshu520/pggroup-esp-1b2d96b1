-- Drop the old unique constraint which restricted us to only ONE best suggestion per month/year
ALTER TABLE public.best_suggestions DROP CONSTRAINT IF EXISTS unique_best_suggestion_month_year;

-- Add a new unique constraint that includes category, allowing one best suggestion per category per month/year
ALTER TABLE public.best_suggestions ADD CONSTRAINT unique_best_suggestion_category_month_year UNIQUE (category, month, year);
