-- ClockRoster MVP schema (Supabase/Postgres)
-- Run in Supabase SQL Editor

create extension if not exists "pgcrypto";

-- Profiles (maps auth.users -> role)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null check (role in ('admin','hr','employee')),
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_code text unique not null,
  full_name text not null,
  department text not null,
  role_title text,
  pay_type text not null check (pay_type in ('hourly','monthly')),
  hourly_rate numeric(12,2),
  monthly_salary numeric(12,2),
  country text not null check (country in ('US','AU','PH')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  work_date date not null,
  start_time time not null,
  end_time time not null,
  break_minutes int not null default 0,
  shift_type text not null default 'normal' check (shift_type in ('normal','holiday')),
  created_at timestamptz not null default now(),
  unique(employee_id, work_date)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  work_date date not null,
  clock_in time,
  clock_out time,
  break_minutes int not null default 0,
  gps_status text default 'unknown',
  capture_method text default 'mobile-gps',
  created_at timestamptz not null default now(),
  unique(employee_id, work_date)
);

create table if not exists public.exceptions (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  work_date date not null,
  type text not null check (type in ('OT','ABSENT','MEDICAL','ANNUAL','LATE')),
  hours numeric(8,2) default 0,
  details text,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  run_month text not null,
  country_view text not null default 'ALL',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.payroll_items (
  id uuid primary key default gen_random_uuid(),
  payroll_run_id uuid not null references public.payroll_runs(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  country text not null,
  currency text not null,
  base_amount numeric(12,2) not null default 0,
  ot_amount numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  benefits_amount numeric(12,2) not null default 0,
  net_amount numeric(12,2) not null default 0,
  components jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_schedules_employee_date on public.schedules(employee_id, work_date);
create index if not exists idx_attendance_employee_date on public.attendance(employee_id, work_date);
create index if not exists idx_exceptions_employee_date on public.exceptions(employee_id, work_date);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.employees enable row level security;
alter table public.schedules enable row level security;
alter table public.attendance enable row level security;
alter table public.exceptions enable row level security;
alter table public.payroll_runs enable row level security;
alter table public.payroll_items enable row level security;

-- Simple MVP policies:
-- hr/admin full access; employee read/write own attendance/exceptions + read own profile

create or replace function public.current_role()
returns text language sql stable as $$
  select role from public.profiles where id = auth.uid();
$$;

-- profiles
create policy if not exists "profiles_self_read" on public.profiles for select using (id = auth.uid());
create policy if not exists "profiles_hr_admin_all" on public.profiles for all using (public.current_role() in ('admin','hr')) with check (public.current_role() in ('admin','hr'));

-- employees
create policy if not exists "employees_hr_admin_all" on public.employees for all using (public.current_role() in ('admin','hr')) with check (public.current_role() in ('admin','hr'));

-- schedules
create policy if not exists "schedules_hr_admin_all" on public.schedules for all using (public.current_role() in ('admin','hr')) with check (public.current_role() in ('admin','hr'));

-- attendance
create policy if not exists "attendance_hr_admin_all" on public.attendance for all using (public.current_role() in ('admin','hr')) with check (public.current_role() in ('admin','hr'));
create policy if not exists "attendance_employee_own" on public.attendance for all using (
  exists (select 1 from public.employees e where e.id = attendance.employee_id and e.employee_code = (select coalesce((auth.jwt() ->> 'employee_code'),'') ))
) with check (
  exists (select 1 from public.employees e where e.id = attendance.employee_id and e.employee_code = (select coalesce((auth.jwt() ->> 'employee_code'),'') ))
);

-- exceptions
create policy if not exists "exceptions_hr_admin_all" on public.exceptions for all using (public.current_role() in ('admin','hr')) with check (public.current_role() in ('admin','hr'));
create policy if not exists "exceptions_employee_own" on public.exceptions for all using (
  exists (select 1 from public.employees e where e.id = exceptions.employee_id and e.employee_code = (select coalesce((auth.jwt() ->> 'employee_code'),'') ))
) with check (
  exists (select 1 from public.employees e where e.id = exceptions.employee_id and e.employee_code = (select coalesce((auth.jwt() ->> 'employee_code'),'') ))
);

-- payroll tables
create policy if not exists "payroll_hr_admin_all_runs" on public.payroll_runs for all using (public.current_role() in ('admin','hr')) with check (public.current_role() in ('admin','hr'));
create policy if not exists "payroll_hr_admin_all_items" on public.payroll_items for all using (public.current_role() in ('admin','hr')) with check (public.current_role() in ('admin','hr'));
