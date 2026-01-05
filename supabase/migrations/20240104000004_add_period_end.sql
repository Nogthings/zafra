-- Add current period end date to tenants for renewal tracking
alter table tenants
add column stripe_current_period_end timestamp with time zone;
