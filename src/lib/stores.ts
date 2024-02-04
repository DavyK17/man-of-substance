import type { Writable, Readable } from "svelte/store";
import type { Track, TracklistVersion } from "./ambient";

import { writable, derived } from "svelte/store";
import { buildTracklist } from "./helpers";

import data from "$lib/data.json";

export const version: Writable<TracklistVersion> = writable("full");
export const tracklist: Readable<Track[]> = derived(version, ($version: TracklistVersion) =>
	buildTracklist(data.tracks as Track[], $version)
);
