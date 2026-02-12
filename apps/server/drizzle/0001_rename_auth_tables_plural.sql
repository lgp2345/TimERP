DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'account'
	) AND NOT EXISTS (
		SELECT 1
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'accounts'
	) THEN
		ALTER TABLE "account" RENAME TO "accounts";
	END IF;

	IF EXISTS (
		SELECT 1
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'session'
	) AND NOT EXISTS (
		SELECT 1
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'sessions'
	) THEN
		ALTER TABLE "session" RENAME TO "sessions";
	END IF;

	IF EXISTS (
		SELECT 1
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'verification'
	) AND NOT EXISTS (
		SELECT 1
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'verifications'
	) THEN
		ALTER TABLE "verification" RENAME TO "verifications";
	END IF;
END
$$;
