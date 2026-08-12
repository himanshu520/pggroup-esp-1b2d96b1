-- Update emp_read_self policy to support HR role after enum value is committed
DROP POLICY IF EXISTS emp_read_self ON public.employees;
CREATE POLICY emp_read_self ON public.employees
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR private.has_role(auth.uid(), 'super_admin'::app_role)
  OR private.has_role(auth.uid(), 'corporate_admin'::app_role)
  OR private.has_role(auth.uid(), 'hr'::app_role)
  OR private.has_role(auth.uid(), 'pe_user'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND (
        (ur.role = 'location_admin'::app_role AND ur.location_id = employees.location_id)
        OR (ur.role = 'plant_admin'::app_role AND ur.plant_id = employees.plant_id)
        OR (ur.role = 'admin'::app_role AND (ur.plant_id = employees.plant_id OR (ur.plant_id IS NULL AND ur.location_id = employees.location_id)))
        OR (ur.role IN ('department_admin'::app_role, 'dept_user'::app_role) AND ur.department_id = employees.department_id)
        OR (ur.role = 'mgmt_viewer'::app_role AND (ur.plant_id = employees.plant_id OR ur.location_id = employees.location_id OR (ur.plant_id IS NULL AND ur.location_id IS NULL)))
      )
  )
);
