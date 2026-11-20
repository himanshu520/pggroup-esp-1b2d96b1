INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::public.app_role FROM auth.users
WHERE lower(email) = 'himanshusharma121106@gmail.com'
ON CONFLICT DO NOTHING;