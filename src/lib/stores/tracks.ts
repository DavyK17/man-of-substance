import { writable, derived } from "svelte/store";
import data from "$lib/data.json";

import type { Writable, Readable } from "svelte/store";
import type { Track, TracklistVersions } from "$lib";

const tracks = data.tracks as Track[];
const buildTracklist = (ver: TracklistVersions): Track[] => {
	let filtered = tracks;

	if (ver === "expanded")
		filtered = tracks.filter(
			(track) =>
				!track.missingFrom || (track.missingFrom && !track.missingFrom.includes("expanded"))
		);
	else if (ver === "mixtape")
		filtered = tracks.filter(
			(track) => !track.missingFrom || (track.missingFrom && !track.missingFrom.includes("mixtape"))
		);
	else if (ver === "base") filtered = tracks.filter((track) => !track.missingFrom);

	return filtered.map((item, i) => ({ ...item, id: i + 1 }));
};

export const version: Writable<TracklistVersions> = writable("full");
export const tracklist: Readable<Track[]> = derived(version, ($version: TracklistVersions) =>
	buildTracklist($version)
);
