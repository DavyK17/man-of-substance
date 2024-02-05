import type { PageServerLoad, Actions } from "./$types";
import type { Contributor, ContributorTier, ContributorRewardDownload } from "$lib/ambient";

import { error, fail } from "@sveltejs/kit";
import moment from "moment";

import { tracks } from "$lib";
import { Tiers, Rewards, Status } from "$lib/helpers/contributors";
import { supabase } from "$lib/supabaseClient";

export const load: PageServerLoad = async ({ cookies }) => {
	const email = cookies.get("mos-contributor");

	if (email) {
		const { data, error: err } = await supabase.from("contributors").select("*").eq("email", email);

		if (err) {
			console.error(err.message);
			throw error(
				500,
				"An unexpected error occurred while loading the page. Kindly refresh and try again."
			);
		}

		if (data.length > 0) {
			const { id, name, email, amount, rewards_claimed } = data[0];
			const contributor: Contributor = { id, name, email, amount, rewardsClaimed: rewards_claimed };

			let videoUrl: string | undefined;
			if (contributor.amount && contributor.amount >= 2000)
				videoUrl = await Rewards.getFileUrl(`mp4/${contributor.id}.mp4`);

			return { loggedIn: true, contributor, videoUrl };
		}
	}

	return { loggedIn: false };
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		try {
			// Get form data
			const formData = await request.formData();

			// Validate existence of email
			const email = formData.get("email") as string;
			if (!email) return fail(400, { message: "Please enter a valid email address" });

			// Get contributor
			const { data, error } = await supabase.from("contributors").select("*").eq("email", email);

			if (error) {
				const { code, message } = error;
				console.error(message);
				return fail(Number(code), { message: "An unknown error occurred. Kindly try again." });
			}

			// If no data returned, return error
			if (data.length === 0)
				return fail(404, { message: "This email does not exist in the database" });

			// If rewards already claimed, return error
			if (data[0].rewards_claimed)
				return fail(403, { message: "Rewards have already been claimed for this user" });

			// CONTENT LOCK CHECKS
			const { id, name, amount, rewards_claimed } = data[0];
			const contributor: Contributor = { id, name, email, amount, rewardsClaimed: rewards_claimed };

			//-/ Supporter and bronze
			if (contributor.amount >= 100 && contributor.amount <= 1999 && Date.now() < 1667509200000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1667509200000).fromNow()}`
				});

			//-/ Silver to platinum
			if (contributor.amount >= 2000 && contributor.amount <= 49999 && Date.now() < 1667250000000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1667250000000).fromNow()}`
				});

			//-/ Executive
			if (contributor.amount >= 50000 && Date.now() < 1666904400000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1666904400000).fromNow()}`
				});

			// Set cookie
			cookies.set("mos-contributor", contributor.email, {
				path: "/contributors",
				expires: new Date(Date.now() + 86400) // next day
			});

			// Return data
			return { loggedIn: true, contributor };
		} catch (err) {
			console.error(err);
			return fail(500, { message: Status.ERROR });
		}
	},

	logout: async ({ cookies }) => {
		try {
			// Delete cookie
			const cookie = cookies.get("mos-contributor");
			if (cookie) cookies.delete("mos-contributor", { path: "/contributors" });

			// Return data
			return { loggedIn: false };
		} catch (err) {
			console.error(err);
			return fail(500, { message: Status.ERROR });
		}
	},

	download: async ({ request }) => {
		// Download rewards
		try {
			// Get form data
			const formData = await request.formData();
			const tier = formData.get("tier") as ContributorTier;

			// Download flows (by tier)
			let downloadObject: ContributorRewardDownload;

			if (tier === "supporter") {
				//-// SUPPORTER
				let id = Number(formData.get("track-select") as string);
				let name = `${tracks[id - 1].filename}.mp3`;

				downloadObject = { file: { name, path: `mp3/${name}` } };
			} else {
				downloadObject = { files: { music: [], commentary: [] } };

				if (tier === "bronze" || tier === "silver") {
					//-// BRONZE AND SILVER
					let checked: number[] = [];
					for (let value of formData.values())
						if (!isNaN(Number(value))) checked.push(Number(value));

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
			return fail(500, { message: Status.ERROR });
		}
	}
};
