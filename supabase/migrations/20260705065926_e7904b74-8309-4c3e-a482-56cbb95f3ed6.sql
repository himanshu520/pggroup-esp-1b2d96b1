ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
WITH ranked AS (SELECT id, ROW_NUMBER() OVER (ORDER BY name) * 10 AS rn FROM public.categories)
UPDATE public.categories c SET sort_order = ranked.rn FROM ranked WHERE c.id = ranked.id AND c.sort_order = 0;
CREATE INDEX IF NOT EXISTS categories_sort_order_idx ON public.categories(sort_order);