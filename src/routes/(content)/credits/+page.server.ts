import type { PageServerLoad } from "./$types";
import { credits } from "$lib/data.json";

export const load: PageServerLoad = () => {
	return { credits };
};
