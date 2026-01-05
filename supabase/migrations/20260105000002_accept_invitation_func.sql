create or replace function accept_invitation(lookup_token text)
returns json
language plpgsql
security definer
as $$
declare
  invite public.tenant_invitations;
  current_user_id uuid;
  result json;
begin
  current_user_id := auth.uid();
  
  if current_user_id is null then
    return json_build_object('error', 'User not authenticated');
  end if;

  select * into invite
  from public.tenant_invitations
  where token = lookup_token;

  if invite is null then
    return json_build_object('error', 'Invalid invitation');
  end if;

  if invite.expires_at < now() then
    return json_build_object('error', 'Invitation expired');
  end if;

  -- Add to tenant_profiles
  begin
    insert into public.tenant_profiles (tenant_id, profile_id, role)
    values (invite.tenant_id, current_user_id, invite.role);
  exception when unique_violation then
    -- Already a member, that's fine, we can just consume the invite
    null;
  end;

  -- Delete invitation
  delete from public.tenant_invitations
  where id = invite.id;

  return json_build_object('success', true, 'tenant_id', invite.tenant_id);
end;
$$;
