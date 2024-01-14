import type { PageLoad } from "./$types";
import { credits } from "$lib/data.json";

export const load: PageLoad = () => {
	return { credits };
};
