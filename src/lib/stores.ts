import type { Writable, Readable } from "svelte/store";
import type { Track, TracklistVersion } from "./ambient";

import { writable, derived } from "svelte/store";
import { tracks } from "./index";
import { List } from "./helpers/tracks";

export const version: Writable<TracklistVersion> = writable("full");
export const tracklist: Readable<Track[]> = derived(version, ($version: TracklistVersion) =>
	List.build(tracks as Track[], $version)
);
