# Supabase Next Steps (ClockRoster)

## 1) Run DB Schema
1. Open Supabase Dashboard -> SQL Editor
2. Paste `supabase/schema.sql`
3. Run

## 2) Seed your admin/HR profile
After first auth signup, insert role rows in `profiles`:

```sql
insert into public.profiles (id, email, role, full_name)
values
  ('<auth_user_uuid>', 'you@example.com', 'admin', 'Owner')
on conflict (id) do update set role=excluded.role, full_name=excluded.full_name;
```

## 3) Configure Auth
- Enable Email auth
- (Optional) enable magic links

## 4) Storage bucket
Create bucket: `employee-docs`

## 5) Frontend integration plan
- Replace localStorage reads/writes in `ui-mock.html` and `employee-app.html` with Supabase client calls
- Keep same data model names: employees/schedules/attendance/exceptions/payroll_runs/payroll_items

## 6) Deploy HR web
- Deploy to Vercel
- Set env vars:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- Bind domain: `hr.<your-domain>`
