CREATE TABLE challenge_attempts (
    id integer generated by default as identity primary key,
    name text not null,
    phone text not null,
    ip inet not null default inet_client_addr(),
    answer integer not null,
    created_at timestamp with time zone not null default now(),
    constraint challenge_attempts_answer_check check ((answer >= 0))
);


CREATE TABLE contributors (
    id integer generated by default as identity primary key,
    name text not null,
    email text not null,
    amount integer not null,
    rewards_claimed boolean not null
);

ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert access for all users" ON challenge_attempts
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable read access for users based on their IP" ON challenge_attempts
AS PERMISSIVE FOR SELECT
TO public
USING (inet_client_addr()::TEXT = ip::TEXT);

ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON contributors
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable update access for all users" ON contributors
AS PERMISSIVE FOR UPDATE
TO public
USING (true);

CREATE POLICY "Give all users access to rewards bucket" ON "storage"."objects"
AS PERMISSIVE FOR SELECT
TO public
USING ((bucket_id = 'rewards'::text));