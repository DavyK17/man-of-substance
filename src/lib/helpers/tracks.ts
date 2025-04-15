import type {
	MockTrack,
	Track,
	TracklistDataItem,
	TracklistVersion,
	TrackCreditKey,
	TrackCreditTitles
} from "$lib/types/general";
import { tracks as rawTracks } from "$lib/data.json";

/* MODULES */
export const List = {
	/**
	 * Returns an array of `Track` objects representing a given version of the album's tracklist.
	 * @param {Track[]} tracks - An array of `Track` objects
	 * @param {TracklistVersion} ver - A `TracklistVersion` string
	 * @returns {Track[]} An array of `Track` objects representing the given version of the album's tracklist
	 */
	build: (tracks: Track[], ver: TracklistVersion): Track[] => {
		let filtered = tracks;

		if (ver === "expanded")
			filtered = tracks.filter(
				(track) => !track.missingFrom || (track.missingFrom && !track.missingFrom.includes("expanded"))
			);
		else if (ver === "mixtape")
			filtered = tracks.filter(
				(track) => !track.missingFrom || (track.missingFrom && !track.missingFrom.includes("mixtape"))
			);
		else if (ver === "base") filtered = tracks.filter((track) => !track.missingFrom);

		return filtered.map((item, i) => ({ ...item, id: i + 1 }));
	},
	/**
	 * The album's tracklist data, each item containing the following properties:
	 * - `id` - The track number
	 * - `synopsis` - The track's synopsis in HTML
	 * - `lyrics` - The track's lyrics in HTML
	 * - `credits` - The track's credits as a `TrackCredits` object
	 */
	data: rawTracks as TracklistDataItem[],
	/**
	 * Returns an array of `Track` objects representing a given section of the album's tracklist.
	 * @param {Track[]} tracklist - An array of `Track` objects
	 * @param {TracklistVersion} ver - A `TracklistVersion` string
	 * @param {number} n - A tracklist part number, i.e. `1` | `2` | `3`
	 * @returns {Track[]} An array of `Track` objects representing part `n` of the album's tracklist
	 */
	getPart: (tracklist: Track[], ver: TracklistVersion, n: 1 | 2 | 3): Track[] => {
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
	},
	/**
	 * A mock of the album's tracklist data to be used for testing, each item containing the following properties:
	 * - `id` - The track number
	 * - `runtime` - The track's runtime in seconds
	 * - `credits` - The track's credits, only containing the track's `writers`
	 */
	mockData: [
		{
			id: 1,
			runtime: 64,
			credits: {
				writers: ["Davy Kamanzi", "Ariane Uwizera", "Sidney Kamanzi"]
			}
		},
		{
			id: 2,
			runtime: 291,
			credits: {
				writers: ["Davy Kamanzi", "Daryl Kimani", "Stephen Otieno Mak", "Emmanuel Kisiangani"]
			}
		},
		{
			id: 3,
			runtime: 241,
			credits: {
				writers: ["Davy Kamanzi", "Dagi Philip Noel"]
			},
			missingFrom: ["mixtape", "base"]
		},
		{
			id: 4,
			runtime: 180,
			credits: {
				writers: ["Davy Kamanzi", "Kevin Midonzi", "Alex Niragira"]
			}
		},
		{
			id: 5,
			runtime: 150,
			credits: {
				writers: ["Davy Kamanzi", "Andrew Haines", "Kevin Midonzi", "Alex Niragira"]
			},
			missingFrom: ["mixtape", "base"]
		},
		{
			id: 6,
			runtime: 196,
			credits: {
				writers: ["Davy Kamanzi", "Luca Urbaniak"]
			}
		},
		{
			id: 7,
			runtime: 212,
			credits: {
				writers: ["Davy Kamanzi", "Luca Urbaniak"]
			}
		},
		{
			id: 8,
			runtime: 189,
			credits: {
				writers: ["Davy Kamanzi", "Luca Urbaniak", "Amandeep Jagde"]
			}
		},
		{
			id: 9,
			runtime: 215,
			credits: {
				writers: ["Davy Kamanzi", "Malik Atterbury", "Fidel Nigel Owuor", "Kenneth Mbova Jr."]
			},
			missingFrom: ["mixtape", "base"]
		},
		{
			id: 10,
			runtime: 168,
			credits: {
				writers: ["Davy Kamanzi", "Andrew Haines", "Brian Haines"]
			}
		},
		{
			id: 11,
			runtime: 207,
			credits: {
				writers: ["Davy Kamanzi", "Michael Chepkwony", "Andrew Haines", "Jeremy Maina"]
			}
		},
		{
			id: 12,
			runtime: 216,
			credits: {
				writers: ["Davy Kamanzi", "Suksan Salarak", "Andrew Haines"]
			}
		},
		{
			id: 13,
			runtime: 209,
			credits: {
				writers: ["Davy Kamanzi", "James Mutunga", "Joan Nyabaro"]
			},
			missingFrom: ["mixtape", "base"]
		},
		{
			id: 14,
			runtime: 174,
			credits: {
				writers: ["Davy Kamanzi", "Daryl Kimani", "Benson Theuri", "Andrew Haines"]
			}
		},
		{
			id: 15,
			runtime: 140,
			credits: {
				writers: ["Davy Kamanzi", "Jhonny Leandro Sandoval Cardona", "Stephen Otieno Mak"]
			},
			missingFrom: ["expanded", "base"]
		},
		{
			id: 16,
			runtime: 165,
			credits: {
				writers: ["Davy Kamanzi", "Onuche Samuel Ogboji"]
			},
			missingFrom: ["expanded", "base"]
		},
		{
			id: 17,
			runtime: 204,
			credits: {
				writers: ["Davy Kamanzi", "Kevin Midonzi", "Alex Niragira", "Don Dulo", "Daryl Kimani"]
			},
			missingFrom: ["expanded", "mixtape", "base"]
		}
	] as MockTrack[]
};

