import type { PostgrestError } from "@supabase/supabase-js";
import type {
	Contributor,
	ContributorTier,
	ContributorTierInfo,
	ContributorsByTier,
	ContributorRewardInfo,
	ContributorRewardFile,
	ContributorRewardsZipFile
} from "$lib/ambient";

import JSZip from "jszip";
import { supabase } from "../supabaseClient";

/* MODULES */
export const Tiers = {
	/**
	 * An array of objects with information on the album's crowdfunding contributor tiers, each with the following properties:
	 * - `name` — A `ContributorTier` string
	 * - `min` — A number; the given tier's minimum contribution amount
	 * - `max` — A number; the given tier's maximum contribution amount
	 */
	list: [
		{ name: "supporter", min: 0, max: 999 },
		{ name: "bronze", min: 1000, max: 1999 },
		{ name: "silver", min: 2000, max: 3499 },
		{ name: "gold", min: 3500, max: 4999 },
		{ name: "platinum", min: 5000, max: 49999 },
		{ name: "executive", min: 50000, max: Infinity }
	] as ContributorTierInfo[],
	/**
	 * Returns the given contributor's tier for rewards.
	 * @param {Contributor} contributor - A `contributor` object
	 * @returns {ContributorTier} The given contributor's tier as a string
	 */
	get: ({ amount }: Contributor): ContributorTier => {
		const { name } = Tiers.list.find(
			({ min, max }) => amount >= min && amount <= max
		) as ContributorTierInfo;
		return name;
	},
	/**
	 * Returns the maximum number of tracks that a **bronze** or **silver** contributor can download.
	 * @param {ContributorTier} tier - A valid `ContributorTier` string, i.e. `"bronze"` | `"silver"`
	 * @returns {number} The maximum number of downloadable tracks, or `-1` with invalid input
	 */
	maxTracks: (tier: ContributorTier): number => {
		if (tier === "bronze") return 3;
		if (tier === "silver") return 5;
		return -1;
	}
};

export const List = {
	/**
	 * Returns a formatted object containing lists of the album's crowdfunding contributors by tier.
	 * @param {Object} data - An array of objects, each containing the contributor's `name` and `amount`
	 * @param {boolean} [forPage=true] - A boolean indicating whether the data is for the Contributors intro page
	 * @returns {ContributorsByTier} A formatted string with the names of the current track's writers
	 */
	getByTier: (
		data: { name: string; amount: number }[],
		forPage: boolean = true
	): ContributorsByTier => {
		const contributors: ContributorsByTier = {};
		Tiers.list.forEach(({ name: tier, min, max }) => {
			if (forPage) if (tier === "supporter") return;

			const list = data.filter(({ amount }) => amount >= min && amount <= max);
			if (list.length > 0) contributors[tier] = list;
		});

		return contributors;
	}
};

export const Rewards = {
	/**
	 * An array of objects with information on the album's crowdfunding contributor rewards, each with the following properties:
	 * - `name` — A string; the reward's name
	 * - `perks` — An array of strings; a list of available perks
	 * - `tiers` — An array of `ContributorTier` strings; the tiers for which the reward is available
	 */
	list: [
		{
			name: "Single track",
			perks: ["One track of your choice"],
			tiers: ["supporter"]
		},
		{
			name: "Triple pack",
			perks: ["3 tracks of your choice"],
			tiers: ["bronze"]
		},
		{
			name: "Personalised pack",
			perks: ['Personalised "thank you" video (shown above)', "5 tracks of your choice"],
			tiers: ["silver", "gold", "platinum", "executive"]
		},
		{
			name: "Early bird download",
			perks: ["Full album"],
			tiers: ["gold", "platinum", "executive"]
		},
		{
			name: "Project commentary",
			perks: [
				"Album concept",
				"Subject matter",
				"Production",
				"Videography (where applicable)",
				"Potentially obscure lyrics"
			],
			tiers: ["platinum", "executive"]
		},
		{
			name: "Executive producer credit",
			perks: [
				"Executive producer credit",
				"Special mention in the project commentary",
				"Exclusive online album listening session",
				"Signed physical copy of the album"
			],
			tiers: ["executive"]
		}
	] as ContributorRewardInfo[],
	/**
	 * Returns the appropriate downloadable track format(s) for the album's crowdfunding contributors.
	 * @param {ContributorTier} tier - A `ContributorTier` string
	 * @returns {string} The given tier's downloadable track format(s)
	 */
	getTrackFormat: (tier: ContributorTier): string =>
		`MP3${tier !== "supporter" && tier !== "bronze" ? " or WAV" : ""}`,
	/**
	 * Returns a time-limited (one hour) signed URL for a given file in the **rewards** bucket.
	 * @param {string} filePath - The file's path relative to the bucket's root with no leading slash
	 * @returns {Promise<string | undefined>} A Promise that resolves to the file's signed URL or `undefined` if the file does not exist
	 */
	getFileUrl: async (filePath: string): Promise<string | undefined> => {
		const { data } = await supabase.storage.from("rewards").createSignedUrl(filePath, 3600);
		return data?.signedUrl;
	},
	/**
	 * Returns a `Blob` for a given file in the **rewards** bucket.
	 * @param {string} filePath - The file's path relative to the bucket's root with no leading slash
	 * @returns {Promise<Blob | undefined>} A Promise that resolves to the file's `Blob` or `null` if the file does not exist
	 */
	getFileBlob: async (filePath: string): Promise<Blob | null> => {
		const { data, error } = await supabase.storage.from("rewards").download(filePath);
		if (error) throw new Error(error.message);
		return data;
	},
	/**
	 * Generates a ZIP file with a given crowdfunding contributor's rewards.
	 * @param {ContributorRewardsZipFile} files - A `RewardsZipFile` object
	 * @returns {Promise<Blob>} A Promise that resolves to the ZIP file's `Blob`
	 */
	generateZipFile: async (files: ContributorRewardsZipFile): Promise<Blob> => {
		try {
			let zip = new JSZip();

			for (let type in files) {
				if (files[type]?.length === 0) continue;
				let folder = zip.folder(type);

				for (let { name, path } of files[type] as ContributorRewardFile[]) {
					let file = await Rewards.getFileBlob(path);
					if (file) folder?.file(name, file);
				}
			}

			return await zip.generateAsync({ type: "blob" });
		} catch (err) {
			throw err;
		}
	},
	/**
	 * Marks the crowdfunding contributor's rewards as claimed on the database.
	 * @param {string} [email] - The contributor's email address
	 * @returns {Promise<Object>} An object with a boolean `success` property and, if any, an `error` property with a `PostgrestError` object
	 */
	finishClaim: async (email: string): Promise<{ success: boolean; error?: PostgrestError }> => {
		const { error } = await supabase
			.from("contributors")
			.update({ rewards_claimed: true })
			.eq("email", email);

		return { success: !error, error: error ?? undefined };
	}
};

export const Status = {
	CLAIMING_REWARDS: "Updating database…",
	DOWNLOAD_NOTICE: "Download inaanza saa hii. Kiasi tu.",
	DOWNLOAD_STARTING: "Ndio hii download imekam…",
	DOWNLOAD_GETTING_FILE: "Getting file…",
	DOWNLOAD_GETTING_ZIP: "Generating ZIP file. This may take a while…",
	HOME_LOADING_ERROR:
		"An error occurred loading the list of contributors. Kindly refresh the page and try again.",
	LOGGING_OUT: "Ndio kutoka sasa? Haya…"
};
