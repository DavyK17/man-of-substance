import type { PageServerLoad } from "./$types";
import type { Contributors } from "$lib/ambient";

import { serverUrl } from "$lib/helpers";

export const load: PageServerLoad = async ({
	fetch
}): Promise<{ loadContributors: Promise<Contributors | null> }> => {
	try {
		const loadContributors: Promise<Contributors> = (
			await fetch(`${serverUrl}/contributors`)
		).json();
		return { loadContributors };
	} catch (err) {
		console.log(err);
		return { loadContributors: new Promise((resolve) => resolve(null)) };
	}
};
