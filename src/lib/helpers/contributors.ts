import type { Contributor, ContributorTier, ContributorsByTier } from "$lib/ambient";

import JSZip from "jszip";
import { supabase } from "../supabaseClient";

/* TYPES */
export interface TierInfo {
	name: ContributorTier;
	min: number;
	max: number;
}

export interface Reward {
	[key: string]: string | string[];
	name: string;
	perks: string[];
	tiers: ContributorTier[];
}

export interface RewardFile {
	[key: string]: string;
	name: string;
	path: string;
}

export interface RewardsZipFile {
	[key: string]: RewardFile[];
	music: RewardFile[];
	commentary: RewardFile[];
}

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
	] as TierInfo[],
	/**
	 * Returns the given contributor's tier for rewards.
	 * @param {Contributor} contributor - A `contributor` object
	 * @returns {ContributorTier} The given contributor's tier as a string
	 */
	get: ({ amount }: Contributor): ContributorTier => {
		const { name } = Tiers.list.find(({ min, max }) => amount >= min && amount <= max) as TierInfo;
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
	 * @returns {ContributorsByTier} A formatted string with the names of the current track's writers
	 */
	getByTier: (data: { name: string; amount: number }[]): ContributorsByTier => {
		const contributors: ContributorsByTier = {};
		Tiers.list.forEach(({ name: tier, min, max }) => {
			contributors[tier] = data.filter(({ amount }) => amount >= min && amount <= max);
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
	] as Reward[],
	/**
	 * Returns the appropriate downloadable track format(s) for the album's crowdfunding contributors.
	 * @param {ContributorTier} tier - A `ContributorTier` string
	 * @returns {string} The given tier's downloadable track format(s)
	 */
	getTrackFormat: (tier: ContributorTier): string =>
		`MP3${tier !== "supporter" && tier !== "bronze" ? " or WAV" : ""}`,
	/**
	 * Returns a limited-time signed URL for a given file in the **rewards** bucket.
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
	 * @param {RewardsZipFile} files - A `RewardsZipFile` object
	 * @returns {Promise<Blob>} A Promise that resolves to the ZIP file's `Blob`
	 */
	generateZipFile: async (files: RewardsZipFile): Promise<Blob> => {
		try {
			let zip = new JSZip();

			for (let type in files) {
				if (files[type]?.length === 0) continue;
				let folder = zip.folder(type);

				for (let { name, path } of files[type] as RewardFile[]) {
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
	 * Downloads a crowdfunding contributor's rewards. Only one of the two parameters must be provided.
	 * @param {string} [file] - A `RewardFile` object
	 * @param {string} [files] - A `RewardsZipFile` object
	 */
	download: async (file?: RewardFile, files?: RewardsZipFile): Promise<void> => {
		if (!file && !files) throw new Error("No file(s) to download");

		let toDownload: Blob | undefined;
		let filename: string | undefined;

		if (file) {
			const { name, path } = file;
			toDownload = (await Rewards.getFileBlob(path)) as Blob;
			filename = name;
		} else if (files) {
			toDownload = await Rewards.generateZipFile(files);
			filename = "mos-rewards.zip";
		}

		if (toDownload && filename) {
			const url = URL.createObjectURL(toDownload);
			const link = document.createElement("a");

			link.download = filename;
			link.href = url;

			link.click();
			URL.revokeObjectURL(url);
		}
	}
};
