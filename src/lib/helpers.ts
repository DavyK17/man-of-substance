import type { DownloadDataOutput, TransferProgressEvent } from "aws-amplify/storage";
import type {
	Track,
	TracklistVersion,
	Contributor,
	ContributorTier,
	ContributorReward
} from "./ambient";

import { downloadData } from "aws-amplify/storage";

import { dev } from "$app/environment";
import { PUBLIC_TARGET_ENV } from "$env/static/public";

// Server URL
export const serverUrl = `${
	dev
		? "http://localhost:8000"
		: PUBLIC_TARGET_ENV === "staging"
			? "https://server-test.mos.davykamanzi.com"
			: "https://server.mos.davykamanzi.com"
}/api`;

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
export const getContributorTier = ({ amount }: Contributor): ContributorTier => {
	if (amount >= 50000) return "executive";
	if (amount >= 5000) return "platinum";
	if (amount >= 3500) return "gold";
	if (amount >= 2000) return "silver";
	if (amount >= 1000) return "bronze";
	return "supporter";
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

export const createDownloadTask = (
	key: string,
	progressCallback: (event: TransferProgressEvent) => any
): DownloadDataOutput =>
	downloadData({
		key,
		options: {
			accessLevel: "guest",
			onProgress: (event) => progressCallback(event)
		}
	});