export const Page = {
	/**
	 * An object with credit titles as values for each corresponding key in `TrackCredits`.
	 */
	creditTitles: {
		featuring: "Featuring",
		producers: "Producer",
		arrangement: "Arrangement",
		guitar: "Guitar",
		additionalProducers: "Additional producer",
		additionalVocals: "Additional vocals",
		mixMaster: "Mixing and mastering",
		recorded: "Recorded at",
		interpolates: "Interpolates",
		samples: "Samples"
	} as TrackCreditTitles,
	/**
	 * Formats the current track's runtime in minutes and seconds as a string.
	 * @param {Track} current - A `Track` object
	 * @returns {string} A formatted string with the names of the current track's writers
	 */
	displayRuntime: ({ runtime }: Track): string => {
		const min = Math.floor(runtime / 60);
		const sec = runtime % 60;
		const and = min === 0 || sec === 0 ? "" : " and ";

		return Page.formatRuntimeUnit("min", min) + and + Page.formatRuntimeUnit("sec", sec);
	},
	/**
	 * Formats a list of the current track's writers as a string.
	 * @param {Track} current - A `Track` object
	 * @returns {string} A formatted string with the names of the current track's writers
	 */
	displayWriters: ({ credits: { writers } }: Track): string => {
		if (writers.length === 1) return writers.join("");
		if (writers.length === 2) return writers.join(" and ");

		const arr = writers.slice();
		const last = arr.pop();
		return arr.join(", ") + ", and " + last;
	},
	/**
	 * Formats a duration of time in its given unit as a string.
	 * @param {string} unit - A unit of time, i.e. `"min"` | `"sec"`
	 * @param {number} duration - A duration of time as an integer
	 * @returns {string} A formatted string with the given duration of time and its unit, e.g. `"3 seconds"`
	 */
	formatRuntimeUnit: (unit: "min" | "sec", duration: number): string =>
		duration === 0 ? "" : `${duration} ${unit === "min" ? "minute" : "second"}${duration > 1 ? "s" : ""}`,
	/**
	 * Renders a credit title in singular or plural as appropriate.
	 * @param {TrackCreditKey} key - A `TrackCreditKey` string
	 * @param {any[]} data - An array of credit data
	 * @returns {string} A formatted string with the credit title
	 */
	renderCreditTitle: (key: TrackCreditKey, data: any[]): string => {
		return key === "producers" || key === "additionalProducers"
			? `${Page.creditTitles[key]}${data.length > 1 ? "s" : ""}`
			: Page.creditTitles[key];
	}
};

export const Status = {
	CHALLENGE_COMPLETED: "The challenge has already been completed.",
	CHALLENGE_DAILY_LIMIT_REACHED: "You've tried the challenge enough times today. Come back tomorrow.",
	CHALLENGE_FAILED: "Your answer was wrong. Try again.",
	CHALLENGE_NOTICE: `NOTICE: By clicking "Enter", you are consenting to the collection and use of your IP address by Ginton Entertainment to keep track of your challenge attempts. If you do not agree to this condition, please do not click "Enter".`,
	CHALLENGE_PROCESSING: "Drum roll, please…",
	CHALLENGE_SUCCESSFUL: "Congratulations! You will receive your prize money shortly."
};
