SET
	statement_timeout = 0;

SET
	lock_timeout = 0;

SET
	idle_in_transaction_session_timeout = 0;

SET
	client_encoding = 'UTF8';

SET
	standard_conforming_strings = on;

SELECT
	pg_catalog.set_config ('search_path', '', false);

SET
	check_function_bodies = false;

SET
	xmloption = content;

SET
	client_min_messages = warning;

SET
	row_security = off;

ALTER DATABASE postgres
SET
	datestyle = dmy;

ALTER DATABASE postgres
SET
	timezone = 'Africa/Nairobi';

CREATE EXTENSION IF NOT EXISTS "pg_net"
WITH
	SCHEMA "extensions";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql"
WITH
	SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"
WITH
	SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto"
WITH
	SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt"
WITH
	SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault"
WITH
	SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
WITH
	SCHEMA "extensions";

CREATE TYPE "public"."tracklist_version" AS ENUM('full', 'expanded', 'mixtape', 'base');

ALTER TYPE "public"."tracklist_version" OWNER TO "postgres";

SET
	default_tablespace = '';

SET
	default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."challenge_attempts" (
	"id" integer NOT NULL,
	"name" "text" NOT NULL,
	"phone" "text" NOT NULL,
	"ip" "inet" DEFAULT "inet_client_addr" () NOT NULL,
	"answer" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT "now" () NOT NULL,
	CONSTRAINT "challenge_attempts_answer_check" CHECK (("answer" >= 0))
);

ALTER TABLE "public"."challenge_attempts" OWNER TO "postgres";

ALTER TABLE "public"."challenge_attempts"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
	SEQUENCE NAME "public"."challenge_attempts_id_seq" START
	WITH
		1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."contributors" (
	"id" integer NOT NULL,
	"name" "text" NOT NULL,
	"email" "text",
	"amount" integer NOT NULL,
	"user_id" "uuid",
	"rewards_claimed" boolean NOT NULL
);

ALTER TABLE "public"."contributors" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."contributor_names" AS
SELECT
	"contributors"."name",
	CASE
		WHEN amount >= 1000
		AND amount <= 1999 THEN 'bronze'
		WHEN amount >= 2000
		AND amount <= 3499 THEN 'silver'
		WHEN amount >= 3500
		AND amount <= 4999 THEN 'gold'
		WHEN amount >= 5000
		AND amount <= 49999 THEN 'platinum'
		WHEN amount >= 50000 THEN 'executive'
	END AS "tier"
FROM
	"public"."contributors"
WHERE
	("contributors"."amount" >= 1000);

ALTER TABLE "public"."contributor_names" OWNER TO "postgres";

ALTER TABLE "public"."contributors"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
	SEQUENCE NAME "public"."contributors_id_seq" START
	WITH
		1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."credits" ("key" "text" NOT NULL, "name" "text" NOT NULL);

ALTER TABLE "public"."credits" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tracks" (
	"id" bigint NOT NULL,
	"title" "text" NOT NULL,
	"filename" "text" NOT NULL,
	"runtime" bigint NOT NULL,
	"style" "text" [] NOT NULL,
	"missing_from" "public"."tracklist_version" []
);

ALTER TABLE "public"."tracks" OWNER TO "postgres";

ALTER TABLE "public"."tracks"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
	SEQUENCE NAME "public"."tracks_id_seq" START
	WITH
		1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
);

ALTER TABLE ONLY "public"."challenge_attempts"
ADD CONSTRAINT "challenge_attempts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."contributors"
ADD CONSTRAINT "contributors_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."contributors"
ADD CONSTRAINT "contributors_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."credits"
ADD CONSTRAINT "credits_pkey" PRIMARY KEY ("key");

ALTER TABLE ONLY "public"."tracks"
ADD CONSTRAINT "tracks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."contributors"
ADD CONSTRAINT "contributors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON UPDATE CASCADE ON DELETE RESTRICT;

CREATE POLICY "Enable read access based on user ID" ON "public"."contributors" FOR
SELECT
	TO "authenticated" USING (
		(
			(
				SELECT
					"auth"."uid" () AS "uid"
			) = "user_id"
		)
	);

CREATE POLICY "Enable read access for all users" ON "public"."credits" FOR
SELECT
	USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."tracks" FOR
SELECT
	USING (true);

ALTER TABLE "public"."challenge_attempts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."contributors" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."credits" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tracks" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."challenge_attempts" TO "anon";

GRANT ALL ON TABLE "public"."challenge_attempts" TO "authenticated";

GRANT ALL ON TABLE "public"."challenge_attempts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."challenge_attempts_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."challenge_attempts_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."challenge_attempts_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."contributors" TO "anon";

GRANT ALL ON TABLE "public"."contributors" TO "authenticated";

GRANT ALL ON TABLE "public"."contributors" TO "service_role";

GRANT ALL ON TABLE "public"."contributor_names" TO "anon";

GRANT ALL ON TABLE "public"."contributor_names" TO "authenticated";

GRANT ALL ON TABLE "public"."contributor_names" TO "service_role";

GRANT ALL ON SEQUENCE "public"."contributors_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."contributors_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."contributors_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."credits" TO "anon";

GRANT ALL ON TABLE "public"."credits" TO "authenticated";

GRANT ALL ON TABLE "public"."credits" TO "service_role";

GRANT ALL ON TABLE "public"."tracks" TO "anon";

GRANT ALL ON TABLE "public"."tracks" TO "authenticated";

GRANT ALL ON TABLE "public"."tracks" TO "service_role";

GRANT ALL ON SEQUENCE "public"."tracks_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."tracks_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."tracks_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "service_role";

RESET ALL;

--
-- Dumped schema changes for auth and storage
--
