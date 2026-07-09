
-- ================== ENUMS ==================
CREATE TYPE public.app_role AS ENUM (
  'super_admin','corporate_admin','location_admin','plant_admin',
  'department_admin','pe_user','dept_user','mgmt_viewer','employee'
);

CREATE TYPE public.suggestion_status AS ENUM (
  'submitted','pe_review','transferred','dept_review','approved',
  'evaluation','implementation','evidence_pending','evidence_submitted',
  'pe_verification','implemented','rejected','fake_closure','reopened','closed'
);

CREATE TYPE public.priority_level AS ENUM ('low','medium','high','critical');

-- ================== HIERARCHY ==================
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE RESTRICT,
  code text NOT NULL,
  name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(location_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plants TO authenticated;
GRANT ALL ON public.plants TO service_role;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid NOT NULL REFERENCES public.plants(id) ON DELETE RESTRICT,
  code text NOT NULL,
  name text NOT NULL,
  is_pe boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(plant_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_code text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  mobile text,
  designation text,
  department_id uuid REFERENCES public.departments(id),
  plant_id uuid REFERENCES public.plants(id),
  location_id uuid REFERENCES public.locations(id),
  reporting_manager text,
  date_of_joining date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- ================== ROLES ==================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
  plant_id uuid REFERENCES public.plants(id) ON DELETE CASCADE,
  department_id uuid REFERENCES public.departments(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, location_id, plant_id, department_id)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ================== HELPERS (security definer) ==================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin');
$$;

-- Whether user has any role granting access to a suggestion's location/plant/department scope
CREATE OR REPLACE FUNCTION public.can_access_scope(
  _user_id uuid, _location_id uuid, _plant_id uuid, _department_id uuid
) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND (
        ur.role IN ('super_admin','corporate_admin','mgmt_viewer')
        OR (ur.role = 'location_admin' AND ur.location_id = _location_id)
        OR (ur.role = 'plant_admin' AND ur.plant_id = _plant_id)
        OR (ur.role IN ('department_admin','dept_user') AND ur.department_id = _department_id)
        OR (ur.role = 'pe_user')  -- PE sees all suggestions cross-department
      )
  );
$$;

-- ================== CATEGORIES ==================
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- ================== SUGGESTIONS ==================
CREATE TABLE public.suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  employee_id uuid NOT NULL REFERENCES public.employees(id),
  title text NOT NULL,
  category_id uuid REFERENCES public.categories(id),
  problem text,
  current_method text,
  suggested_method text,
  expected_benefits text,
  expected_saving numeric(14,2),
  implementation_cost numeric(14,2),
  priority public.priority_level NOT NULL DEFAULT 'medium',
  location_id uuid NOT NULL REFERENCES public.locations(id),
  plant_id uuid NOT NULL REFERENCES public.plants(id),
  department_id uuid NOT NULL REFERENCES public.departments(id),
  current_department_id uuid REFERENCES public.departments(id),
  status public.suggestion_status NOT NULL DEFAULT 'submitted',
  actual_cost numeric(14,2),
  actual_benefits text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.suggestions (status);
CREATE INDEX ON public.suggestions (location_id, plant_id, department_id);
CREATE INDEX ON public.suggestions (current_department_id);
CREATE INDEX ON public.suggestions (employee_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestions TO authenticated;
GRANT ALL ON public.suggestions TO service_role;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Suggestion code generation: SUG-{PLANTCODE}-{YYYY}-{seq6}
CREATE SEQUENCE IF NOT EXISTS public.suggestion_seq;

CREATE OR REPLACE FUNCTION public.generate_suggestion_code()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE plant_code text; yr text; seq bigint;
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    SELECT p.code INTO plant_code FROM public.plants p WHERE p.id = NEW.plant_id;
    yr := to_char(now(),'YYYY');
    seq := nextval('public.suggestion_seq');
    NEW.code := 'SUG-' || COALESCE(plant_code,'XXX') || '-' || yr || '-' || lpad(seq::text,6,'0');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_suggestion_code
BEFORE INSERT ON public.suggestions
FOR EACH ROW EXECUTE FUNCTION public.generate_suggestion_code();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_suggestions_updated_at
BEFORE UPDATE ON public.suggestions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ================== HISTORY / ATTACHMENTS / EVIDENCE / AUDIT / NOTIFICATIONS ==================
CREATE TABLE public.suggestion_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  from_status public.suggestion_status,
  to_status public.suggestion_status NOT NULL,
  from_department_id uuid REFERENCES public.departments(id),
  to_department_id uuid REFERENCES public.departments(id),
  actor_id uuid REFERENCES auth.users(id),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.suggestion_history (suggestion_id);
GRANT SELECT, INSERT ON public.suggestion_history TO authenticated;
GRANT ALL ON public.suggestion_history TO service_role;
ALTER TABLE public.suggestion_history ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  content_type text,
  kind text NOT NULL DEFAULT 'attachment', -- attachment | before | after | doc
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.attachments (suggestion_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attachments TO authenticated;
GRANT ALL ON public.attachments TO service_role;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  remarks text,
  completion_date date,
  actual_cost numeric(14,2),
  benefits_achieved text,
  submitted_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.evidence (suggestion_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evidence TO authenticated;
GRANT ALL ON public.evidence TO service_role;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.audit_logs (created_at DESC);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.notifications (user_id, read);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ================== RLS POLICIES ==================
-- Hierarchy: any authenticated user can read; only super/corp/location admins can write
CREATE POLICY loc_read ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY loc_write ON public.locations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'));

CREATE POLICY plant_read ON public.plants FOR SELECT TO authenticated USING (true);
CREATE POLICY plant_write ON public.plants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'));

CREATE POLICY dept_read ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY dept_write ON public.departments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'));

CREATE POLICY cat_read ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY cat_write ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'));

-- Employees: read own, or admins scoped to their location/plant/department
CREATE POLICY emp_read_self ON public.employees FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.can_access_scope(auth.uid(), location_id, plant_id, department_id));
CREATE POLICY emp_admin_write ON public.employees FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'corporate_admin'));

-- user_roles: users see own; super_admin/corporate_admin manage
CREATE POLICY roles_read_self ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(),'corporate_admin'));

