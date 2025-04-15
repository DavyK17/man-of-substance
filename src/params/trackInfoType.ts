import type { TrackInfoVersion } from "$lib/types/general";

export const match = (param: TrackInfoVersion) => param === "synopsis" || param === "lyrics" || param === "credits";
