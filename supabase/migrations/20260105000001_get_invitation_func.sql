create or replace function get_invitation_by_token(lookup_token text)
returns json
language plpgsql
security definer
as $$
declare
  invite public.tenant_invitations;
  tenant_name text;
begin
  select * into invite
  from public.tenant_invitations
  where token = lookup_token;

  if invite is null then
    return null;
  end if;

  select name into tenant_name
  from public.tenants
  where id = invite.tenant_id;

  return json_build_object(
    'id', invite.id,
    'email', invite.email,
    'role', invite.role,
    'token', invite.token,
    'expires_at', invite.expires_at,
    'tenant_id', invite.tenant_id,
    'tenant', json_build_object('name', tenant_name)
  );
end;
$$;
