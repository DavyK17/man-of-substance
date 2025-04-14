import type { Contributor, ContributorTier, ContributorRewardDownload } from "$lib/types/general";

import { fail, redirect } from "@sveltejs/kit";

import { Tiers, Rewards, Status } from "$lib/helpers/contributors";
import { Status as Generic, Utility } from "$lib/helpers/general";

/* Load function */
export const load = async ({ locals: { supabase, user }, parent }) => {
	// Redirect to login if not authenticated
	if (!user) throw redirect(307, "/contributors/login");

	// Get contributor data
	const { data, error } = await supabase.from("contributors").select("*").eq("email", user.email!).single();
	if (error) {
		const { error: loadError } = Utility.parsePostgrestError(error);
		throw Utility.parseLoadError(loadError!);
	}

	// Format contributor data
	const { id, name, amount, rewards_claimed: rewardsClaimed } = data;
	const contributor: Contributor = { id, name, email: user.email!, amount, rewardsClaimed };

	// Get personalised "thank you" video if eligible
	let videoUrl: string | undefined;
	if (contributor.amount && contributor.amount >= 2000)
		videoUrl = await Rewards.getFileUrl(supabase, `mp4/${contributor.id}.mp4`);

	// Get tracks from parent
	const { tracks } = await parent();

	// Return data
	return { contributor, supabase, tracks, videoUrl };
};

/* Form actions */
export const actions = {
	logout: async ({ locals: { supabase } }) => {
		try {
			// Log out
			const { error } = await supabase.auth.signOut();
			if (error) return fail(error.status ?? 500, { message: error.message });

			// Redirect to login
			throw redirect(307, "/contributors/login");
		} catch (err) {
			console.error(err);
			return fail(500, { message: Generic.ERROR });
		}
	},
	download: async ({ request, locals: { tracks } }) => {
		// Download rewards
		try {
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
