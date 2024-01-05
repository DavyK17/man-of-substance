import type { PageServerLoad } from "./$types";

import cover from "$lib/img/cover.webp";
import cover_fallback from "$lib/img/cover.jpg";
import placeholder from "$lib/img/placeholder.webp";
import placeholder_fallback from "$lib/img/placeholder.png";

export const load: PageServerLoad = () => {
	const released = Date.now() > 1667509200000;

	return {
		cover: {
			default: released ? cover : placeholder,
			fallback: released ? cover_fallback : placeholder_fallback
		}
	};
};
