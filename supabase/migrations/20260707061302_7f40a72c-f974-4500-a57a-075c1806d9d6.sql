-- Add gender to employees (Male/Female/Other/Prefer not to say kept as free text with CHECK for consistency)
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS gender text
  CHECK (gender IS NULL OR gender IN ('male','female','other','prefer_not_to_say'));