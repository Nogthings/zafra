-- Add policy to allow users to view other members of the same tenant
create policy "Users can view all members of their tenants." on tenant_profiles
  for select using (
    tenant_id in (
      select tenant_id from tenant_profiles
      where profile_id = auth.uid()
    )
  );
