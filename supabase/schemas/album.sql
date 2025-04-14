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
	rewards_claimed boolean not null default false,
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
	missing_from tracklist_version[] null,
	constraint tracks_pkey primary key (id)
);

create view public.contributor_names as
select
	name,
	case
		when amount >= 1000
		and amount <= 1999 then 'bronze'
		when amount >= 2000
		and amount <= 3499 then 'silver'
		when amount >= 3500
		and amount <= 4999 then 'gold'
		when amount >= 5000
		and amount <= 49999 then 'platinum'
		when amount >= 50000 then 'executive'
	end as tier
from
	public.contributors
where
	amount >= 1000;

create policy "Enable read access based on user ID" on public.contributors as permissive for
select
	to authenticated using (
		(
			select
				auth.uid ()
		) = user_id
	);

create policy "Enable read access for all users" on public.credits as permissive for
select
	to public using (true);

create policy "Enable read access for all users" on public.tracks as permissive for
select
	to public using (true);

alter table public.challenge_attempts enable row level security;

alter table public.contributors enable row level security;

alter table public.credits enable row level security;

alter table public.tracks enable row level security;
