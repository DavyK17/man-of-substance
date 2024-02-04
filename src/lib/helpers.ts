import type {
	Track,
	TracklistVersion,
	Contributors,
	Contributor,
	ContributorTier,
	ContributorReward,
	ContributorRewardFile,
	ContributorRewardFiles
} from "./ambient";

import JSZip from "jszip";
import { supabase } from "./supabaseClient";

// TRACKS
export const getTracklistPart = (tracklist: Track[], ver: TracklistVersion, n: 1 | 2 | 3) => {
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

export const displayWriters = (current: Track): string => {
	if (current.credits.writers.length === 1) return current.credits.writers.join("");
	if (current.credits.writers.length === 2) return current.credits.writers.join(" and ");

	const arr = current.credits.writers.slice();
	const last = arr.pop();
	return arr.join(", ") + " and " + last;
};

export const displayRuntime = (time: number): string => {
	const min = Math.floor(time / 60);
	const sec = time % 60;
	const and = min === 0 || sec === 0 ? "" : " and ";

	const display = (unit: "min" | "sec", time: number) => {
		if (time === 0) return "";

		const pluraliser = () => {
			let label;
			switch (unit) {
				case "min":
					label = time > 1 ? "minutes" : "minute";
					break;
				case "sec":
					label = time > 1 ? "seconds" : "second";
					break;
				default:
					label = undefined;
			}

			return label;
		};

		return `${time} ${pluraliser()}`;
	};

	return `${display("min", min)}${and}${display("sec", sec)}`;
};

// CHALLENGE
export const formatResponseMessage = (message: string): string => {
	if (message.includes("undefined") || message === "An unknown error occurred. Kindly try again.") {
		// Display generic error message
		return "An unknown error occurred. Kindly try again.";
	} else if (message.includes("Error: ")) {
		// Remove "Error: " from error message
		let arr = message.split(" ");
		arr.shift();
		message = arr.join(" ");
	}

	// Return message
	return message;
};

// CONTRIBUTORS
const contributorTiers: { name: ContributorTier; min: number; max: number }[] = [
	{ name: "supporter", min: 0, max: 999 },
	{ name: "bronze", min: 1000, max: 1999 },
	{ name: "silver", min: 2000, max: 3499 },
	{ name: "gold", min: 3500, max: 4999 },
	{ name: "platinum", min: 5000, max: 49999 },
	{ name: "executive", min: 50000, max: Infinity }
];

export const getContributors = (data: { name: string; amount: number }[]) => {
	const contributors: Contributors = {};
	contributorTiers.forEach((tier) => {
		contributors[tier.name] = data.filter(
			(contributor) => contributor.amount >= tier.min && contributor.amount <= tier.max
		);
	});
	return contributors;
};

export const getContributorTier = ({ amount }: Contributor): ContributorTier => {
	const tier = contributorTiers.find(({ min, max }) => amount >= min && amount <= max);
	return tier?.name as ContributorTier;
};

export const getMaxTracksForTier = (tier: ContributorTier): number => {
	if (tier === "bronze") return 3;
	if (tier === "silver") return 5;
	return -1;
};

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

export const getTrackFormat = (tier: ContributorTier): string =>
	`MP3${tier !== "supporter" && tier !== "bronze" ? " or WAV" : ""}`;

export const getFileUrl = async (filePath: string): Promise<string | undefined> => {
	const { data } = await supabase.storage.from("rewards").createSignedUrl(filePath, 3600);
	return data?.signedUrl;
};

export const downloadFile = async (filePath: string): Promise<Blob | null> => {
	const { data, error } = await supabase.storage.from("rewards").download(filePath);
	if (error) throw new Error(error.message);
	return data;
};

export const createZip = async (files: ContributorRewardFiles): Promise<Blob> => {
	try {
		let zip = new JSZip();

		for (let type in files) {
			if (files[type]?.length === 0) continue;
			let folder = zip.folder(type);

			for (let { name, path } of files[type] as ContributorRewardFile[]) {
				let file = await downloadFile(path);
				if (file) folder?.file(name, file);
			}
		}

		return await zip.generateAsync({ type: "blob" });
	} catch (err) {
		throw err;
	}
};

export const downloadRewards = async (
	file?: ContributorRewardFile,
	files?: ContributorRewardFiles
): Promise<void> => {
	let toDownload: Blob | undefined;
	let filename: string | undefined;

	if (file) {
		const { name, path } = file;
		toDownload = (await downloadFile(path)) as Blob;
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
