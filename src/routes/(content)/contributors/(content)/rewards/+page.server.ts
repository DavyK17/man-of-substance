import type { PageServerLoad, Actions } from "./$types";
import type { Contributor, ContributorTier, ContributorRewardDownload } from "$lib/types/general";

import { error, fail, redirect } from "@sveltejs/kit";

import { Tiers, Rewards, Status } from "$lib/helpers/contributors";
import { Status as Generic, Utility } from "$lib/helpers/general";

export const load: PageServerLoad = async ({ cookies, locals: { supabase } }) => {
	const email = cookies.get("mos-contributor");
	if (!email) throw redirect(307, "/contributors/login");

	const { data, error: err } = await supabase.from("contributors").select("*").eq("email", email);
	if (data?.length === 0) throw redirect(307, "/contributors/login");

	if (err) {
		console.error(err.message);
		throw error(500, "An unexpected error occurred while loading the page. Kindly refresh and try again.");
	}

	const { id, name, amount, rewards_claimed } = data[0];
	const contributor: Contributor = { id, name, email, amount, rewardsClaimed: rewards_claimed };

	let videoUrl: string | undefined;
	if (contributor.amount && contributor.amount >= 2000)
		videoUrl = await Rewards.getFileUrl(supabase, `mp4/${contributor.id}.mp4`);

	return { contributor, videoUrl };
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		try {
			// Delete cookie
			const cookie = cookies.get("mos-contributor");
			if (cookie) cookies.delete("mos-contributor", { path: "/contributors" });

			// Redirect to login
			return { logout: true };
		} catch (err) {
			console.error(err);
			return fail(500, { message: Generic.ERROR });
		}
	},
	download: async ({ request, locals: { supabase } }) => {
		// Download rewards
		try {
			// Get tracks from database
			const { data: tracks, error: tracksError } = await supabase.from("tracks").select();
			if (tracksError) {
				const { error } = Utility.parsePostgrestError(tracksError);
				return fail(error!.code, { message: error!.message });
			}

			// Get form data
			const formData = await request.formData();
			const tier = formData.get("tier") as ContributorTier;

			// Download flows (by tier)
			const downloadObject: ContributorRewardDownload = {};

			if (tier === "supporter") {
				//-// SUPPORTER
				const id = Number(formData.get("track-select") as string);
				const name = `${tracks[id - 1].filename}.mp3`;

				downloadObject.file = { name, path: `mp3/${name}` };
			} else {
				downloadObject.files = { music: [], commentary: [] };

				if (tier === "bronze" || tier === "silver") {
					//-// BRONZE AND SILVER
					const checked: number[] = [];
					for (const value of formData.values()) {
						const trackId = Number(value);
						if (!isNaN(trackId)) checked.push(trackId);
					}

					const remaining = Tiers.maxTracks(tier) - checked.length;
					if (remaining > 0)
						return fail(400, {
							message: `Kindly select ${remaining} ${remaining === 5 ? " " : "more "}${
								remaining === 1 ? "song" : "songs"
							} to download.`
						});

					const format = formData.get("format-select") as string;
					if (!format)
						return fail(400, {
							message: "Kindly select a file format"
						});

					checked.map((id) => {
						const name = `${tracks[id - 1].filename}.${tier === "silver" ? format : "mp3"}`;
						const path = `${tier === "silver" ? format : "mp3"}/${name}`;
						downloadObject.files?.music.push({ name, path });
					});
				} else if (tier === "gold") {
					//-// GOLD
					const format = formData.get("format-select") as string;

					tracks.map((track) => {
						const name = `${track.filename}.${format}`;
						const path = `${format}/${name}`;
						downloadObject.files?.music.push({ name, path });
					});
				} else if (tier === "platinum" || tier === "executive") {
					//-// PLATINUM AND EXECUTIVE
					const format = formData.get("format-select") as string;

					tracks.map((track) => {
						let name = `${track.filename}.${format}`;
						let path = `${format}/${name}`;
						downloadObject.files?.music.push({ name, path });

						name = `${track.filename}.m4a`;
						path = `m4a/${name}`;
						downloadObject.files?.commentary.push({ name, path });
					});
				}
			}

			// Return data
			return {
				download: downloadObject,
				message: Status.DOWNLOAD_STARTING
			};
		} catch (err) {
			console.error(err);
			return fail(500, { message: Generic.ERROR });
		}
	}
};
