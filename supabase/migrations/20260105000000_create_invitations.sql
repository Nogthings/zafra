create table tenant_invitations (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references tenants(id) on delete cascade not null,
  email text not null,
  role text check (role in ('owner', 'admin', 'member')) default 'member' not null,
  token text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table tenant_invitations enable row level security;

-- Policy: Owners can view invitations for their tenants
create policy "Owners can view invitations." on tenant_invitations
  for select using (
    exists (
      select 1 from tenant_profiles
      where tenant_profiles.tenant_id = tenant_invitations.tenant_id
      and tenant_profiles.profile_id = (select auth.uid())
      and tenant_profiles.role = 'owner'
    )
  );

-- Policy: Owners can create invitations
create policy "Owners can create invitations." on tenant_invitations
  for insert with check (
    exists (
      select 1 from tenant_profiles
      where tenant_profiles.tenant_id = tenant_invitations.tenant_id
      and tenant_profiles.profile_id = (select auth.uid())
      and tenant_profiles.role = 'owner'
    )
  );

-- Policy: Owners can delete invitations (revoke)
create policy "Owners can delete invitations." on tenant_invitations
  for delete using (
    exists (
      select 1 from tenant_profiles
      where tenant_profiles.tenant_id = tenant_invitations.tenant_id
      and tenant_profiles.profile_id = (select auth.uid())
      and tenant_profiles.role = 'owner'
    )
  );
