import type { Writable } from "svelte/store";
import type { TracklistVersion } from "$lib/types/general";

import { writable } from "svelte/store";

export const version: Writable<TracklistVersion> = writable("full");
