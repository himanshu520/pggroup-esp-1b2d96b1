DROP POLICY IF EXISTS att_read ON public.attachments;
CREATE POLICY att_read ON public.attachments
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.suggestions s
    WHERE s.id = attachments.suggestion_id
      AND (
        EXISTS (SELECT 1 FROM public.employees e WHERE e.id = s.employee_id AND e.user_id = auth.uid())
        OR attachments.uploaded_by = auth.uid()
        OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.department_id)
        OR private.can_access_scope(auth.uid(), s.location_id, s.plant_id, s.current_department_id)
        OR private.is_super_admin(auth.uid())
      )
  )
);

DROP POLICY IF EXISTS sug_update ON public.suggestions;
CREATE POLICY sug_update ON public.suggestions
FOR UPDATE TO authenticated
USING (
  private.can_access_scope(auth.uid(), location_id, plant_id, department_id)
  OR private.can_access_scope(auth.uid(), location_id, plant_id, current_department_id)
  OR private.is_super_admin(auth.uid())
)
WITH CHECK (
  private.can_access_scope(auth.uid(), location_id, plant_id, department_id)
  OR private.can_access_scope(auth.uid(), location_id, plant_id, current_department_id)
  OR private.is_super_admin(auth.uid())
);