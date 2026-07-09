
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role FROM auth.users WHERE lower(email) = 'himanshusharma121106@gmail.com'
ON CONFLICT DO NOTHING;

DROP TRIGGER IF EXISTS bootstrap_admin_role_trigger ON auth.users;
CREATE TRIGGER bootstrap_admin_role_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.bootstrap_admin_role();
