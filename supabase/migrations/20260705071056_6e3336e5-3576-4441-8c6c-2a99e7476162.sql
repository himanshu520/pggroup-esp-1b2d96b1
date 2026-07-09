
-- 1) EMPLOYEES: tighter read policy (no blanket pe_user access)
DROP POLICY IF EXISTS emp_read_self ON public.employees;
CREATE POLICY emp_read_self ON public.employees
FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'super_admin')
  OR public.has_role(auth.uid(), 'corporate_admin')
  OR public.has_role(auth.uid(), 'mgmt_viewer')
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND (
        (ur.role = 'location_admin' AND ur.location_id = employees.location_id)
        OR (ur.role = 'plant_admin' AND ur.plant_id = employees.plant_id)
        OR (ur.role IN ('department_admin','dept_user') AND ur.department_id = employees.department_id)
      )
  )
);

-- 2) EVIDENCE: gate reads by suggestion read authorization
DROP POLICY IF EXISTS ev_read ON public.evidence;
CREATE POLICY ev_read ON public.evidence
FOR SELECT TO authenticated
USING (
  submitted_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.suggestions s
    LEFT JOIN public.employees e ON e.id = s.employee_id
    WHERE s.id = evidence.suggestion_id
      AND (
        e.user_id = auth.uid()
        OR public.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
        OR public.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
      )
  )
);

-- 3) SUGGESTION_HISTORY: gate reads by suggestion read authorization
DROP POLICY IF EXISTS hist_read ON public.suggestion_history;
CREATE POLICY hist_read ON public.suggestion_history
FOR SELECT TO authenticated
USING (
  actor_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.suggestions s
    LEFT JOIN public.employees e ON e.id = s.employee_id
    WHERE s.id = suggestion_history.suggestion_id
      AND (
        e.user_id = auth.uid()
        OR public.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
        OR public.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
      )
  )
);

-- 4) SUGGESTIONS UPDATE: remove blanket pe_user escalation
DROP POLICY IF EXISTS sug_update ON public.suggestions;
CREATE POLICY sug_update ON public.suggestions
FOR UPDATE TO authenticated
USING (
  public.can_access_scope(auth.uid(), location_id, plant_id, department_id)
  OR public.can_access_scope(auth.uid(), location_id, plant_id, current_department_id)
  OR public.is_super_admin(auth.uid())
);

-- 5) STORAGE: only allow reading files linked to attachments on readable suggestions
DROP POLICY IF EXISTS "auth read suggestion files" ON storage.objects;
CREATE POLICY "auth read suggestion files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'suggestion-files'
  AND EXISTS (
    SELECT 1
    FROM public.attachments a
    JOIN public.suggestions s ON s.id = a.suggestion_id
    LEFT JOIN public.employees e ON e.id = s.employee_id
    WHERE a.file_path = storage.objects.name
      AND (
        a.uploaded_by = auth.uid()
        OR e.user_id = auth.uid()
        OR public.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
        OR public.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
      )
  )
);

-- 6) LOCK DOWN SECURITY DEFINER FUNCTION EXECUTE PRIVILEGES
-- Trigger-only functions: revoke from all API roles (only invoked via triggers, not via Data API)
REVOKE ALL ON FUNCTION public.generate_suggestion_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.bootstrap_admin_role() FROM PUBLIC, anon, authenticated;

-- Helper functions used inside RLS policies: revoke from anon and PUBLIC.
-- Authenticated role retains EXECUTE because policies evaluate as the calling user.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_access_scope(uuid, uuid, uuid, uuid) FROM PUBLIC, anon;
