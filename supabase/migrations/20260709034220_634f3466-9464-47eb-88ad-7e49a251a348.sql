
-- 1) employees: remove mgmt_viewer broad PII access
DROP POLICY IF EXISTS emp_read_self ON public.employees;
CREATE POLICY emp_read_self ON public.employees
FOR SELECT
USING (
  user_id = auth.uid()
  OR private.has_role(auth.uid(), 'super_admin'::app_role)
  OR private.has_role(auth.uid(), 'corporate_admin'::app_role)
);

-- 2) suggestion_history INSERT: require modify authorization (owner or current-department scope)
DROP POLICY IF EXISTS hist_insert ON public.suggestion_history;
CREATE POLICY hist_insert ON public.suggestion_history
FOR INSERT
WITH CHECK (
  actor_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM suggestions s
    LEFT JOIN employees e ON e.id = s.employee_id
    WHERE s.id = suggestion_history.suggestion_id
      AND (
        e.user_id = auth.uid()
        OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
      )
  )
);

-- 3) evidence INSERT: require modify authorization (owner or current-department scope)
DROP POLICY IF EXISTS ev_insert ON public.evidence;
CREATE POLICY ev_insert ON public.evidence
FOR INSERT
WITH CHECK (
  submitted_by = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM suggestions s
    LEFT JOIN employees e ON e.id = s.employee_id
    WHERE s.id = evidence.suggestion_id
      AND (
        e.user_id = auth.uid()
        OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
      )
  )
);

-- 4) storage.objects: add content-type allow-list alongside extension check
DROP POLICY IF EXISTS "auth upload suggestion files" ON storage.objects;
CREATE POLICY "auth upload suggestion files" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'suggestion-files'
  AND owner = auth.uid()
  AND lower(storage.extension(name)) = ANY (ARRAY['pdf','doc','docx','xls','xlsx','png','jpg','jpeg','gif','webp'])
  AND (
    (storage.objects.metadata IS NULL)
    OR (storage.objects.metadata->>'mimetype') IS NULL
    OR lower(storage.objects.metadata->>'mimetype') = ANY (ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png','image/jpeg','image/gif','image/webp'
    ])
  )
  AND EXISTS (
    SELECT 1
    FROM suggestions s
    LEFT JOIN employees e ON e.id = s.employee_id
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
FOR UPDATE
USING (
  bucket_id = 'suggestion-files'
  AND owner = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM suggestions s
    LEFT JOIN employees e ON e.id = s.employee_id
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
  AND lower(storage.extension(name)) = ANY (ARRAY['pdf','doc','docx','xls','xlsx','png','jpg','jpeg','gif','webp'])
  AND (
    (storage.objects.metadata IS NULL)
    OR (storage.objects.metadata->>'mimetype') IS NULL
    OR lower(storage.objects.metadata->>'mimetype') = ANY (ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png','image/jpeg','image/gif','image/webp'
    ])
  )
  AND EXISTS (
    SELECT 1
    FROM suggestions s
    LEFT JOIN employees e ON e.id = s.employee_id
    WHERE (storage.foldername(objects.name))[1] = s.id::text
      AND (
        e.user_id = auth.uid()
        OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
        OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
      )
  )
);
