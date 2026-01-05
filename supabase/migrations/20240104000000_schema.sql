-- Create a table for public profiles linked to auth.users
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create a table for tenants (organizations/teams)
create table tenants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  plan_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for tenants
alter table tenants enable row level security;

-- Create a join table for many-to-many relationship between profiles and tenants
create table tenant_profiles (
  tenant_id uuid references tenants(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  role text check (role in ('owner', 'admin', 'member')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (tenant_id, profile_id)
);

-- Enable RLS for tenant_profiles
alter table tenant_profiles enable row level security;

-- Policy: Users can view tenants they are members of
create policy "Users can view tenants they belong to." on tenants
  for select using (
    exists (
      select 1 from tenant_profiles
      where tenant_profiles.tenant_id = tenants.id
      and tenant_profiles.profile_id = (select auth.uid())
    )
  );

-- Policy: Users can view their own memberships
create policy "Users can view own memberships." on tenant_profiles
  for select using (
    profile_id = (select auth.uid())
  );

-- Allow authenticated users to create tenants
create policy "Users can create tenants." on tenants
  for insert with check ((select auth.role()) = 'authenticated');

-- Allow users to add themselves to tenants (needed for initial creation)
create policy "Users can add themselves to tenants." on tenant_profiles
  for insert with check ((select auth.uid()) = profile_id);

-- Allow owners to update their tenants
create policy "Owners can update tenants." on tenants
  for update using (
    exists (
      select 1 from tenant_profiles
      where tenant_profiles.tenant_id = tenants.id
      and tenant_profiles.profile_id = (select auth.uid())
      and tenant_profiles.role = 'owner'
    )
  );

-- Allow owners to update tenant members (change roles, etc)
create policy "Owners can update tenant members." on tenant_profiles
  for update using (
    exists (
      select 1 from tenant_profiles tp
      where tp.tenant_id = tenant_profiles.tenant_id
      and tp.profile_id = (select auth.uid())
      and tp.role = 'owner'
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
SET search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to safely create a tenant and link the creator
create or replace function create_tenant_v2(name text, slug text)
returns json
SET search_path = ''
as $$
declare
  new_tenant public.tenants%rowtype;
begin
  -- 1. Insert Tenant
  insert into public.tenants (name, slug)
  values (name, slug)
  returning * into new_tenant;

  -- 2. Insert Membership (Owner)
  insert into public.tenant_profiles (tenant_id, profile_id, role)
  values (new_tenant.id, auth.uid(), 'owner');

  return row_to_json(new_tenant);
end;
$$ language plpgsql security definer;
