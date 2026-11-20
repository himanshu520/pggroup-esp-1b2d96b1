
-- 1) Narrow employees SELECT: remove scope-admin PII broad access
DROP POLICY IF EXISTS emp_read_self ON public.employees;
CREATE POLICY emp_read_self ON public.employees
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR private.has_role(auth.uid(), 'super_admin'::app_role)
    OR private.has_role(auth.uid(), 'corporate_admin'::app_role)
    OR private.has_role(auth.uid(), 'mgmt_viewer'::app_role)
  );

-- 2) Evidence UPDATE/DELETE: require ongoing scope access
DROP POLICY IF EXISTS ev_update ON public.evidence;
CREATE POLICY ev_update ON public.evidence
  FOR UPDATE TO authenticated
  USING (
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
  )
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

DROP POLICY IF EXISTS ev_delete ON public.evidence;
CREATE POLICY ev_delete ON public.evidence
  FOR DELETE TO authenticated
  USING (
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

-- 3) Suggestion history: validate from_status matches the suggestion's CURRENT status
CREATE OR REPLACE FUNCTION public.validate_suggestion_history_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cur_status public.suggestion_status;
  cur_dept   uuid;
BEGIN
  SELECT s.status, s.current_department_id
    INTO cur_status, cur_dept
  FROM public.suggestions s
  WHERE s.id = NEW.suggestion_id;

  IF cur_status IS NULL THEN
    RAISE EXCEPTION 'Invalid suggestion_id for history row';
  END IF;

  -- from_status must reflect the suggestion's real current status
  -- (NULL from_status is only valid when recording the initial state).
  IF NEW.from_status IS DISTINCT FROM cur_status THEN
    RAISE EXCEPTION 'from_status (%) must match current suggestion status (%)',
      NEW.from_status, cur_status;
  END IF;

  -- from_department_id, when provided, must match current department
  IF NEW.from_department_id IS NOT NULL
     AND NEW.from_department_id IS DISTINCT FROM cur_dept THEN
    RAISE EXCEPTION 'from_department_id must match current suggestion department';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_hist_transition ON public.suggestion_history;
CREATE TRIGGER trg_validate_hist_transition
  BEFORE INSERT ON public.suggestion_history
  FOR EACH ROW EXECUTE FUNCTION public.validate_suggestion_history_transition();

-- 4) Storage: replace brittle folder/name pattern with strict suggestion_id folder check
DROP POLICY IF EXISTS "auth upload suggestion files" ON storage.objects;
CREATE POLICY "auth upload suggestion files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'suggestion-files'
    AND owner = auth.uid()
    AND lower(storage.extension(name)) = ANY (ARRAY['pdf','doc','docx','xls','xlsx','png','jpg','jpeg','gif','webp'])
    AND EXISTS (
      SELECT 1 FROM public.suggestions s
      LEFT JOIN public.employees e ON e.id = s.employee_id
      WHERE (storage.foldername(objects.name))[1] = s.id::text
        AND (
          e.user_id = auth.uid()
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
        )
    )
  );

DROP POLICY IF EXISTS "auth update suggestion files" ON storage.objects;
CREATE POLICY "auth update suggestion files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'suggestion-files'
    AND owner = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.suggestions s
      LEFT JOIN public.employees e ON e.id = s.employee_id
      WHERE (storage.foldername(objects.name))[1] = s.id::text
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
    AND EXISTS (
      SELECT 1 FROM public.suggestions s
      LEFT JOIN public.employees e ON e.id = s.employee_id
      WHERE (storage.foldername(objects.name))[1] = s.id::text
        AND (
          e.user_id = auth.uid()
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
          OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
        )
    )
  );
