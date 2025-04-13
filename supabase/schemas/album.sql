create type public.tracklist_version AS ENUM('full', 'expanded', 'mixtape', 'base');

create table public.challenge_attempts (
	id integer generated by default as identity not null,
	name text not null,
	phone text not null,
	ip inet not null default inet_client_addr(),
	answer integer not null,
	created_at timestamp with time zone not null default now(),
	constraint challenge_attempts_pkey primary key (id),
	constraint challenge_attempts_answer_check check ((answer >= 0))
);

create table public.contributors (
	id integer generated by default as identity not null,
	name text not null,
	email text null,
	amount integer not null,
	user_id uuid null,
	rewards_claimed boolean not null,
	constraint contributors_pkey primary key (id),
	constraint contributors_email_key unique (email),
	constraint contributors_user_id_fkey foreign KEY (user_id) references auth.users (id) on update CASCADE on delete RESTRICT
);

create table public.credits (
	key text not null,
	name text not null,
	constraint credits_pkey primary key (key)
);

create table public.tracks (
	id bigint generated by default as identity not null,
	title text not null,
	filename text not null,
	runtime bigint not null,
	style text[] not null,
	synopsis jsonb not null,
	lyrics jsonb not null,
	credits jsonb not null,
	missing_from tracklist_version[] null,
	constraint tracks_pkey primary key (id)
);
