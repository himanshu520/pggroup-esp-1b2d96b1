DROP POLICY IF EXISTS emp_read_self ON public.employees;
CREATE POLICY emp_read_self ON public.employees
FOR SELECT
USING (
  user_id = auth.uid()
  OR private.has_role(auth.uid(), 'super_admin'::app_role)
  OR private.has_role(auth.uid(), 'corporate_admin'::app_role)
  OR private.has_role(auth.uid(), 'pe_user'::app_role)
);
