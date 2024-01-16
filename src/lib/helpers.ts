import type { Track, TracklistVersion } from "./ambient";

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
