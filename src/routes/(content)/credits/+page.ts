import type { PageLoad } from "./$types";
import type { Credits } from "$lib";

import { credits } from "$lib/data.json";

export const load: PageLoad = (): Credits => {
	return credits;
};
