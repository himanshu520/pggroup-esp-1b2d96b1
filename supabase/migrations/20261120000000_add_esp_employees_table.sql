-- =============================================================================
-- ESP Employees Table (Zero-Trust WhatsApp OTP Login)
-- Migration: 20261120000000_add_esp_employees_table.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.esp_employees (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT        UNIQUE NOT NULL,          -- e.g. PG-1042
  full_name   TEXT        NOT NULL,
  mobile      TEXT        NOT NULL,                 -- Format: +91XXXXXXXXXX
  role        TEXT        NOT NULL DEFAULT 'employee', -- 'employee' | 'supervisor' | 'hod' | 'admin'
  department  TEXT        NOT NULL,                 -- e.g. 'Maintenance', 'Press Shop', 'Quality', 'HR'
  status      TEXT        NOT NULL DEFAULT 'active',-- 'active' | 'inactive'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_esp_employees_emp_id ON public.esp_employees(employee_id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_esp_employees_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_esp_employees_updated_at ON public.esp_employees;
CREATE TRIGGER trg_esp_employees_updated_at
  BEFORE UPDATE ON public.esp_employees
  FOR EACH ROW EXECUTE FUNCTION public.set_esp_employees_updated_at();

-- RLS: only service role can read (we always use supabaseAdmin server-side)
ALTER TABLE public.esp_employees ENABLE ROW LEVEL SECURITY;

-- Allow service role bypass (default in Supabase); deny anon/authenticated direct access
-- (All reads go through server functions with the service role key)
DROP POLICY IF EXISTS esp_employees_no_client_access ON public.esp_employees;
CREATE POLICY esp_employees_no_client_access ON public.esp_employees
  FOR ALL TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- =============================================================================
-- Sample Test Data
-- =============================================================================
INSERT INTO public.esp_employees (employee_id, full_name, mobile, role, department, status)
VALUES
  ('PG-1001', 'Badal Sharma',  '+917988404377', 'admin',      'Management',  'active'),
  ('PG-1042', 'Amit Kumar',    '+917988404377', 'hod',        'Maintenance', 'active'),
  ('PG-2001', 'Rahul Verma',   '+917988404377', 'supervisor', 'Press Shop',  'active'),
  ('PG-3001', 'Priya Singh',   '+917988404377', 'employee',   'Quality',     'active')
ON CONFLICT (employee_id) DO UPDATE
  SET mobile = EXCLUDED.mobile,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      department = EXCLUDED.department,
      status = EXCLUDED.status,
      updated_at = now();
