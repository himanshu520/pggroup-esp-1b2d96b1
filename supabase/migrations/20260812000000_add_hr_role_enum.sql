-- Add 'hr' to the app_role enum (must be committed before being referenced)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr';
