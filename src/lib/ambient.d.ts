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
export interface ContributorTierInfo {
	name: ContributorTier;
	min: number;
	max: number;
}

export interface ContributorsByTier {
	[key: string]: { name: string }[];
	[key in ContributorTier]: { name: string }[];
};

export interface ContributorReward {
	[key: string]: string | string[];
	name: string;
	perks: string[];
	tiers: ContributorTier[];
};

export interface ContributorRewardFile {
	[key: string]: string;
	name: string;
	path: string;
};

export interface ContributorRewardFiles {
	[key: string]: ContributorRewardFile[];
	music: ContributorRewardFile[];
	commentary: ContributorRewardFile[];
};

export interface ContributorRewardDownload {
	file?: ContributorRewardFile;
	files?: ContributorRewardFiles;
};
