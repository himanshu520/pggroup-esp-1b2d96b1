
ALTER TABLE public.employees   ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_employees_deleted_at   ON public.employees   (deleted_at);
CREATE INDEX IF NOT EXISTS idx_departments_deleted_at ON public.departments (deleted_at);
