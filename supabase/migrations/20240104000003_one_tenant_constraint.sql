-- Add unique constraint to ensure a user can only belong to one tenant
-- This will fail if a user already belongs to multiple tenants (clean up required if so)
alter table tenant_profiles
add constraint tenant_profiles_profile_id_key unique (profile_id);
