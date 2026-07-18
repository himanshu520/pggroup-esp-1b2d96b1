-- Add 'admin' to the app_role enum
ALTER TYPE public.app_role ADD VALUE 'admin';

-- Update private.can_access_scope to allow 'admin' role plant/location access
CREATE OR REPLACE FUNCTION private.can_access_scope(
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
        OR (ur.role = 'admin' AND (ur.plant_id = _plant_id OR (ur.plant_id IS NULL AND ur.location_id = _location_id)))
      )
  );
$$;
