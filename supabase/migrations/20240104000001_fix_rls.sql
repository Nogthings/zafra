-- Allow authenticated users to create tenants
create policy "Users can create tenants." on tenants
  for insert with check (auth.role() = 'authenticated');

-- Allow users to add themselves to tenants (needed for initial creation)
-- Note: In a production app with public tenant IDs, you might want to wrap this in a function
create policy "Users can add themselves to tenants." on tenant_profiles
  for insert with check (auth.uid() = profile_id);

-- Allow owners to update their tenants
create policy "Owners can update tenants." on tenants
  for update using (
    exists (
      select 1 from tenant_profiles
      where tenant_profiles.tenant_id = tenants.id
      and tenant_profiles.profile_id = auth.uid()
      and tenant_profiles.role = 'owner'
    )
  );

-- Allow owners to update tenant members (change roles, etc)
create policy "Owners can update tenant members." on tenant_profiles
  for update using (
    exists (
      select 1 from tenant_profiles tp
      where tp.tenant_id = tenant_profiles.tenant_id
      and tp.profile_id = auth.uid()
      and tp.role = 'owner'
    )
  );
