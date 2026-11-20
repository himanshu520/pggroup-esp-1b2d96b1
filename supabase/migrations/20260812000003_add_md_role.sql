-- Add 'md' to the app_role enum in standalone transaction
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'md';
