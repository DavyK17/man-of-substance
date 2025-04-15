/* GENERAL */
export interface AlbumCoverInfo {
	default: string;
	fallback: string;
}

export interface CustomError {
	code: number;
	message: string;
}

export interface NavMenuItem {
	title: string;
	slug: string;
}

/* CONTRIBUTORS */
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
}

export interface ContributorRewardInfo {
	[key: string]: string | string[];
	name: string;
	perks: string[];
	tiers: ContributorTier[];
}

export interface ContributorRewardFile {
	[key: string]: string;
	name: string;
	path: string;
}

export interface ContributorRewardsZipFile {
	[key: string]: ContributorRewardFile[];
	music: ContributorRewardFile[];
	commentary: ContributorRewardFile[];
}

export interface ContributorRewardDownload {
	[key: string]: ContributorRewardFile | ContributorRewardsZipFile | undefined;
	file?: ContributorRewardFile;
	files?: ContributorRewardsZipFile;
}

/* TRACKS */
export type TracklistVersion = "base" | "mixtape" | "expanded" | "full";

export type TrackInfoVersion = "synopsis" | "lyrics" | "credits";

export interface TracklistDataItem {
	[key: string]: any;
	id: number;
	synopsis: string;
	lyrics: string;
	credits: TrackCredits;
}

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
	[key: string]: any[] | any;
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

export type TrackCreditKey = keyof TrackCredits;

export interface TrackCreditTitles {
	[key: string]: string;
	[key in TrackCreditKey]: string;
}

export interface MockTrack {
	[key: string]: any;
	id: number;
	runtime: number;
	credits: { writers: string[] };
	missingFrom?: TracklistVersion[];
}

/* CREDITS */
export interface AlbumCredits {
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

export type AlbumCreditKey = keyof AlbumCredits;

export interface AlbumCreditTitles {
	[key: string]: string;
	[key in AlbumCreditKey]: string;
}
