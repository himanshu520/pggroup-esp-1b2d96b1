ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.plants    ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE INDEX IF NOT EXISTS locations_deleted_at_idx ON public.locations (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS plants_deleted_at_idx    ON public.plants    (deleted_at) WHERE deleted_at IS NULL;