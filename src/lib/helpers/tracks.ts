import type { Track, TracklistVersion, TrackCreditKey, TrackCreditTitles } from "$lib/ambient";

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
				(track) =>
					!track.missingFrom || (track.missingFrom && !track.missingFrom.includes("expanded"))
			);
		else if (ver === "mixtape")
			filtered = tracks.filter(
				(track) =>
					!track.missingFrom || (track.missingFrom && !track.missingFrom.includes("mixtape"))
			);
		else if (ver === "base") filtered = tracks.filter((track) => !track.missingFrom);

		return filtered.map((item, i) => ({ ...item, id: i + 1 }));
	},
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
	}
};

export const Page = {
	/**
	 * Formats a duration of time in its given unit as a string.
	 * @param {string} unit - A unit of time, i.e. `"min"` | `"sec"`
	 * @param {number} duration - A duration of time as an integer
	 * @returns {string} A formatted string with the given duration of time and its unit, e.g. `"3 seconds"`
	 */
	formatRuntimeUnit: (unit: "min" | "sec", duration: number): string =>
		duration === 0
			? ""
			: `${duration} ${unit === "min" ? "minute" : "second"}${duration > 1 ? "s" : ""}`,
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
		return arr.join(", ") + " and " + last;
	},
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
	CHALLENGE_DAILY_LIMIT_REACHED:
		"You've tried the challenge enough times today. Come back tomorrow.",
	CHALLENGE_FAILED: "Your answer was wrong. Try again.",
	CHALLENGE_SUCCESSFUL: "Congratulations! You will receive your prize money shortly."
};
