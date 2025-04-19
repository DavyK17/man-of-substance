import type { AlbumCredit } from "$lib/types/general";
import { Utility } from "$lib/helpers/general";

export const load = async ({ locals: { supabase } }) => {
	// Get credits from database
	const { data, error } = await supabase.from("credits").select();
	if (error) {
		const { error: loadError } = Utility.parsePostgrestError(error);
		throw Utility.parseLoadError(loadError!);
	}

	// Sort data
	const credits: AlbumCredit[] = data.sort((a, b) => {
		const order = Object.keys(Utility.creditTitles);
		return order.indexOf(a.key) - order.indexOf(b.key);
	});

	// Return data
	return { credits };
};
