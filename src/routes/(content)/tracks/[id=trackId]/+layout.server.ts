import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ request, params }) => {
	let types = ["synopsis", "lyrics", "credits"];
	let url = new URL(request.url);

	for (let type of types) if (url.pathname.includes(type)) return;
	throw redirect(307, `/tracks/${parseInt(params.id)}/synopsis`);
};
