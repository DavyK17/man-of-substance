// place files you want to import through the `$lib` alias in this folder.
export type Track = {
	id: number;
	title: string;
	filename: string;
	runtime: number;
	style: string[];
	synopsis: string;
	lyrics: string;
	credits: {
		writers: string[];
		featuring: string[];
		producers: string[];
		arrangement: string[];
		guitar: string[];
		additionalProducers: string[];
		additionalVocals: string[];
		mixMaster: string[];
		samples: { title: string; info: string }[];
		interpolates: { title: string; info: string }[];
		recorded: { studio: string; city: string }[];
	};
	missingFrom: string[];
};
