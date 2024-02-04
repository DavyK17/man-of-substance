import type {
	Contributor,
	ContributorTier,
	ContributorTierInfo,
	ContributorsByTier,
	ContributorReward,
	ContributorRewardFile,
	ContributorRewardFiles,
	Track,
	TracklistVersion
} from "./ambient";

import JSZip from "jszip";
import { supabase } from "./supabaseClient";

/* HELPERS */
//-- Yes, the helpers have helpers.

/**
 * An array of objects with information on the album's crowdfunding contributor tiers, each with the following properties:
 * - `name` — A `ContributorTier` string
 * - `min` — A number; the given tier's minimum contribution amount
 * - `max` — A number; the given tier's maximum contribution amount
 */
const contributorTiers: ContributorTierInfo[] = [
	{ name: "supporter", min: 0, max: 999 },
	{ name: "bronze", min: 1000, max: 1999 },
	{ name: "silver", min: 2000, max: 3499 },
	{ name: "gold", min: 3500, max: 4999 },
	{ name: "platinum", min: 5000, max: 49999 },
	{ name: "executive", min: 50000, max: Infinity }
];

/**
 * Formats a duration of time in its given unit as a string.
 * @param {string} unit - A unit of time, i.e. `"min"` | `"sec"`
 * @param {number} duration - A duration of time as an integer
 * @returns {string} A formatted string with the given duration of time and its unit, e.g. `"3 seconds"`
 */
const formatRuntimeUnit = (unit: "min" | "sec", duration: number): string =>
	duration === 0
		? ""
		: `${duration} ${unit === "min" ? "minute" : "second"}${duration > 1 ? "s" : ""}`;

/* EXPORTS */

// TRACKS
/**
 * Returns an array of `Track` objects representing a given version of the album's tracklist.
 * @param {Track[]} tracks - An array of `Track` objects
 * @param {TracklistVersion} ver - A `TracklistVersion` string
 * @returns {Track[]} An array of `Track` objects representing the given version of the album's tracklist
 */
export const buildTracklist = (tracks: Track[], ver: TracklistVersion): Track[] => {
	let filtered = tracks;

	if (ver === "expanded")
		filtered = tracks.filter(
			(track) =>
				!track.missingFrom || (track.missingFrom && !track.missingFrom.includes("expanded"))
		);
	else if (ver === "mixtape")
		filtered = tracks.filter(
			(track) => !track.missingFrom || (track.missingFrom && !track.missingFrom.includes("mixtape"))
		);
	else if (ver === "base") filtered = tracks.filter((track) => !track.missingFrom);

	return filtered.map((item, i) => ({ ...item, id: i + 1 }));
};

/**
 * Returns an array of `Track` objects representing a given section of the album's tracklist.
 * @param {Track[]} tracklist - An array of `Track` objects
 * @param {TracklistVersion} ver - A `TracklistVersion` string
 * @param {number} n - A tracklist part number, i.e. `1` | `2` | `3`
 * @returns {Track[]} An array of `Track` objects representing part `n` of the album's tracklist
 */
export const getTracklistPart = (
	tracklist: Track[],
	ver: TracklistVersion,
	n: 1 | 2 | 3
): Track[] => {
	let first = -1;
	let last = -1;

	if (n === 1) {
		if (ver === "full" || ver === "expanded") last = 7;
		if (ver === "mixtape" || ver === "base") last = 5;
		return tracklist.filter((track) => track.id <= last);
	}

	if (n === 2) {
		if (ver === "full" || ver === "expanded") {
			first = 8;
			last = 14;
		}
		if (ver === "mixtape" || ver === "base") {
			first = 6;
			last = 10;
		}
		return tracklist.filter((track) => track.id >= first && track.id <= last);
	}

	if (n === 3) {
		if (ver === "expanded" || ver === "base") return [];
		if (ver === "full") first = 15;
		if (ver === "mixtape") first = 11;
		return tracklist.filter((track) => track.id >= first);
	}

	return [];
};

/**
 * Formats a list of the current track's writers as a string.
 * @param {Track} current - A `Track` object
 * @returns {string} A formatted string with the names of the current track's writers
 */
export const displayWriters = ({ credits: { writers } }: Track): string => {
	if (writers.length === 1) return writers.join("");
	if (writers.length === 2) return writers.join(" and ");

	const arr = writers.slice();
	const last = arr.pop();
	return arr.join(", ") + " and " + last;
};

/**
 * Formats the current track's runtime in minutes and seconds as a string.
 * @param {Track} current - A `Track` object
 * @returns {string} A formatted string with the names of the current track's writers
 */
export const displayRuntime = ({ runtime }: Track): string => {
	const min = Math.floor(runtime / 60);
	const sec = runtime % 60;
	const and = min === 0 || sec === 0 ? "" : " and ";

	return formatRuntimeUnit("min", min) + and + formatRuntimeUnit("sec", sec);
};

