import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = ({ cookies }) => {
	const contributor = cookies.get("mos-contributor");
	return { loggedIn: typeof contributor === "string" };
};

export const actions: Actions = {
	login: async ({ request, fetch }) => {
		return;
	}
};
