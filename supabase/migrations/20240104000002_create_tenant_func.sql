-- Function to safely create a tenant and link the creator
create or replace function create_tenant_v2(name text, slug text)
returns json as $$
declare
  new_tenant tenants%rowtype;
begin
  -- 1. Insert Tenant
  insert into tenants (name, slug)
  values (name, slug)
  returning * into new_tenant;

  -- 2. Insert Membership (Owner)
  insert into tenant_profiles (tenant_id, profile_id, role)
  values (new_tenant.id, auth.uid(), 'owner');

  return row_to_json(new_tenant);
end;
$$ language plpgsql security definer;
