import type { PageServerLoad, Actions } from "./$types";
import type { Contributor, ContributorTier, ContributorRewardDownload } from "$lib/ambient";

import { error, fail, redirect } from "@sveltejs/kit";

import { tracks } from "$lib";
import { supabase } from "$lib/supabaseClient";

import { Tiers, Rewards, Status } from "$lib/helpers/contributors";
import { Generic } from "$lib/helpers/status";

export const load: PageServerLoad = async ({ cookies }) => {
	const email = cookies.get("mos-contributor");
	if (!email) throw redirect(307, "/contributors/login");

	const { data, error: err } = await supabase.from("contributors").select("*").eq("email", email);
	if (data?.length === 0) throw redirect(307, "/contributors/login");

	if (err) {
		console.error(err.message);
		throw error(
			500,
			"An unexpected error occurred while loading the page. Kindly refresh and try again."
		);
	}

	const { id, name, amount, rewards_claimed } = data[0];
	const contributor: Contributor = { id, name, email, amount, rewardsClaimed: rewards_claimed };

	let videoUrl: string | undefined;
	if (contributor.amount && contributor.amount >= 2000)
		videoUrl = await Rewards.getFileUrl(`mp4/${contributor.id}.mp4`);

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

	download: async ({ request }) => {
		// Download rewards
		try {
			// Get form data
			const formData = await request.formData();
			const tier = formData.get("tier") as ContributorTier;

			// Download flows (by tier)
			let downloadObject: ContributorRewardDownload = {};

			if (tier === "supporter") {
				//-// SUPPORTER
				let id = Number(formData.get("track-select") as string);
				let name = `${tracks[id - 1].filename}.mp3`;

				downloadObject.file = { name, path: `mp3/${name}` };
			} else {
				downloadObject.files = { music: [], commentary: [] };

				if (tier === "bronze" || tier === "silver") {
					//-// BRONZE AND SILVER
					let checked: number[] = [];
					for (let value of formData.values()) {
						const trackId = Number(value);
						if (!isNaN(trackId)) checked.push(trackId);
					}

					let remaining = Tiers.maxTracks(tier) - checked.length;
					if (remaining > 0)
						return fail(400, {
							message: `Kindly select ${remaining} ${remaining === 5 ? " " : "more "}${
								remaining === 1 ? "song" : "songs"
							} to download.`
						});

					let format = formData.get("format-select") as string;
					if (!format)
						return fail(400, {
							message: "Kindly select a file format"
						});

					checked.map((id) => {
						let name = `${tracks[id - 1].filename}.${tier === "silver" ? format : "mp3"}`;
						let path = `${tier === "silver" ? format : "mp3"}/${name}`;
						downloadObject.files?.music.push({ name, path });
					});
				} else if (tier === "gold") {
					//-// GOLD
					let format = formData.get("format-select") as string;

					tracks.map((track) => {
						let name = `${track.filename}.${format}`;
						let path = `${format}/${name}`;
						downloadObject.files?.music.push({ name, path });
					});
				} else if (tier === "platinum" || tier === "executive") {
					//-// PLATINUM AND EXECUTIVE
					let format = formData.get("format-select") as string;

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
