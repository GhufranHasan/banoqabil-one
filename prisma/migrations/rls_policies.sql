-- Enable Row Level Security (RLS) on all domain tables in Supabase PostgreSQL
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AttendanceRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FollowUp" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WaitlistEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Batch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TransferRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DuplicateCandidate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ImportJob" ENABLE ROW LEVEL SECURITY;

-- 1. Service role and postgres superuser bypass policies
DROP POLICY IF EXISTS "service_role_all_students" ON "Student";
CREATE POLICY "service_role_all_students" ON "Student" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_enrollments" ON "Enrollment";
CREATE POLICY "service_role_all_enrollments" ON "Enrollment" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_attendance" ON "AttendanceRecord";
CREATE POLICY "service_role_all_attendance" ON "AttendanceRecord" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_followups" ON "FollowUp";
CREATE POLICY "service_role_all_followups" ON "FollowUp" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_batches" ON "Batch";
CREATE POLICY "service_role_all_batches" ON "Batch" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_waitlist" ON "WaitlistEntry";
CREATE POLICY "service_role_all_waitlist" ON "WaitlistEntry" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_transfers" ON "TransferRequest";
CREATE POLICY "service_role_all_transfers" ON "TransferRequest" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_duplicates" ON "DuplicateCandidate";
CREATE POLICY "service_role_all_duplicates" ON "DuplicateCandidate" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_audit" ON "AuditLog";
CREATE POLICY "service_role_all_audit" ON "AuditLog" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_notifications" ON "Notification";
CREATE POLICY "service_role_all_notifications" ON "Notification" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_imports" ON "ImportJob";
CREATE POLICY "service_role_all_imports" ON "ImportJob" FOR ALL TO postgres, anon, authenticated USING (true) WITH CHECK (true);

-- 2. Scope-enforcing application functions for direct client connections
CREATE OR REPLACE FUNCTION current_app_role() RETURNS text AS $$
  SELECT COALESCE(
    current_setting('app.current_role', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION current_app_user_id() RETURNS text AS $$
  SELECT COALESCE(
    current_setting('app.current_user_id', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  );
$$ LANGUAGE sql STABLE;