// CONTRIBUTORS
/**
 * Returns the given contributor's tier for rewards.
 * @param {Contributor} contributor - A `contributor` object
 * @returns {ContributorTier} The given contributor's tier as a string
 */
export const getContributorTier = ({ amount }: Contributor): ContributorTier => {
	const { name } = contributorTiers.find(
		({ min, max }) => amount >= min && amount <= max
	) as ContributorTierInfo;

	return name;
};

/**
 * Returns a formatted object containing lists of the album's crowdfunding contributors by tier.
 * @param {Object} data - An array of objects, each containing the contributor's `name` and `amount`
 * @returns {ContributorsByTier} A formatted string with the names of the current track's writers
 */
export const getContributorsByTier = (
	data: { name: string; amount: number }[]
): ContributorsByTier => {
	const contributors: ContributorsByTier = {};
	contributorTiers.forEach(({ name: tier, min, max }) => {
		contributors[tier] = data.filter(({ amount }) => amount >= min && amount <= max);
	});

	return contributors;
};

/**
 * Returns the maximum number of tracks that a **bronze** or **silver** contributor can download.
 * @param {ContributorTier} tier - A valid `ContributorTier` string, i.e. `"bronze"` | `"silver"`
 * @returns {number} The maximum number of downloadable tracks, or `-1` with invalid input
 */
export const getMaxTracksForTier = (tier: ContributorTier): number => {
	if (tier === "bronze") return 3;
	if (tier === "silver") return 5;
	return -1;
};

/**
 * An array of objects with information on the album's crowdfunding contributor rewards, each with the following properties:
 * - `name` — A string; the reward's name
 * - `perks` — An array of strings; a list of available perks
 * - `tiers` — An array of `ContributorTier` strings; the tiers for which the reward is available
 */
export const contributorRewards: ContributorReward[] = [
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
];

/**
 * Returns the appropriate downloadable track format(s) for the album's crowdfunding contributors.
 * @param {ContributorTier} tier - A `ContributorTier` string
 * @returns {string} The given tier's downloadable track format(s)
 */
export const getTrackFormat = (tier: ContributorTier): string =>
	`MP3${tier !== "supporter" && tier !== "bronze" ? " or WAV" : ""}`;

/**
 * Returns a limited-time signed URL for a given file in the **rewards** bucket.
 * @param {string} filePath - The file's path relative to the bucket's root with no leading slash
 * @returns {Promise<string | undefined>} A Promise that resolves to the file's signed URL or `undefined` if the file does not exist
 */
export const getFileUrl = async (filePath: string): Promise<string | undefined> => {
	const { data } = await supabase.storage.from("rewards").createSignedUrl(filePath, 3600);
	return data?.signedUrl;
};

/**
 * Returns a `Blob` for a given file in the **rewards** bucket.
 * @param {string} filePath - The file's path relative to the bucket's root with no leading slash
 * @returns {Promise<Blob | undefined>} A Promise that resolves to the file's `Blob` or `null` if the file does not exist
 */
export const getFileBlob = async (filePath: string): Promise<Blob | null> => {
	const { data, error } = await supabase.storage.from("rewards").download(filePath);
	if (error) throw new Error(error.message);
	return data;
};

/**
 * Creates a ZIP file with a crowdfunding contributor's rewards.
 * @param {ContributorRewardFiles} files - A `ContributorRewardFiles` object
 * @returns {Promise<Blob>} A Promise that resolves to the ZIP file's `Blob`
 */
export const createZip = async (files: ContributorRewardFiles): Promise<Blob> => {
	try {
		let zip = new JSZip();

		for (let type in files) {
			if (files[type]?.length === 0) continue;
			let folder = zip.folder(type);

			for (let { name, path } of files[type] as ContributorRewardFile[]) {
				let file = await getFileBlob(path);
				if (file) folder?.file(name, file);
			}
		}

		return await zip.generateAsync({ type: "blob" });
	} catch (err) {
		throw err;
	}
};

/**
 * Downloads a crowdfunding contributor's rewards as a ZIP file. Only one of the two parameters must be provided.
 * @param {string} [file] - A `ContributorRewardFile` object
 * @param {string} [files] - A `ContributorRewardFiles` object
 */
export const downloadRewards = async (
	file?: ContributorRewardFile,
	files?: ContributorRewardFiles
): Promise<void> => {
	if (!file && !files) throw new Error("No file(s) to download");

	let toDownload: Blob | undefined;
	let filename: string | undefined;

	if (file) {
		const { name, path } = file;
		toDownload = (await getFileBlob(path)) as Blob;
		filename = name;
	} else if (files) {
		toDownload = await createZip(files);
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
};
