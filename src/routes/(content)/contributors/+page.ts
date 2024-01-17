import type { PageLoad } from "./$types";
import { serverUrl } from "$lib/helpers";

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await (await fetch(`${serverUrl}/contributors`)).json();
		return { success: true, response };
	} catch (err) {
		console.error(err);
		return {
			error: true,
			message:
				"An error occurred loading the list of contributors. Kindly refresh the page and try again."
		};
	}
};
