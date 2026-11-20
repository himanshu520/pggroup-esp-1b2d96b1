GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_super_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_access_scope(uuid, uuid, uuid, uuid) TO authenticated;