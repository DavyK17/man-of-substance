// place files you want to import through the `$lib` alias in this folder.
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
	missingFrom?: TracklistVersions[];
}

export interface TrackCredits {
	[key: string]: any;
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

export type TracklistVersions = "base" | "mixtape" | "expanded" | "full";
