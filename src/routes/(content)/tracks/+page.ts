import type { PageLoad } from "./$types";
import { tracks } from "$lib/data.json";

export const load: PageLoad = () => {
	return { tracks };
};
