import { Utility } from "$lib/helpers/general";

export const load = async ({ locals: { supabase } }) => {
	// Get credits from database
	const { data: credits, error } = await supabase.from("credits").select();
	if (error) {
		const { error: loadError } = Utility.parsePostgrestError(error);
		throw Utility.parseLoadError(loadError!);
	}

	// Return data
	return { credits };
};
