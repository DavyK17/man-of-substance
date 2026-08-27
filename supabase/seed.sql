INSERT INTO "public"."credits"("key", "name")
    VALUES ('artwork', 'Brian Bett'),
('execProducers', 'DVK'),
('photography', 'Tilu the Creator'),
('styling', 'Amusavi Senaji'),
('trailer', 'Tilu the Creator'),
('visualiser', 'Brian Bett'),
('website', 'Davy Kamanzi');

INSERT INTO "public"."tracks"("id", "title", "filename", "runtime", "style", "missing_from")
    VALUES ('1', 'Straight Bars', '01. Straight Bars', '64', ARRAY['Skit'], NULL),
('2', 'Not a Rapper, Pt. 2', '02. Not a Rapper, Pt. 2', '291', ARRAY['Boom bap'], NULL),
('3', 'Twenny 21', '03. Twenny 21', '241', ARRAY['Afro rap', 'Afropop', 'Afroswing'], ARRAY['mixtape'::public.tracklist_version, 'base'::public.tracklist_version]),
('4', 'Only', '04. Only', '180', ARRAY['Afro rap', 'Afropop'], NULL),
('5', 'Masculine (Interlude)', '05. Masculine (Interlude)', '150', ARRAY['Afro rap', 'Punk rap', 'Conscious rap'], ARRAY['mixtape'::public.tracklist_version, 'base'::public.tracklist_version]),
('6', 'Simama Kando', '06. Simama Kando', '196', ARRAY['Drill', 'Comedy rap'], NULL),
('7', 'Super Police', '07. Super Police', '212', ARRAY['Drill', 'Conscious rap'], NULL),
('8', 'Grime or Drill? (Skit)', '08. Grime or Drill (Skit)', '189', ARRAY['Drill', 'Comedy', 'Skit'], NULL),
('9', 'Combi', '09. Combi', '215', ARRAY['Boom bap'], ARRAY['mixtape'::public.tracklist_version, 'base'::public.tracklist_version]),
('10', 'Askari Ako Jaba', '10. Askari Ako Jaba', '168', ARRAY['Kapuka', 'Comedy rap'], NULL),
('11', 'Wake Up', '11. Wake Up', '207', ARRAY['Trap', 'Shrap', 'Comedy rap'], NULL),
('12', 'Tafuta Sponyo', '12. Tafuta Sponyo', '216', ARRAY['Afro rap', 'Afropop', 'Afroswing', 'Comedy rap'], NULL),
('13', 'Withdrawal Symptoms', '13. Withdrawal Symptoms', '209', ARRAY['Trap', 'Shrap', 'Comedy rap'], ARRAY['mixtape'::public.tracklist_version, 'base'::public.tracklist_version]),
('14', 'STD', '14. STD', '174', ARRAY['Drill', 'Benga', 'Rhumba', 'Comedy rap'], NULL),
('15', 'Nairobi Tofauti (Remix)', '15. Nairobi Tofauti (Remix) - Bonus', '140', ARRAY['Drill', 'Conscious rap'], ARRAY['expanded'::public.tracklist_version, 'base'::public.tracklist_version]),
('16', 'Slay King Remake (Vitu Sipendi)', '16. Slay King Remake (Vitu Sipendi) - Bonus', '165', ARRAY['Drill', 'Comedy rap'], ARRAY['expanded'::public.tracklist_version, 'base'::public.tracklist_version]),
('17', 'Only (Remix)', '17. Only (Remix) - Bonus', '204', ARRAY['Afro rap', 'Afropop'], ARRAY['expanded'::public.tracklist_version, 'mixtape'::public.tracklist_version, 'base'::public.tracklist_version]);

INSERT INTO "public"."contributors"("id", "name", "email", "amount", "user_id", "rewards_claimed")
    VALUES ('25', 'Joan Wanjiru', 'joanbeth5@gmail.com', '10500', NULL, FALSE);
