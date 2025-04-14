import { Utility } from "$lib/helpers/general";

export const load = async ({ locals: { supabase } }) => {
	// Get tracks from database
	const { data, error } = await supabase.from("tracks").select();
	if (error) {
		const { error: loadError } = Utility.parsePostgrestError(error);
		throw Utility.parseLoadError(loadError!);
	}

	// Format data
	const tracks = data.map(({ id, title, filename, runtime, style, missing_from }) => ({
		id,
		title,
		filename,
		runtime,
		style,
		missingFrom: missing_from
	}));

	// Return data
	return { tracks };
};
