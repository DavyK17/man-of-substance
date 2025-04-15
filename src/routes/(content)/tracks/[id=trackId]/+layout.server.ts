import type { TrackInfoVersion } from "$lib/types/general";
import { redirect } from "@sveltejs/kit";

export const load = ({ request, params }) => {
	const types: TrackInfoVersion[] = ["synopsis", "lyrics", "credits"];
	const url = new URL(request.url);

	for (const type of types) if (url.pathname.includes(type)) return;
	throw redirect(307, `/tracks/${parseInt(params.id)}/synopsis`);
};
