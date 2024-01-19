import type { PageServerLoad, Actions } from "./$types";
import type { Contributor, ContributorRewardFile, ContributorTier } from "$lib/ambient";

import { error, fail } from "@sveltejs/kit";
import { signIn, signOut } from "aws-amplify/auth";
import { isCancelError } from "aws-amplify/storage";
import moment from "moment";

import {
	serverUrl,
	formatResponseMessage,
	getMaxTracksForTier,
	createDownloadTask
} from "$lib/helpers";
import { AWS_USERNAME, AWS_PASSWORD } from "$env/static/private";

import { tracks } from "$lib/data.json";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const email = cookies.get("mos-contributor");
	if (email) {
		try {
			const contributor: Contributor = await (
				await fetch(`${serverUrl}/contributor?email=${email}`)
			).json();
			return { loggedIn: true, contributor };
		} catch (err) {
			console.error(err);
			throw error(
				500,
				"An unexpected error occurred while loading the page. Kindly refresh and try again."
			);
		}
	}

	return { loggedIn: false };
};

export const actions: Actions = {
	login: async ({ request, fetch, cookies }) => {
		try {
			// Get form data
			const data = await request.formData();

			// Validate existence of email
			const email = data.get("email") as string;
			if (!email) return fail(400, { message: "Please enter a valid email address" });

			// Get contributor
			const response = await fetch(`${serverUrl}/contributors?email=${email}`);
			if (response.status !== 200)
				return fail(response.status, { message: "This email does not exist in the database" });

			const contributor: Contributor = await response.json();

			// If rewards already claimed, return error
			if (contributor.rewardsClaimed)
				return fail(403, { message: "Rewards have already been claimed for this user" });

			// CONTENT LOCK CHECKS
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

			// Attempt login
			await signIn({ username: AWS_USERNAME, password: AWS_PASSWORD });

			// Set cookie
			cookies.set("mos-contributor", contributor.email, {
				path: "/contributors",
				expires: new Date(Date.now() + 86400) // next day
			});

			// Return data
			return { loggedIn: true, contributor };
		} catch (err) {
			console.error(err);
			return fail(500, { message: "An unknown error occurred. Kindly try again." });
		}
	},

	logout: async ({ cookies }) => {
		try {
			// Attempt logout
			await signOut();

			// Delete cookie
			const cookie = cookies.get("mos-contributor");
			if (cookie) cookies.delete("mos-contributor", { path: "/contributors" });

			// Return data
			return { loggedIn: false };
		} catch (err) {
			console.error(err);
			return fail(500, { message: "An unknown error occurred. Kindly try again." });
		}
	},

	claim: async ({ request, fetch, cookies }) => {
		// Initialise responses
		const responses = ["Wazi champ", "Fiti mkuu", "Safi kiongos"];

		// Download rewards
		try {
			// Get form data
			const data = await request.formData();
			const tier = data.get("tier") as ContributorTier;

			// Download flows (by tier)
			if (tier === "supporter") {
				//-// SUPPORTER
				let id = Number(data.get("track-select") as string);
				let filename = tracks[id - 1].filename + ".mp3";
				let key = "mp3/" + filename;

				await createDownloadTask(key).result;
			} else if (tier === "bronze" || tier === "silver") {
				//-// BRONZE AND SILVER
				let checked: number[] = [];
				for (let value of data.values()) if (!isNaN(Number(value))) checked.push(Number(value));

				let remaining = getMaxTracksForTier(tier) - checked.length;
				if (remaining > 0)
					return fail(400, {
						message: `Kindly select ${remaining} ${remaining === 5 ? " " : "more "}${
							remaining === 1 ? "song" : "songs"
						} to download.`
					});

				let format = data.get("format-select") as string;
				if (!format)
					return fail(400, {
						message: "Kindly select a file format"
					});

				let files: ContributorRewardFile[] = [];
				checked.map((id) => {
					let filename = `${tracks[id - 1].filename}.${tier === "silver" ? format : "mp3"}`;
					let key = `${tier === "silver" ? format : "mp3"}/${filename}`;
					files.push({ filename, key });
				});

				// TODO: Create and download ZIP
				console.log(files);
			} else if (tier === "gold") {
				//-// GOLD
				let files: ContributorRewardFile[] = [];
				let format = data.get("format-select") as string;

				tracks.map((track) => {
					let filename = track.filename + `.${format}`;
					let key = `${format}/` + filename;
					files.push({ filename, key });
				});

				// TODO: Create and download ZIP
				console.log(files);
			} else if (tier === "platinum" || tier === "executive") {
				//-// PLATINUM AND EXECUTIVE
				let files: { music: ContributorRewardFile[]; commentary: ContributorRewardFile[] } = {
					music: [],
					commentary: []
				};

				let { music, commentary } = files;
				let format = data.get("format-select") as string;

				tracks.map((track) => {
					let filename = track.filename + `.${format}`;
					let key = `${format}/` + filename;
					music.push({ filename, key });

					filename = track.filename + ".m4a";
					key = "m4a/" + filename;
					return commentary.push({ filename, key });
				});

				// TODO: Create and download ZIP
				console.log(files);
			}

			// // Claim rewards in database
			// const email = data.get("email") as string;
			// const response = await fetch(`${serverUrl}/contributors?email=${email}`, { method: "POST" });

			// // Return error if status code is not 200
			// if (response.status !== 200)
			// 	return fail(response.status, {
			// 		message: formatResponseMessage(await response.text())
			// 	});

			// // Attempt logout
			// await signOut();

			// // Delete cookie
			// const cookie = cookies.get("mos-contributor");
			// if (cookie) cookies.delete("mos-contributor", { path: "/contributors" });

			// Return data
			return { message: responses[Math.floor(Math.random() * responses.length)] };
		} catch (err) {
			console.error(err);
			return fail(500, {
				message: isCancelError(err) ? err.message : "An unknown error occurred. Kindly try again."
			});
		}
	}
};
