import type { PageServerLoad } from "./$types";
import type { Contributors } from "$lib/ambient";

import { serverUrl } from "$lib/helpers";

export const load: PageServerLoad = async ({
	fetch
}): Promise<{ load: Promise<Contributors | null> }> => {
	try {
		const load: Promise<Contributors> = (
			await fetch(`${serverUrl}/contributors`)
		).json();
		return { load };
	} catch (err) {
		console.log(err);
		return { load: new Promise((resolve) => resolve(null)) };
	}
};
