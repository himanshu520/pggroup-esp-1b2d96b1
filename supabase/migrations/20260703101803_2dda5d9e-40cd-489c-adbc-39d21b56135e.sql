
-- Lock down SECURITY DEFINER helpers: policies run in the postgres role and can still call them,
-- but no direct RPC access from anon/authenticated.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_access_scope(uuid, uuid, uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_suggestion_code() FROM PUBLIC, anon, authenticated;

-- Storage bucket policies for suggestion-files
CREATE POLICY "auth read suggestion files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'suggestion-files');
CREATE POLICY "auth upload suggestion files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'suggestion-files' AND owner = auth.uid());
CREATE POLICY "auth update own files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'suggestion-files' AND owner = auth.uid());
CREATE POLICY "auth delete own files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'suggestion-files' AND owner = auth.uid());
