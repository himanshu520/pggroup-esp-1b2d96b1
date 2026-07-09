
TRUNCATE TABLE public.attachments, public.audit_logs, public.evidence, public.suggestion_history, public.notifications, public.suggestions, public.employees, public.departments, public.plants, public.locations, public.categories, public.user_roles RESTART IDENTITY CASCADE;

DELETE FROM auth.users WHERE email <> 'software.2040@pgel.in';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role FROM auth.users WHERE email = 'software.2040@pgel.in'
ON CONFLICT DO NOTHING;
