-- 1. Create a secure function to get tenant IDs for the current user avoiding recursion
create or replace function get_user_tenant_ids()
returns setof uuid
language sql
security definer
set search_path = ''
stable
as $$
  select tenant_id
  from public.tenant_profiles
  where profile_id = auth.uid();
$$;

-- 2. Drop the problematic recursive policy
drop policy "Users can view all members of their tenants." on tenant_profiles;

-- 3. Create a new safe policy using the secure function
create policy "Users can view all members of their tenants." on tenant_profiles
  for select using (
    tenant_id in (select get_user_tenant_ids())
  );

-- 4. Drop the constraint that prevents users from joining multiple tenants
-- We need to check if the constraint exists, or just try to drop it.
-- The error message "tenant_profiles_profile_id_key" indicates it is a unique constraint on profile_id.
alter table tenant_profiles drop constraint if exists tenant_profiles_profile_id_key;
