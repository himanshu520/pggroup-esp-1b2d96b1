-- Make employee email optional (allow NULL values)
ALTER TABLE public.employees ALTER COLUMN email DROP NOT NULL;
