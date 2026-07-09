ALTER TABLE public.locations RENAME COLUMN code TO state;
ALTER TABLE public.locations RENAME COLUMN name TO "location";
ALTER INDEX public.locations_code_key RENAME TO locations_state_key;