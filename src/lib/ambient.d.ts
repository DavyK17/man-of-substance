import type { RewardFile, RewardsZipFile } from "./helpers/contributors";

// Home
export interface AlbumCoverInfo {
	default: string;
	fallback: string;
};

// Credits
export interface Credits {
	[key: string]: string[] | string;
	execProducers: string[];
	photography: string[];
	styling: string[];
	artwork: string[];
	trailer: string[];
	visualiser: string[];
	website: string[];
	copyright: string;
}

// Tracks
export type TracklistVersion = "base" | "mixtape" | "expanded" | "full";
export type TrackInfoVersion = "synopsis" | "lyrics" | "credits";

export interface Track {
	[key: string]: any;
	id: number;
	title: string;
	filename: string;
	runtime: number;
	style: string[];
	synopsis: string;
	lyrics: string;
	credits: TrackCredits;
	missingFrom?: TracklistVersion[];
}

export interface TrackCredits {
	[key: string]: any[];
	writers: string[];
	featuring?: Array<string[] | string>;
	producers: string[];
	arrangement?: string[];
	additionalProducers?: string[];
	additionalVocals?: string[];
	guitar?: string[];
	mixMaster: string[];
	recorded: { studio: string; city: string }[];
	samples?: { title: string; info: string }[];
	interpolates?: { title: string; info: string }[];
}

// Contributors
export interface Contributor {
	[key: string]: any;
	id: number;
	name: string;
	email: string;
	amount: number;
	rewardsClaimed: boolean;
}

export type ContributorTier = "supporter" | "bronze" | "silver" | "gold" | "platinum" | "executive";

export interface ContributorsByTier {
	[key: string]: { name: string }[];
	[key in ContributorTier]: { name: string }[];
};

export interface ContributorRewardDownload {
	file?: RewardFile;
	files?: RewardsZipFile;
};
