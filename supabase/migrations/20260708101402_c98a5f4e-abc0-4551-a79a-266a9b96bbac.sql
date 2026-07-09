
-- 1) Remove hardcoded admin backdoor (trigger + function)
DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed_bootstrap ON auth.users;
DROP TRIGGER IF EXISTS bootstrap_admin_role_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.bootstrap_admin_role();

-- 2) Tighten employee PII read policy — remove dept_user (regular users) from directory-wide read.
DROP POLICY IF EXISTS emp_read_self ON public.employees;
CREATE POLICY emp_read_self ON public.employees
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR private.has_role(auth.uid(), 'super_admin'::app_role)
    OR private.has_role(auth.uid(), 'corporate_admin'::app_role)
    OR private.has_role(auth.uid(), 'mgmt_viewer'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND (
          (ur.role = 'location_admin'::app_role   AND ur.location_id   = employees.location_id)
          OR (ur.role = 'plant_admin'::app_role   AND ur.plant_id      = employees.plant_id)
          OR (ur.role = 'department_admin'::app_role AND ur.department_id = employees.department_id)
        )
    )
  );

-- 3) Tighten suggestion_history INSERT — actor must have scope access on the target suggestion.
DROP POLICY IF EXISTS hist_insert ON public.suggestion_history;
CREATE POLICY hist_insert ON public.suggestion_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    actor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.suggestions s
      LEFT JOIN public.employees e ON e.id = s.employee_id
      WHERE s.id = suggestion_history.suggestion_id
        AND (
          e.user_id = auth.uid()
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
        )
    )
  );

-- 4) Tighten evidence write — split FOR ALL into scoped INSERT/UPDATE/DELETE policies.
DROP POLICY IF EXISTS ev_write ON public.evidence;

CREATE POLICY ev_insert ON public.evidence
  FOR INSERT
  TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.suggestions s
      LEFT JOIN public.employees e ON e.id = s.employee_id
      WHERE s.id = evidence.suggestion_id
        AND (
          e.user_id = auth.uid()
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
        )
    )
  );

CREATE POLICY ev_update ON public.evidence
  FOR UPDATE
  TO authenticated
  USING (submitted_by = auth.uid())
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY ev_delete ON public.evidence
  FOR DELETE
  TO authenticated
  USING (submitted_by = auth.uid());

-- 5) Storage: require scope + allow-listed file extensions for uploads.
DROP POLICY IF EXISTS "auth upload suggestion files" ON storage.objects;
CREATE POLICY "auth upload suggestion files" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'suggestion-files'
    AND owner = auth.uid()
    AND lower(storage.extension(name)) IN (
      'pdf','doc','docx','xls','xlsx','png','jpg','jpeg','gif','webp'
    )
    AND EXISTS (
      SELECT 1 FROM public.suggestions s
      LEFT JOIN public.employees e ON e.id = s.employee_id
      WHERE s.id::text = (storage.foldername(name))[1]
        AND (
          e.user_id = auth.uid()
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
        )
    )
  );

DROP POLICY IF EXISTS "auth update own files" ON storage.objects;
CREATE POLICY "auth update own files" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'suggestion-files'
    AND owner = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.suggestions s
      LEFT JOIN public.employees e ON e.id = s.employee_id
      WHERE s.id::text = (storage.foldername(name))[1]
        AND (
          e.user_id = auth.uid()
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
        )
    )
  )
  WITH CHECK (
    bucket_id = 'suggestion-files'
    AND owner = auth.uid()
    AND lower(storage.extension(name)) IN (
      'pdf','doc','docx','xls','xlsx','png','jpg','jpeg','gif','webp'
    )
  );
