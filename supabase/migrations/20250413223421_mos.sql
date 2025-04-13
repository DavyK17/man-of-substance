alter database postgres
set
	datestyle = dmy;

alter database postgres
set
	timezone = 'Africa/Nairobi';

create type "public"."tracklist_version" as enum('full', 'expanded', 'mixtape', 'base');

create table "public"."challenge_attempts" (
	"id" integer generated by default as identity not null,
	"name" text not null,
	"phone" text not null,
	"ip" inet not null default inet_client_addr(),
	"answer" integer not null,
	"created_at" timestamp with time zone not null default now()
);

create table "public"."contributors" (
	"id" integer generated by default as identity not null,
	"name" text not null,
	"email" text,
	"amount" integer not null,
	"user_id" uuid,
	"rewards_claimed" boolean not null
);

create table "public"."credits" ("key" text not null, "name" text not null);

create table "public"."tracks" (
	"id" bigint generated by default as identity not null,
	"title" text not null,
	"filename" text not null,
	"runtime" bigint not null,
	"style" text[] not null,
	"missing_from" tracklist_version[]
);

CREATE UNIQUE INDEX challenge_attempts_pkey ON public.challenge_attempts USING btree (id);

CREATE UNIQUE INDEX contributors_email_key ON public.contributors USING btree (email);

CREATE UNIQUE INDEX contributors_pkey ON public.contributors USING btree (id);

CREATE UNIQUE INDEX credits_pkey ON public.credits USING btree (key);

CREATE UNIQUE INDEX tracks_pkey ON public.tracks USING btree (id);

alter table "public"."challenge_attempts"
add constraint "challenge_attempts_pkey" PRIMARY KEY using index "challenge_attempts_pkey";

alter table "public"."contributors"
add constraint "contributors_pkey" PRIMARY KEY using index "contributors_pkey";

alter table "public"."credits"
add constraint "credits_pkey" PRIMARY KEY using index "credits_pkey";

alter table "public"."tracks"
add constraint "tracks_pkey" PRIMARY KEY using index "tracks_pkey";

alter table "public"."challenge_attempts"
add constraint "challenge_attempts_answer_check" CHECK ((answer >= 0)) not valid;

alter table "public"."challenge_attempts" validate constraint "challenge_attempts_answer_check";

alter table "public"."contributors"
add constraint "contributors_email_key" UNIQUE using index "contributors_email_key";

alter table "public"."contributors"
add constraint "contributors_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."contributors" validate constraint "contributors_user_id_fkey";

create policy "Enable read access for all users" on "public"."credits" as permissive for
select
	to public using (true);

create policy "Enable read access for all users" on "public"."tracks" as permissive for
select
	to public using (true);

alter table "public"."challenge_attempts" enable row level security;

alter table "public"."contributors" enable row level security;

alter table "public"."credits" enable row level security;

alter table "public"."tracks" enable row level security;

grant delete on table "public"."challenge_attempts" to "anon";

grant insert on table "public"."challenge_attempts" to "anon";

grant references on table "public"."challenge_attempts" to "anon";

grant
select
	on table "public"."challenge_attempts" to "anon";

grant trigger on table "public"."challenge_attempts" to "anon";

grant
truncate on table "public"."challenge_attempts" to "anon";

grant
update on table "public"."challenge_attempts" to "anon";

grant delete on table "public"."challenge_attempts" to "authenticated";

grant insert on table "public"."challenge_attempts" to "authenticated";

grant references on table "public"."challenge_attempts" to "authenticated";

grant
select
	on table "public"."challenge_attempts" to "authenticated";

grant trigger on table "public"."challenge_attempts" to "authenticated";

grant
truncate on table "public"."challenge_attempts" to "authenticated";

grant
update on table "public"."challenge_attempts" to "authenticated";

grant delete on table "public"."challenge_attempts" to "service_role";

grant insert on table "public"."challenge_attempts" to "service_role";

grant references on table "public"."challenge_attempts" to "service_role";

grant
select
	on table "public"."challenge_attempts" to "service_role";

grant trigger on table "public"."challenge_attempts" to "service_role";

grant
truncate on table "public"."challenge_attempts" to "service_role";

grant
update on table "public"."challenge_attempts" to "service_role";

grant delete on table "public"."contributors" to "anon";

grant insert on table "public"."contributors" to "anon";

grant references on table "public"."contributors" to "anon";

grant
select
	on table "public"."contributors" to "anon";

grant trigger on table "public"."contributors" to "anon";

grant
truncate on table "public"."contributors" to "anon";

grant
update on table "public"."contributors" to "anon";

grant delete on table "public"."contributors" to "authenticated";

grant insert on table "public"."contributors" to "authenticated";

grant references on table "public"."contributors" to "authenticated";

grant
select
	on table "public"."contributors" to "authenticated";

grant trigger on table "public"."contributors" to "authenticated";

grant
truncate on table "public"."contributors" to "authenticated";

grant
update on table "public"."contributors" to "authenticated";

grant delete on table "public"."contributors" to "service_role";

grant insert on table "public"."contributors" to "service_role";

grant references on table "public"."contributors" to "service_role";

grant
select
	on table "public"."contributors" to "service_role";

grant trigger on table "public"."contributors" to "service_role";

grant
truncate on table "public"."contributors" to "service_role";

grant
update on table "public"."contributors" to "service_role";

grant delete on table "public"."credits" to "anon";

grant insert on table "public"."credits" to "anon";

grant references on table "public"."credits" to "anon";

grant
select
	on table "public"."credits" to "anon";

grant trigger on table "public"."credits" to "anon";

grant
truncate on table "public"."credits" to "anon";

grant
update on table "public"."credits" to "anon";

grant delete on table "public"."credits" to "authenticated";

grant insert on table "public"."credits" to "authenticated";

grant references on table "public"."credits" to "authenticated";

grant
select
	on table "public"."credits" to "authenticated";

grant trigger on table "public"."credits" to "authenticated";

grant
truncate on table "public"."credits" to "authenticated";

grant
update on table "public"."credits" to "authenticated";

grant delete on table "public"."credits" to "service_role";

grant insert on table "public"."credits" to "service_role";

grant references on table "public"."credits" to "service_role";

grant
select
	on table "public"."credits" to "service_role";

grant trigger on table "public"."credits" to "service_role";

grant
truncate on table "public"."credits" to "service_role";

grant
update on table "public"."credits" to "service_role";

grant delete on table "public"."tracks" to "anon";

grant insert on table "public"."tracks" to "anon";

grant references on table "public"."tracks" to "anon";

grant
select
	on table "public"."tracks" to "anon";

grant trigger on table "public"."tracks" to "anon";

grant
truncate on table "public"."tracks" to "anon";

grant
update on table "public"."tracks" to "anon";

grant delete on table "public"."tracks" to "authenticated";

grant insert on table "public"."tracks" to "authenticated";

grant references on table "public"."tracks" to "authenticated";

grant
select
	on table "public"."tracks" to "authenticated";

grant trigger on table "public"."tracks" to "authenticated";

grant
truncate on table "public"."tracks" to "authenticated";

grant
update on table "public"."tracks" to "authenticated";

grant delete on table "public"."tracks" to "service_role";

grant insert on table "public"."tracks" to "service_role";

grant references on table "public"."tracks" to "service_role";

grant
select
	on table "public"."tracks" to "service_role";

grant trigger on table "public"."tracks" to "service_role";

grant
truncate on table "public"."tracks" to "service_role";

grant
update on table "public"."tracks" to "service_role";
