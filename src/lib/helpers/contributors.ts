import type { Database } from "$lib/types/database";
import type {
	Contributor,
	ContributorTier,
	ContributorTierInfo,
	ContributorsByTier,
	ContributorRewardInfo,
	ContributorRewardFile,
	ContributorRewardsZipFile
} from "$lib/types/general";
import type { SupabaseClient } from "@supabase/supabase-js";

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from "$env/static/public";

import { createClient } from "@supabase/supabase-js";
import JsFileDownloader from "js-file-downloader";
import JSZip from "jszip";

/* SUPABASE CLIENT */
// This is a workaround for the logic on the Rewards page, as the Supabase client in the server cannot be passed from the page's load function
const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

/* TYPES */
// Copied from js-file-downloader (https://github.com/AleeeKoi/js-file-downloader/blob/master/index.d.ts)
interface JsFileDownloaderBase {
	start(): Promise<void>;
	params: Params;
	link: HTMLAnchorElement;
	request: XMLHttpRequest;
	downloadedFile: null | Blob | File;
	abort(reason: any): void;
}

interface OptionalParams {
	timeout?: number;
	headers?: { name: string; value: string }[];
	forceDesktopMode?: boolean;
	withCredentials?: boolean;
	method?: "GET" | "POST";
	process?: (event: ProgressEvent) => undefined;
	nameCallback?: (name: string) => string;
	autoStart?: boolean;
	filename?: string;
	contentType?: false | string;
	body?: Document | BodyInit | null;
	nativeFallbackOnError?: boolean;
	onloadstart?: () => void;
	contentTypeDetermination?: false | "header" | "signature" | "full";
	customFileSignatures?: { [key: string]: string };
}

type Params = OptionalParams & { url: string };

/* MODULES */
export const List = {
	/**
	 * Returns a formatted object containing lists of the album's crowdfunding contributors by tier.
	 * @param {Object} data - An array of objects, each containing the contributor's `name` and `tier`
	 * @returns {ContributorsByTier} A formatted object with the names of each contributor in each tier
	 */
	getByTier: (data: Database["public"]["Views"]["contributor_names"]["Row"][]): ContributorsByTier => {
		const contributors: ContributorsByTier = {};
		Tiers.list.forEach(({ name: tier }) => {
			if (tier === "supporter") return;
			const list = data.filter(({ tier: t }) => tier === t);
			if (list.length > 0) contributors[tier] = list;
		});

		return contributors;
	}
};

export const Rewards = {
	/**
	 * Downloads a crowdfunding contributor's rewards.
	 * @param {string} [file] - A `RewardFile` object; required if `files` is `undefined`.
	 * @param {string} [files] - A `RewardsZipFile` object; required if `file` is `undefined`
	 * @param {function} [process] - A function that takes an `event` argument and runs when the download makes progress
	 * @returns {Promise<Blob | null>} A Promise that resolves to the file's `Blob` or `null` if the file does not exist
	 */
	download: async (
		file?: ContributorRewardFile,
		files?: ContributorRewardsZipFile,
		process?: (e: ProgressEvent<EventTarget>) => undefined
	): Promise<Blob | null> => {
		if (!file && !files) throw new Error("No file(s) to download");

		let url: string = "";
		let filename: string = "";
		let download: JsFileDownloaderBase | undefined;

		try {
			if (file) {
				const { name, path } = file;
				url = (await Rewards.getFileUrl(path)) as string;
				filename = name;
			} else if (files) {
				url = URL.createObjectURL(await Rewards.generateZipFile(files));
				filename = "mos-rewards.zip";
			}

			download = new JsFileDownloader({ url, process, filename, autoStart: false });
			if (download) await download.start();

			return null;
		} catch (err) {
			console.error(err);
			if (download) download.abort(err);
			throw err;
		} finally {
			if (files && url) URL.revokeObjectURL(url);
		}
	},
	/**
	 * Generates a ZIP file with a given crowdfunding contributor's rewards.
	 * @param {ContributorRewardsZipFile} files - A `RewardsZipFile` object
	 * @returns {Promise<Blob>} A Promise that resolves to the ZIP file's `Blob`
	 */
	generateZipFile: async (files: ContributorRewardsZipFile): Promise<Blob> => {
		try {
			const zip = new JSZip();
			for (const type in files) {
				if (files[type]?.length === 0) continue;
				const folder = zip.folder(type);

				for (const { name, path } of files[type] as ContributorRewardFile[]) {
					const file = await Rewards.getFileBlob(path);
					if (file) folder?.file(name, file);
				}
			}

			return await zip.generateAsync({ type: "blob" });
		} catch (err) {
			console.error(err);
			throw err;
		}
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
	 * Returns a time-limited (one hour) signed URL for a given file in the **rewards** bucket.
	 * @param {string} filePath - The file's path relative to the bucket's root with no leading slash
	 * @param {SupabaseClient<Database>} supabaseClient - The Supabase client; defaults to client in the function's source file
	 * @returns {Promise<string | undefined>} A Promise that resolves to the file's signed URL or `undefined` if the file does not exist
	 */
	getFileUrl: async (filePath: string, supabaseClient: SupabaseClient<Database> = supabase): Promise<string | undefined> => {
		const { data } = await supabaseClient.storage.from("rewards").createSignedUrl(filePath, 3600);
		return data?.signedUrl;
	},
	/**
	 * Returns the appropriate downloadable track format(s) for the album's crowdfunding contributors.
	 * @param {ContributorTier} tier - A `ContributorTier` string
	 * @returns {string} The given tier's downloadable track format(s)
	 */
	getTrackFormat: (tier: ContributorTier): string => `MP3${tier !== "supporter" && tier !== "bronze" ? " or WAV" : ""}`,
	/**
	 * An array of objects with information on the album's crowdfunding contributor rewards, each with the following properties:
	 * - `name` — A string; the reward's name
	 * - `perks` — An array of strings; a list of available perks
	 * - `tiers` — An array of `ContributorTier` strings; tiers for which the reward is available
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
	] as ContributorRewardInfo[]
};

export const Status = {
	DOWNLOAD_NOTICE: "Download inaanza saa hii. Kiasi tu.",
	DOWNLOAD_STARTING: "Ndio hii download imekam…",
	DOWNLOAD_GETTING_FILE: "Getting file…",
	DOWNLOAD_GETTING_ZIP: "Generating ZIP file. This may take a while…",
	HOME_LOADING_ERROR: "An error occurred loading the list of contributors. Kindly refresh the page and try again.",
	LOGGING_OUT: "Ndio kutoka sasa? Haya…"
};

export const Tiers = {
	/**
	 * Returns the given contributor's tier for rewards.
	 * @param {Contributor} contributor - A `contributor` object
	 * @returns {ContributorTier} The given contributor's tier as a string
	 */
	get: ({ amount }: Contributor): ContributorTier => {
		const { name } = Tiers.list.find(({ min, max }) => amount >= min && amount <= max) as ContributorTierInfo;
		return name;
	},
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