-- Suggestions
CREATE POLICY sug_read ON public.suggestions FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.employees e WHERE e.id = suggestions.employee_id AND e.user_id = auth.uid())
    OR public.can_access_scope(auth.uid(), location_id, plant_id, department_id)
    OR public.can_access_scope(auth.uid(), location_id, plant_id, current_department_id)
  );
CREATE POLICY sug_insert ON public.suggestions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.user_id = auth.uid()));
CREATE POLICY sug_update ON public.suggestions FOR UPDATE TO authenticated
  USING (
    public.can_access_scope(auth.uid(), location_id, plant_id, department_id)
    OR public.can_access_scope(auth.uid(), location_id, plant_id, current_department_id)
    OR public.has_role(auth.uid(),'pe_user')
    OR public.is_super_admin(auth.uid())
  );

-- History mirrors suggestion visibility
CREATE POLICY hist_read ON public.suggestion_history FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.suggestions s WHERE s.id = suggestion_id));
CREATE POLICY hist_insert ON public.suggestion_history FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- Attachments
CREATE POLICY att_read ON public.attachments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.suggestions s WHERE s.id = suggestion_id));
CREATE POLICY att_write ON public.attachments FOR ALL TO authenticated
  USING (uploaded_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.suggestions s WHERE s.id = suggestion_id
              AND public.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)))
  WITH CHECK (uploaded_by = auth.uid());

-- Evidence
CREATE POLICY ev_read ON public.evidence FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.suggestions s WHERE s.id = suggestion_id));
CREATE POLICY ev_write ON public.evidence FOR ALL TO authenticated
  USING (submitted_by = auth.uid())
  WITH CHECK (submitted_by = auth.uid());

-- Audit logs: readable by super_admin/corporate_admin; all authenticated may insert their own
CREATE POLICY audit_read ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(),'corporate_admin'));
CREATE POLICY audit_insert ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- Notifications: user sees and updates own
CREATE POLICY notif_own ON public.notifications FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
