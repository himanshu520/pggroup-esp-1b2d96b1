-- Ensure all missing app_role enum values exist (must be committed before being referenced)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr';
