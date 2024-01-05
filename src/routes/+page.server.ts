import type { PageServerLoad } from "./$types";

import cover from "$lib/img/cover.webp";
import cover_fallback from "$lib/img/cover.jpg";
import placeholder from "$lib/img/placeholder.webp";
import placeholder_fallback from "$lib/img/placeholder.png";

export const load: PageServerLoad = () => {
	const locked = Date.now() > 1667059200000 && Date.now() < 1667070000000;

	return {
		locked,
		cover: {
			default: locked ? placeholder : cover,
			fallback: locked ? placeholder_fallback : cover_fallback
		}
	};
};
